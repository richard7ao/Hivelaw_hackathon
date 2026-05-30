import { NextResponse } from "next/server";

import { getCasesManifest } from "@/lib/cases/manifest";
import { runAnthropicIntake } from "@/lib/intake/anthropic";
import { mapFormFileToAttachment } from "@/lib/intake/files";
import { runLocalIntakeDemo } from "@/lib/intake/fallback";
import type {
  IntakeEvaluationMode,
  IntakeMessageInput,
  IntakeReport,
  IntakeReportParagraph,
  IntakeTurnResult,
} from "@/lib/intake/types";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const rawMessages = formData.get("messages");
    const messages = parseMessages(rawMessages);
    const files = formData.getAll("files").filter((value): value is File => value instanceof File);
    const attachments = await Promise.all(files.map(mapFormFileToAttachment));
    const cases = await getCasesManifest();
    const evaluationMode = parseEvaluationMode(formData.get("evaluationMode"));
    const fallbackResult = runLocalIntakeDemo(messages, attachments, cases, evaluationMode);

    const anthropicResult = await runAnthropicIntake(
      files,
      attachments,
      messages,
      cases,
      evaluationMode,
    );

    if (anthropicResult) {
      return NextResponse.json(finalizeIntakeResult(anthropicResult, fallbackResult, evaluationMode));
    }

    return NextResponse.json(fallbackResult);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown intake error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function finalizeIntakeResult(
  primary: IntakeTurnResult,
  fallback: IntakeTurnResult,
  evaluationMode: IntakeEvaluationMode,
): IntakeTurnResult {
  if (evaluationMode === "none") {
    if (primary.canEvaluateNow && !fallback.canEvaluateNow) {
      return fallback;
    }

    if (primary.canEvaluateNow && !hasMinimumReport(primary.report)) {
      return {
        ...primary,
        currentStage: fallback.currentStage,
        reportScaffold: primary.reportScaffold ?? fallback.reportScaffold,
        report: mergeReport(primary.report, fallback.report),
      };
    }

    return primary;
  }

  return {
    ...primary,
    currentStage: fallback.currentStage,
    readinessScore: Math.max(primary.readinessScore, fallback.readinessScore),
    matchedCaseTypes: primary.matchedCaseTypes.length
      ? primary.matchedCaseTypes
      : fallback.matchedCaseTypes,
    caseSummary: primary.caseSummary || fallback.caseSummary,
    knownFacts: primary.knownFacts.length ? primary.knownFacts : fallback.knownFacts,
    missingFacts: primary.missingFacts.length ? primary.missingFacts : fallback.missingFacts,
    followUpQuestions: [],
    fileRequests: primary.fileRequests.length ? primary.fileRequests : fallback.fileRequests,
    canEvaluateNow: true,
    assistantMessage: fallback.assistantMessage,
    assistantHighlights: [],
    reportScaffold: primary.reportScaffold ?? fallback.reportScaffold,
    report: mergeReport(primary.report, fallback.report),
  };
}

function hasMinimumReport(report: IntakeReport) {
  return Boolean(
    report.title.trim() &&
      report.summary.trim() &&
      report.paragraphs.some((paragraph) => paragraph.text.trim()) &&
      report.forPoints.some((point) => point.trim()) &&
      report.counterPoints.some((point) => point.trim()),
  );
}

function mergeReport(primary: IntakeReport, fallback: IntakeReport): IntakeReport {
  const paragraphs = filterParagraphs(primary.paragraphs);
  const forPoints = filterStrings(primary.forPoints);
  const counterPoints = filterStrings(primary.counterPoints);

  return {
    ready: true,
    title: primary.title.trim() || fallback.title,
    subtitle: primary.subtitle.trim() || fallback.subtitle,
    paragraphs: paragraphs.length ? paragraphs : fallback.paragraphs,
    forPoints: forPoints.length ? forPoints : fallback.forPoints,
    counterPoints: counterPoints.length ? counterPoints : fallback.counterPoints,
    summary: primary.summary.trim() || fallback.summary,
    prospects: primary.prospects === "pending" ? fallback.prospects : primary.prospects,
    recommendation: primary.recommendation,
  };
}

function filterParagraphs(paragraphs: IntakeReportParagraph[]) {
  return paragraphs.filter((paragraph) => paragraph.text.trim());
}

function filterStrings(values: string[]) {
  return values.map((value) => value.trim()).filter(Boolean);
}

function parseEvaluationMode(rawMode: FormDataEntryValue | null): IntakeEvaluationMode {
  return rawMode === "user-requested" || rawMode === "turn-limit" ? rawMode : "none";
}

function parseMessages(rawMessages: FormDataEntryValue | null): IntakeMessageInput[] {
  if (typeof rawMessages !== "string") {
    return [];
  }

  const parsed = JSON.parse(rawMessages) as IntakeMessageInput[];

  return parsed.filter(
    (message) =>
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string",
  );
}
