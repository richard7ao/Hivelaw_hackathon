import type { IntakeTurnResult } from "./types";

export const INTAKE_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    currentStage: {
      type: "string",
      enum: [
        "understanding-problem",
        "clarifying-facts",
        "collecting-evidence",
        "ready-for-evaluation",
        "final-evaluation",
        "report-handoff",
      ],
    },
    readinessScore: { type: "integer" },
    matchedCaseTypes: { type: "array", items: { type: "string" } },
    caseSummary: { type: "string" },
    knownFacts: { type: "array", items: { type: "string" } },
    missingFacts: { type: "array", items: { type: "string" } },
    followUpQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          reason: { type: "string" },
        },
        required: ["question", "reason"],
        additionalProperties: false,
      },
    },
    fileRequests: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          reason: { type: "string" },
          optional: { type: "boolean" },
          satisfied: { type: "boolean" },
        },
        required: ["title", "reason", "optional", "satisfied"],
        additionalProperties: false,
      },
    },
    canEvaluateNow: { type: "boolean" },
    assistantMessage: { type: "string" },
    assistantHighlights: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: { type: "string" },
          type: { type: "string", enum: ["support", "flag"] },
        },
        required: ["text", "type"],
        additionalProperties: false,
      },
    },
    reportScaffold: {
      type: "object",
      properties: {
        bestCase: { type: "string" },
        counterArgument: { type: "array", items: { type: "string" } },
        evidenceGaps: { type: "array", items: { type: "string" } },
        recommendation: { type: "string" },
      },
      required: [
        "bestCase",
        "counterArgument",
        "evidenceGaps",
        "recommendation",
      ],
      additionalProperties: false,
    },
    report: {
      type: "object",
      properties: {
        ready: { type: "boolean" },
        title: { type: "string" },
        subtitle: { type: "string" },
        paragraphs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              highlights: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    text: { type: "string" },
                    type: { type: "string", enum: ["support", "flag"] },
                  },
                  required: ["text", "type"],
                  additionalProperties: false,
                },
              },
            },
            required: ["text", "highlights"],
            additionalProperties: false,
          },
        },
        forPoints: { type: "array", items: { type: "string" } },
        counterPoints: { type: "array", items: { type: "string" } },
        summary: { type: "string" },
        prospects: { type: "string", enum: ["strong", "arguable", "weak", "pending"] },
        recommendation: {
          type: "string",
          enum: ["self-serve", "escalate-to-solicitor", "reconsider-pursuing"],
        },
      },
      required: [
        "ready",
        "title",
        "subtitle",
        "paragraphs",
        "forPoints",
        "counterPoints",
        "summary",
        "prospects",
        "recommendation",
      ],
      additionalProperties: false,
    },
  },
  required: [
    "currentStage",
    "readinessScore",
    "matchedCaseTypes",
    "caseSummary",
    "knownFacts",
    "missingFacts",
    "followUpQuestions",
    "fileRequests",
    "canEvaluateNow",
    "assistantMessage",
    "assistantHighlights",
    "report",
  ],
  additionalProperties: false,
} as const;

export function normalizeIntakeResult(
  raw: Partial<IntakeTurnResult>,
  engine: IntakeTurnResult["engine"],
): IntakeTurnResult {
  const readinessScore = Number.isFinite(raw.readinessScore)
    ? Math.max(0, Math.min(100, Math.round(raw.readinessScore ?? 0)))
    : 0;

  return {
    engine,
    currentStage: raw.currentStage ?? "understanding-problem",
    readinessScore,
    matchedCaseTypes: raw.matchedCaseTypes ?? [],
    caseSummary: raw.caseSummary ?? "",
    knownFacts: raw.knownFacts ?? [],
    missingFacts: raw.missingFacts ?? [],
    followUpQuestions: raw.followUpQuestions ?? [],
    fileRequests: (raw.fileRequests ?? []).map((request) => ({
      ...request,
      satisfied: request.satisfied ?? false,
    })),
    canEvaluateNow: raw.canEvaluateNow ?? false,
    assistantMessage:
      raw.assistantMessage ??
      "Tell me what happened in plain English and I’ll work out what matters next.",
    assistantHighlights: (raw.assistantHighlights ?? []).filter(
      // Only keep highlights that appear verbatim in the message (anti-hallucination).
      (highlight) => highlight.text && raw.assistantMessage?.includes(highlight.text),
    ),
    reportScaffold: raw.reportScaffold,
    report: {
      ready: raw.report?.ready ?? false,
      title: raw.report?.title ?? "Case assessment",
      subtitle: raw.report?.subtitle ?? "Draft assessment — still gathering facts",
      paragraphs: (raw.report?.paragraphs ?? []).map((paragraph) => ({
        text: paragraph.text ?? "",
        highlights: (paragraph.highlights ?? []).filter(
          // Anti-hallucination: keep only highlights that are verbatim
          // substrings of their paragraph (they render as inline <mark>).
          (highlight) => highlight.text && paragraph.text?.includes(highlight.text),
        ),
      })),
      forPoints: raw.report?.forPoints ?? [],
      counterPoints: raw.report?.counterPoints ?? [],
      summary: raw.report?.summary ?? "",
      prospects: raw.report?.prospects ?? "pending",
      recommendation: raw.report?.recommendation ?? "escalate-to-solicitor",
    },
  };
}
