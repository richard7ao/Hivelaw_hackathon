import type { CaseManifestEntry } from "@/lib/cases/manifest";

import { normalizeIntakeResult } from "./schema";
import type {
  FileRequest,
  FollowUpQuestion,
  IntakeAttachmentInput,
  IntakeMessageInput,
  IntakeTurnResult,
} from "./types";

type BucketScores = {
  problemSummary: boolean;
  parties: boolean;
  timeline: boolean;
  desiredOutcome: boolean;
  existingEvidence: boolean;
  priorActions: boolean;
  urgency: boolean;
  attachments: boolean;
};

export function runLocalIntakeDemo(
  messages: IntakeMessageInput[],
  attachments: IntakeAttachmentInput[],
  cases: CaseManifestEntry[],
  forceEvaluate = false,
): IntakeTurnResult {
  const userTranscript = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .join("\n\n");
  const matchedCases = rankCases(userTranscript, cases).slice(0, 2);
  const primaryCase = matchedCases[0] ?? cases[0];
  const buckets = scoreBuckets(userTranscript, attachments);
  const readinessScore = computeReadinessScore(buckets);
  const knownFacts = buildKnownFacts(userTranscript, attachments, primaryCase, buckets);
  const missingFacts = buildMissingFacts(userTranscript, primaryCase, buckets);
  const fileRequests = buildFileRequests(userTranscript, attachments, primaryCase);
  const followUpQuestions = buildFollowUpQuestions(primaryCase, missingFacts);
  // The user can choose to skip ahead at any point ("run the analysis now").
  // We still surface the evidence gaps, so a forced early assessment is honest
  // about what is missing rather than pretending the file is complete.
  const canEvaluateNow =
    forceEvaluate ||
    (readinessScore >= 78 && buckets.problemSummary && buckets.timeline && buckets.desiredOutcome);
  const currentStage = canEvaluateNow
    ? "ready-for-evaluation"
    : fileRequests.length > 0
      ? "collecting-evidence"
      : readinessScore > 45
        ? "clarifying-facts"
        : "understanding-problem";
  const reportScaffold = canEvaluateNow
    ? buildReportScaffold(userTranscript, primaryCase, attachments)
    : undefined;

  const assistantMessage = canEvaluateNow
    ? forceEvaluate
      ? "Understood — I'm running a first-pass assessment now with what you've shared. It's below. I've kept the evidence-gap list prominent so you can see exactly what would still strengthen the case."
      : "I have enough for a first-pass assessment. I'm moving into final evaluation now, and you can still add more context or files if you want me to tighten the report."
    : buildAssistantPrompt(followUpQuestions, fileRequests);

  return normalizeIntakeResult(
    {
      currentStage,
      readinessScore,
      matchedCaseTypes: matchedCases.map((entry) => entry.title),
      caseSummary: summarizeCase(userTranscript, primaryCase, attachments),
      knownFacts,
      missingFacts,
      followUpQuestions,
      fileRequests,
      canEvaluateNow,
      assistantMessage,
      reportScaffold,
    },
    "local-demo",
  );
}

function rankCases(transcript: string, cases: CaseManifestEntry[]) {
  const words = new Set(normalizeWords(transcript));

  return [...cases]
    .map((entry) => ({
      entry,
      score: entry.keywords.reduce((total, keyword) => total + Number(words.has(keyword)), 0),
    }))
    .sort((left, right) => right.score - left.score)
    .map(({ entry }) => entry);
}

function normalizeWords(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3);
}

function scoreBuckets(
  transcript: string,
  attachments: IntakeAttachmentInput[],
): BucketScores {
  const has = (pattern: RegExp) => pattern.test(transcript);

  return {
    problemSummary: transcript.trim().length >= 60,
    parties: has(/\b(landlord|council|agent|tenant|housing association|scheme|freeholder)\b/i),
    timeline: has(/\b(since|for|weeks?|months?|years?|january|february|march|april|may|june|july|august|september|october|november|december|ago|202\d|yesterday|today)\b/i),
    desiredOutcome: has(/\b(want|need|outcome|fixed|repair|refund|compensation|safe|deposit back|move out)\b/i),
    existingEvidence:
      attachments.length > 0 ||
      has(/\b(photo|photos|email|emails|letter|agreement|contract|report|bank statement|screenshot|form|doctor|gp)\b/i),
    priorActions: has(/\b(reported|emailed|called|complained|inspected|inspection|checked|searched|chased|replied|reassigned)\b/i),
    urgency: has(/\b(urgent|deadline|court|evict|health|doctor|gp|child|children|cough|asthma|unsafe)\b/i),
    attachments: attachments.length > 0,
  };
}

function computeReadinessScore(buckets: BucketScores) {
  return [
    buckets.problemSummary ? 20 : 0,
    buckets.parties ? 15 : 0,
    buckets.timeline ? 15 : 0,
    buckets.desiredOutcome ? 10 : 0,
    buckets.existingEvidence ? 15 : 0,
    buckets.priorActions ? 10 : 0,
    buckets.urgency ? 5 : 0,
    buckets.attachments ? 10 : 0,
  ].reduce((total, score) => total + score, 0);
}

function buildKnownFacts(
  transcript: string,
  attachments: IntakeAttachmentInput[],
  primaryCase: CaseManifestEntry | undefined,
  buckets: BucketScores,
) {
  const facts: string[] = [];

  if (buckets.problemSummary) {
    facts.push("The user has provided a concrete problem summary in plain English.");
  }
  if (buckets.parties) {
    facts.push("The other side or responsible party is at least partly identifiable.");
  }
  if (buckets.timeline) {
    facts.push("There is some timeline information in the intake.");
  }
  if (buckets.priorActions) {
    facts.push("The user has already taken some steps before coming to Hivelaw.");
  }
  if (attachments.length > 0) {
    facts.push(`Files uploaded so far: ${attachments.map((attachment) => attachment.name).join(", ")}.`);
  }
  if (primaryCase) {
    facts.push(`Closest current intake pattern: ${primaryCase.title}.`);
  }
  if (/health|gp|doctor|cough|child|children|asthma/i.test(transcript)) {
    facts.push("There may be a health or child-welfare impact.");
  }

  return facts;
}

function buildMissingFacts(
  transcript: string,
  primaryCase: CaseManifestEntry | undefined,
  buckets: BucketScores,
) {
  const missing = [] as string[];

  if (!buckets.parties) {
    missing.push("Who the other side is");
  }
  if (!buckets.timeline) {
    missing.push("When the problem started and key dates since then");
  }
  if (!buckets.desiredOutcome) {
    missing.push("What outcome the user wants most");
  }
  if (!buckets.priorActions) {
    missing.push("What has already been reported, sent, or checked");
  }
  if (!buckets.existingEvidence) {
    missing.push("What evidence exists already");
  }
  if (
    primaryCase?.domain === "housing-disrepair" &&
    !/health|gp|doctor|cough|asthma|child|children/i.test(transcript)
  ) {
    missing.push("Whether anyone's health is being affected");
  }

  return missing;
}

function buildFileRequests(
  transcript: string,
  attachments: IntakeAttachmentInput[],
  primaryCase: CaseManifestEntry | undefined,
) {
  const hasNamedAttachment = (keyword: string) =>
    attachments.some((attachment) => attachment.name.toLowerCase().includes(keyword));
  const hasImage = attachments.some((attachment) => attachment.kind === "image-evidence");

  // The checklist is persistent: every item the case needs stays in the list,
  // and `satisfied` flips to true once a matching upload is detected. The UI
  // ticks items off rather than dropping them.
  const requests: FileRequest[] = [];

  if (primaryCase?.domain === "housing-disrepair") {
    requests.push({
      title: "Upload the tenancy agreement",
      reason:
        "The repair obligations and parties are usually confirmed fastest from the tenancy wording.",
      optional: false,
      satisfied: hasNamedAttachment("tenancy"),
    });
    requests.push({
      title: "Upload dated photos of the damp or mould",
      reason:
        "Progression over time is often more persuasive than a summary, especially where the other side may say it is only condensation.",
      optional: false,
      satisfied: hasImage || hasNamedAttachment("photo"),
    });
    if (/email|emails|council|landlord|report/i.test(transcript)) {
      requests.push({
        title: "Upload the email chain or written complaint trail",
        reason:
          "The dates and wording will show notice, delay, and whether the response changed over time.",
        optional: false,
        satisfied: hasNamedAttachment("email") || hasNamedAttachment("chain"),
      });
    }
    if (/gp|doctor|cough|asthma|health|child|children/i.test(transcript)) {
      requests.push({
        title: "Upload any GP or medical letter",
        reason:
          "Health impact can materially strengthen the seriousness of the case and the urgency of action.",
        optional: true,
        satisfied: hasNamedAttachment("gp") || hasNamedAttachment("medical") || hasNamedAttachment("doctor"),
      });
    }
  }

  if (primaryCase?.domain === "deposit-protection") {
    requests.push({
      title: "Upload the tenancy agreement",
      reason:
        "It usually confirms the tenancy start date, deposit amount, and how the landlord described deposit protection.",
      optional: false,
      satisfied: hasNamedAttachment("tenancy"),
    });
    requests.push({
      title: "Upload proof of the deposit payment",
      reason: "The payment date is central to whether protection deadlines were missed.",
      optional: false,
      satisfied: hasNamedAttachment("bank") || hasNamedAttachment("receipt") || hasNamedAttachment("payment"),
    });
    requests.push({
      title: "Upload screenshots from the deposit scheme searches",
      reason:
        "They are the quickest way to show the deposit cannot currently be found in the main schemes.",
      optional: true,
      satisfied: attachments.some((attachment) => /dps|tds|mydeposits/i.test(attachment.name)),
    });
  }

  return requests.filter(
    (request, index, items) =>
      items.findIndex((item) => item.title === request.title) === index,
  );
}

function buildFollowUpQuestions(
  primaryCase: CaseManifestEntry | undefined,
  missingFacts: string[],
) {
  const questions: FollowUpQuestion[] = [];

  if (missingFacts[0]) {
    questions.push({
      question: `What is the most important missing piece here: ${missingFacts[0].toLowerCase()}?`,
      reason: "That answer changes whether I should keep clarifying facts or move straight into evaluation.",
    });
  }

  if (primaryCase?.followUpFocus[0]) {
    questions.push({
      question: primaryCase.followUpFocus[0],
      reason: "That is the first fact pattern the strongest similar case bundles had in common.",
    });
  }

  return questions.slice(0, 2);
}

function buildReportScaffold(
  transcript: string,
  primaryCase: CaseManifestEntry | undefined,
  attachments: IntakeAttachmentInput[],
) {
  if (primaryCase?.domain === "deposit-protection") {
    return {
      bestCase:
        "If the deposit was paid, the tenancy started, and the deposit still cannot be traced to a protection scheme, the user's strongest case is that the statutory protection obligations were missed.",
      counterArgument: [
        "The landlord may argue the deposit was protected under a different reference or name variation.",
        "The landlord may argue the intake still lacks clean proof of payment date or tenancy commencement.",
      ],
      evidenceGaps: [
        "Tenancy agreement confirming the start date and deposit clause.",
        "Bank statement or receipt showing the deposit payment.",
        "Screenshots from the deposit scheme searches.",
      ],
      recommendation:
        "Prepare a first-pass deposit protection assessment and hold room in the report for the exact payment date, scheme checks, and compensation range.",
    };
  }

  const mentionsSignedForm = /signed|form|satisfaction/i.test(transcript);
  const hasMedical = attachments.some((attachment) => /gp|doctor|medical/i.test(attachment.name));

  return {
    bestCase:
      "The user's strongest argument is that the disrepair has persisted over time, has already been reported, and there is enough evidence to frame a first housing conditions assessment.",
    counterArgument: [
      mentionsSignedForm
        ? "The other side may rely on the signed works form to say the issue was resolved or accepted as resolved."
        : "The other side may say the issue is condensation or user lifestyle rather than a repair defect.",
      "Without a clean written timeline, the other side may downplay notice or the seriousness of the delay.",
    ],
    evidenceGaps: [
      "Tenancy agreement confirming the landlord or council relationship.",
      "Written complaint trail showing when notice was given.",
      hasMedical
        ? "Any inspection or survey that helps distinguish structural damp from condensation."
        : "Any medical or GP evidence if the living conditions are affecting health.",
    ],
    recommendation:
      "Build the report scaffold now, but keep the evidence-gap section prominent so the user knows exactly what would strengthen the file before escalation.",
  };
}

function summarizeCase(
  transcript: string,
  primaryCase: CaseManifestEntry | undefined,
  attachments: IntakeAttachmentInput[],
) {
  const trimmed = transcript.replace(/\s+/g, " ").trim();
  const firstSentence = trimmed.split(/[.!?]/)[0] ?? trimmed;
  const evidenceTail = attachments.length
    ? ` Evidence in hand: ${attachments.map((attachment) => attachment.name).join(", ")}.`
    : "";

  return `${firstSentence || "The user has started describing their issue."}${
    primaryCase ? ` Closest intake pattern: ${primaryCase.title}.` : ""
  }${evidenceTail}`;
}

function buildAssistantPrompt(
  questions: FollowUpQuestion[],
  fileRequests: FileRequest[],
) {
  const question = questions[0];
  const fileRequest = fileRequests[0];

  if (!question && !fileRequest) {
    return "Tell me a little more about what happened and what you want out of this, and I’ll tighten the assessment.";
  }

  if (!fileRequest) {
    return `${question.question} ${question.reason}`;
  }

  if (!question) {
    return `${fileRequest.title}. ${fileRequest.reason}`;
  }

  return `${question.question} ${question.reason} If you have it, ${fileRequest.title.toLowerCase()}. ${fileRequest.reason}`;
}
