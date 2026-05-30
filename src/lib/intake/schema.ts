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
    reportScaffold: raw.reportScaffold,
  };
}
