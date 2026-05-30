export type IntakeStage =
  | "understanding-problem"
  | "clarifying-facts"
  | "collecting-evidence"
  | "ready-for-evaluation"
  | "final-evaluation"
  | "report-handoff";

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
};

export type ReportScaffold = {
  bestCase: string;
  counterArgument: string[];
  evidenceGaps: string[];
  recommendation: string;
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
  reportScaffold?: ReportScaffold;
};
