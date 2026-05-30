export type IntakeStage =
  | "understanding-problem"
  | "clarifying-facts"
  | "collecting-evidence"
  | "ready-for-evaluation"
  | "final-evaluation"
  | "report-handoff";

export type IntakeEvaluationMode = "none" | "user-requested" | "turn-limit";

export type IntakeMessageInput = {
  role: "user" | "assistant";
  content: string;
};

export type IntakeAttachmentKind =
  | "text-source"
  | "pdf-document"
  | "image-evidence"
  | "unknown-needs-review";

export type IntakeAttachmentInput = {
  name: string;
  kind: IntakeAttachmentKind;
  size: number;
  mimeType: string;
  textContent?: string;
};

export type FollowUpQuestion = {
  question: string;
  reason: string;
};

export type FileRequest = {
  title: string;
  reason: string;
  optional: boolean;
  // True when the model judges that an already-uploaded file satisfies this
  // request — drives the ticked-off state in the evidence checklist.
  satisfied: boolean;
};

export type ReportScaffold = {
  bestCase: string;
  counterArgument: string[];
  evidenceGaps: string[];
  recommendation: string;
};

export type ReportHighlightType = "support" | "flag";

export type IntakeReportHighlight = {
  text: string;
  type: ReportHighlightType;
};

export type IntakeReportParagraph = {
  text: string;
  highlights: IntakeReportHighlight[];
};

// A single Steelman chain: the opponent's best argument, grounded in a verbatim
// quote from the user's OWN evidence, then answered. Mirrors demo-data's
// SteelmanChain so the report's "The Steelman" tab renders it directly.
export type IntakeSteelmanChain = {
  opponentArgument: string;
  sourceQuote: string; // VERBATIM from the user's documents/messages
  quoteCaption: string; // where the quote is from
  reply: string;
  statute: string;
  verdict: "arguable" | "strong-for-them";
  unresolvedNote: string;
};

// The agent's selection of a relevant statute from the closed reference catalog
// (it returns an id from the catalog + how it applies — never invents statute text).
export type IntakeReferenceSelection = {
  id: string;
  relevance: "high" | "moderate" | "low";
  application: string;
};

// The live Case Reality Report the agent builds during the conversation.
// Mirrors demo-context ReportData + AnalysisData (see report-structure.json) so
// the /demo/report page can render it directly.
export type IntakeReport = {
  ready: boolean;
  title: string;
  subtitle: string;
  paragraphs: IntakeReportParagraph[];
  forPoints: string[];
  counterPoints: string[];
  summary: string;
  prospects: "strong" | "arguable" | "weak" | "pending";
  recommendation: "self-serve" | "escalate-to-solicitor" | "reconsider-pursuing";
  steelman: IntakeSteelmanChain[];
  references: IntakeReferenceSelection[];
};

export type IntakeTurnResult = {
  engine: "anthropic" | "local-demo";
  currentStage: IntakeStage;
  readinessScore: number;
  matchedCaseTypes: string[];
  caseSummary: string;
  knownFacts: string[];
  missingFacts: string[];
  followUpQuestions: FollowUpQuestion[];
  fileRequests: FileRequest[];
  canEvaluateNow: boolean;
  assistantMessage: string;
  // Verbatim substrings of assistantMessage to highlight inline in the chat:
  // "support" = good for the user (green), "flag" = a risk/issue against them (red).
  assistantHighlights: IntakeReportHighlight[];
  reportScaffold?: ReportScaffold;
  // Progressively-built report; ready=false until there's enough to render.
  report: IntakeReport;
};
