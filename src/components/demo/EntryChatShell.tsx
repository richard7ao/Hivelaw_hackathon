"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import SteelmanLogo from "@/components/SteelmanLogo";
import { useDemoContext } from "@/lib/demo-context";
import { classifyAttachment } from "@/lib/intake/files";
import type {
  IntakeAttachmentKind,
  IntakeEvaluationMode,
  IntakeTurnResult,
} from "@/lib/intake/types";

const MAX_ASSISTANT_FOLLOW_UPS = 2;
const MAX_INTAKE_USER_TURNS = MAX_ASSISTANT_FOLLOW_UPS + 1;

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments: Array<{ name: string; kind: IntakeAttachmentKind }>;
  highlights?: Array<{ text: string; type: "support" | "flag" }>;
};

type SessionFile = {
  id: string;
  file: File;
  kind: IntakeAttachmentKind;
};

export default function EntryChatShell() {
  const router = useRouter();
  const { setReport, addUserFile } = useDemoContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pendingFiles, setPendingFiles] = useState<SessionFile[]>([]);
  const [sessionFiles, setSessionFiles] = useState<SessionFile[]>([]);
  const [result, setResult] = useState<IntakeTurnResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [isPickingFiles, setIsPickingFiles] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const visibleProgress = result?.readinessScore ?? 5;
  const stageLabel = formatStage(result?.currentStage ?? "understanding-problem");
  const allEvidence = useMemo(() => sessionFiles, [sessionFiles]);
  const userTurnCount = countUserMessages(messages);

  // The sidebar (progress + evidence + scaffold) only matters once the case has
  // begun. Before the first message it's hidden; on the first turn the grid
  // animates the chat narrower and slides the sidebar in.
  const hasStarted = messages.length > 0;
  // Once the report has enough to view, a non-blocking CTA fades in above the
  // composer. Fast-forward also flips this true (it forces report.ready).
  const reportReady = result?.report?.ready ?? false;

  const suggestions = [
    "My landlord won't fix the damp and mould in my flat.",
    "I paid a deposit and never got the protection details.",
    "A builder did poor work and won't refund me.",
  ];

  useEffect(() => {
    if (!isPickingFiles || typeof window === "undefined") {
      return;
    }

    const handleFocus = () => setIsPickingFiles(false);

    window.addEventListener("focus", handleFocus, { once: true });
    return () => window.removeEventListener("focus", handleFocus);
  }, [isPickingFiles]);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";

    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = Number.parseFloat(computedStyle.lineHeight) || 24;
    const paddingTop = Number.parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = Number.parseFloat(computedStyle.paddingBottom) || 0;
    const borderTop = Number.parseFloat(computedStyle.borderTopWidth) || 0;
    const borderBottom = Number.parseFloat(computedStyle.borderBottomWidth) || 0;
    const maxHeight = lineHeight * 3 + paddingTop + paddingBottom + borderTop + borderBottom;

    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [draft]);

  function queueFiles(fileList: FileList | null) {
    setIsPickingFiles(false);

    if (!fileList) return;

    const nextFiles = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file,
      kind: classifyAttachment(file.name, file.type || "application/octet-stream"),
    }));

    setPendingFiles((current) => dedupeFiles([...current, ...nextFiles]));
  }

  function openFilePicker() {
    if (isPending || isPickingFiles) {
      return;
    }

    setIsPickingFiles(true);
    fileInputRef.current?.click();
  }

  function removePendingFile(id: string) {
    setPendingFiles((current) => current.filter((file) => file.id !== id));
  }

  function removeSessionFile(id: string) {
    setSessionFiles((current) => current.filter((file) => file.id !== id));
  }

  function sendTurn(options?: { force?: boolean }) {
    const force = options?.force ?? false;

    if (isPending) {
      return;
    }
    if (!force && !draft.trim() && pendingFiles.length === 0) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content:
        draft.trim() ||
        (force
          ? "Go ahead and run my assessment now with what I've shared so far."
          : "Uploaded supporting evidence."),
      attachments: pendingFiles.map((file) => ({ name: file.file.name, kind: file.kind })),
    };

    const nextMessages = [...messages, userMessage];
    const nextSessionFiles = dedupeFiles([...sessionFiles, ...pendingFiles]);
    const nextUserTurnCount = countUserMessages(nextMessages);
    const evaluationMode: IntakeEvaluationMode = force
      ? "user-requested"
      : nextUserTurnCount >= MAX_INTAKE_USER_TURNS
        ? "turn-limit"
        : "none";
    const turnPendingStatus = buildPendingStatus({
      force,
      evaluationMode,
      nextUserTurnCount,
      files: pendingFiles,
    });

    // Surface the user's uploads on the report's Documents tab (preview via a
    // blob URL that stays valid for in-app navigation).
    pendingFiles.forEach((pendingFile) => {
      addUserFile({
        name: pendingFile.file.name,
        url: URL.createObjectURL(pendingFile.file),
        type:
          pendingFile.kind === "image-evidence"
            ? "image"
            : pendingFile.kind === "pdf-document"
              ? "pdf"
              : "other",
      });
    });

    setMessages(nextMessages);
    setSessionFiles(nextSessionFiles);
    setDraft("");
    setPendingFiles([]);
    setPendingStatus(turnPendingStatus);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append(
          "messages",
          JSON.stringify(
            nextMessages.map((message) => ({ role: message.role, content: message.content })),
          ),
        );

        nextSessionFiles.forEach((sessionFile) => {
          formData.append("files", sessionFile.file);
        });

        if (evaluationMode !== "none") {
          formData.append("evaluationMode", evaluationMode);
        }

        const response = await fetch("/api/intake", {
          method: "POST",
          body: formData,
        });

        const responseText = await response.text();
        const payload = parseJsonResponse(responseText);

        if (!response.ok) {
          throw new Error(
            payload && typeof payload === "object" && "error" in payload
              ? String(payload.error ?? "The intake request failed.")
              : "The intake request failed.",
          );
        }

        if (!payload) {
          throw new Error("The intake response was malformed.");
        }

        const intakeResult = payload as IntakeTurnResult;
        setResult(intakeResult);

        // Progressively push the live report into the shared demo context so the
        // /demo/report page reflects the conversation (and is persisted locally).
        const liveReport = intakeResult.report;
        if (
          liveReport &&
          (liveReport.ready ||
            liveReport.paragraphs.length > 0 ||
            liveReport.forPoints.length > 0 ||
            liveReport.counterPoints.length > 0)
        ) {
          setReport(liveReport);
        }
        setPendingStatus(null);
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: intakeResult.assistantMessage,
            attachments: [],
            highlights: intakeResult.assistantHighlights,
          },
        ]);
      } catch (submissionError) {
        setPendingStatus(null);
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "The intake request failed.",
        );
      }
    });
  }

  return (
    <section className="dot-grid h-[calc(100dvh-4rem)] overflow-hidden bg-canvas">
      <div className="mx-auto flex h-full max-w-[80rem] flex-col px-4 py-4 sm:px-6 sm:py-6">
        <div
          className={`grid min-h-0 flex-1 gap-4 transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:gap-6 ${
            hasStarted
              ? "lg:grid-cols-[minmax(0,1fr)_22rem]"
              : "lg:grid-cols-[minmax(0,1fr)_0rem]"
          }`}
        >
          {/* ── Chat column ───────────────────────────────────────────── */}
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.5rem] border border-line bg-paper shadow-[0_1px_0_rgba(0,0,0,0.02),0_24px_48px_-32px_rgba(40,20,20,0.38)]">
            {/* Scrollable transcript */}
            <div className="scroll-thin min-h-0 flex-1 overflow-y-auto bg-canvas px-4 py-6 sm:px-6">
              {messages.length === 0 ? (
                <EmptyState
                  suggestions={suggestions}
                  onPick={(text) => setDraft(text)}
                />
              ) : (
                <div className="mx-auto flex max-w-2xl flex-col gap-5">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  {isPending ? <TypingBubble status={pendingStatus} /> : null}
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-line bg-paper px-4 py-4 sm:px-6">
              {reportReady ? (
                <div className="mb-3 rounded-2xl border border-accent/20 bg-accent-tint p-3">
                  <button
                    type="button"
                    onClick={() => router.push("/demo/report")}
                    className="report-cta-in flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-paper shadow-[0_8px_24px_-10px_rgba(150,20,20,0.7)] transition-colors hover:bg-accent-deep"
                  >
                    <SteelmanLogo className="h-4 w-4" />
                    Your first-pass report is ready — view it
                    <span aria-hidden>&rarr;</span>
                  </button>
                  <p className="mt-2 px-1 text-xs leading-relaxed text-accent">
                    You can still add more context or upload more evidence below, and I&apos;ll update the report.
                  </p>
                </div>
              ) : userTurnCount >= MAX_INTAKE_USER_TURNS - 1 ? (
                <button
                  type="button"
                  onClick={() => sendTurn({ force: true })}
                  disabled={isPending}
                  className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-accent/30 bg-accent-tint px-4 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span aria-hidden>&#9889;</span>
                  Skip the questions — run my assessment now
                </button>
              ) : null}

              {pendingFiles.length > 0 ? (
                <div className="mb-3 flex flex-wrap gap-2">
                  {pendingFiles.map((pendingFile) => (
                    <button
                      key={pendingFile.id}
                      type="button"
                      onClick={() => removePendingFile(pendingFile.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-accent/30 hover:text-ink"
                    >
                      <span aria-hidden>📎</span>
                      <span>{pendingFile.file.name}</span>
                      <span aria-hidden className="text-ink-faint">&times;</span>
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="flex items-end gap-2 rounded-3xl border border-line bg-canvas px-2 py-2 transition-colors focus-within:border-accent/40">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    queueFiles(event.target.files);
                    event.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={openFilePicker}
                  title={isPickingFiles ? "Opening file picker..." : "Attach files (PDF, image, text)"}
                  disabled={isPending || isPickingFiles}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-lg text-ink-soft transition-colors hover:bg-canvas-deep hover:text-ink disabled:cursor-wait disabled:opacity-70"
                >
                  {isPickingFiles ? (
                    <span aria-hidden className="steelman-spin inline-flex">
                      <SteelmanLogo className="h-4 w-4 text-accent" />
                    </span>
                  ) : (
                    <span aria-hidden>+</span>
                  )}
                  <span className="sr-only">Attach files</span>
                </button>

                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendTurn();
                    }
                  }}
                  placeholder="Tell us what happened, who the other side is, when it started, what you want, and any evidence you have…"
                  rows={1}
                  className="min-h-10 flex-1 resize-none self-center overflow-y-hidden bg-transparent py-2 text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-faint"
                  disabled={isPending}
                />

                <button
                  type="button"
                  onClick={() => sendTurn()}
                  disabled={isPending || (!draft.trim() && pendingFiles.length === 0)}
                  title="Send"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-lg text-paper transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink-faint"
                >
                  <span aria-hidden>{isPending ? "•" : "↑"}</span>
                  <span className="sr-only">Send</span>
                </button>
              </div>

              <p className="mt-2 px-2 text-xs text-ink-faint">
                {isPickingFiles
                  ? "Opening your file picker..."
                  : "PDFs, images, and text files supported. Press Enter to send, Shift+Enter for a new line."}
              </p>
              {error ? <p className="mt-2 px-2 text-sm text-verdict-red">{error}</p> : null}
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <aside
            className={`scroll-thin min-h-0 space-y-4 overflow-y-auto overflow-x-hidden pb-2 transition-all duration-500 lg:pr-1 ${
              hasStarted
                ? "translate-x-0 opacity-100 delay-150"
                : "pointer-events-none translate-x-4 opacity-0"
            }`}
            aria-hidden={!hasStarted}
          >
            <ProgressCard progress={visibleProgress} stageLabel={stageLabel} result={result} />

            {result?.fileRequests.length ? (
              <EvidenceRequestCard requests={result.fileRequests} />
            ) : null}

            {allEvidence.length > 0 ? (
              <div className="rounded-2xl border border-line bg-paper p-5">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
                  Current case file
                </p>
                <div className="mt-4 space-y-2">
                  {allEvidence.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 rounded-xl border border-line-soft bg-canvas px-3 py-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm text-ink">{entry.file.name}</p>
                        <p className="text-xs text-ink-faint">{formatKind(entry.kind)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSessionFile(entry.id)}
                        className="shrink-0 text-xs text-ink-faint transition-colors hover:text-ink"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {result?.reportScaffold ? <ReportHandoffCard result={result} /> : null}
          </aside>
        </div>
      </div>
    </section>
  );
}

function countUserMessages(messages: ChatMessage[]) {
  return messages.filter((message) => message.role === "user").length;
}

function buildPendingStatus({
  force,
  evaluationMode,
  nextUserTurnCount,
  files,
}: {
  force: boolean;
  evaluationMode: IntakeEvaluationMode;
  nextUserTurnCount: number;
  files: SessionFile[];
}) {
  if (files.length === 1) {
    return `Reading and ingesting ${files[0].file.name}...`;
  }

  if (files.length > 1) {
    return `Reading and ingesting ${summarizeFileNames(files)}...`;
  }

  if (force || evaluationMode !== "none") {
    return "Writing your first-pass assessment from what you've shared...";
  }

  if (nextUserTurnCount <= 1) {
    return "Reviewing what happened and deciding the next best question...";
  }

  return "Reviewing your facts and updating the case assessment...";
}

function summarizeFileNames(files: SessionFile[]) {
  if (files.length === 2) {
    return `${files[0].file.name} and ${files[1].file.name}`;
  }

  return `${files[0].file.name}, ${files[1].file.name}, and ${files.length - 2} more files`;
}

function parseJsonResponse(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function BrandMark() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent shadow-[0_6px_16px_-8px_rgba(150,20,20,0.7)]">
      <SteelmanLogo className="h-6 w-6 text-paper" />
    </span>
  );
}

function EmptyState({
  suggestions,
  onPick,
}: {
  suggestions: string[];
  onPick: (text: string) => void;
}) {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col justify-center">
      <div className="flex items-start gap-3">
        <BrandMark />
        <div className="rounded-[1.25rem] rounded-tl-md border border-line bg-paper px-5 py-4 shadow-sm">
          <p className="text-[15px] leading-relaxed text-ink">
            Hi — I&apos;m the Steelman intake assistant. Tell me what happened, who the other
            side is, when it started, what outcome you want, and upload anything important
            like letters, photos, or contracts.
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            I&apos;ll find your strongest position — then show you exactly how the other side will
            argue back, using your own evidence. That&apos;s what actually protects you.
          </p>
        </div>
      </div>

      <div className="mt-6 pl-12">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
          Try one of these
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onPick(suggestion)}
              className="group flex items-center gap-2 rounded-2xl border border-line bg-paper px-4 py-3 text-left text-sm text-ink-soft transition-colors hover:border-accent/30 hover:text-ink"
            >
              <span aria-hidden className="text-ink-faint transition-colors group-hover:text-accent">
                &rarr;
              </span>
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {isUser ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-sm font-medium text-ink-soft">
          You
        </span>
      ) : (
        <BrandMark />
      )}
      <div
        className={`max-w-[85%] px-5 py-4 text-[15px] leading-relaxed shadow-sm ${
          isUser
            ? "rounded-[1.25rem] rounded-tr-md bg-accent text-paper"
            : "rounded-[1.25rem] rounded-tl-md border border-line bg-paper text-ink"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <FormattedMessage content={message.content} highlights={message.highlights ?? []} />
        )}
        {message.attachments.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.attachments.map((attachment) => (
              <span
                key={`${message.id}-${attachment.name}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${
                  isUser
                    ? "bg-paper/20 text-paper"
                    : "border border-line bg-canvas text-ink-soft"
                }`}
              >
                <span aria-hidden>📎</span>
                {attachment.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TypingBubble({ status }: { status: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <BrandMark />
      <div className="flex items-center gap-3 rounded-[1.25rem] rounded-tl-md border border-line bg-paper px-5 py-4 shadow-sm">
        <span aria-hidden className="steelman-spin inline-flex">
          <SteelmanLogo className="h-4 w-4 text-accent" />
        </span>
        <p className="text-sm leading-relaxed text-ink-soft">
          {status ?? "Reviewing your case..."}
        </p>
      </div>
    </div>
  );
}

function ProgressCard({
  progress,
  stageLabel,
  result,
  embedded = false,
}: {
  progress: number;
  stageLabel: string;
  result: IntakeTurnResult | null;
  embedded?: boolean;
}) {
  return (
    <div
      className={embedded ? "rounded-2xl border border-line bg-canvas p-4" : "rounded-2xl border border-line bg-paper p-5"}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
            Progress
          </p>
          <p className="mt-1 text-lg text-ink">{stageLabel}</p>
        </div>
        <span className="font-serif text-2xl text-ink">{progress}%</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-canvas-deep">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        Progress reflects how complete the case record is, not how many chat turns have happened.
      </p>
      {result?.missingFacts.length ? (
        <div className="mt-4 border-t border-line-soft pt-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
            Still missing
          </p>
          <ul className="mt-2 space-y-2 text-sm text-ink-soft">
            {result.missingFacts.slice(0, 4).map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function EvidenceRequestCard({
  requests,
}: {
  requests: IntakeTurnResult["fileRequests"];
}) {
  const done = requests.filter((request) => request.satisfied).length;

  return (
    <div className="rounded-2xl border border-accent/25 bg-accent-tint p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
          Evidence checklist
        </p>
        <span className="rounded-full bg-paper/70 px-2.5 py-0.5 text-xs font-medium text-accent">
          {done}/{requests.length} provided
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {requests.map((request) => (
          <li
            key={request.title}
            className={`flex gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
              request.satisfied
                ? "border-verdict-green/30 bg-verdict-green/5"
                : "border-accent/15 bg-paper"
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                request.satisfied
                  ? "border-verdict-green bg-verdict-green text-paper"
                  : "border-ink-faint/40"
              }`}
            >
              {request.satisfied ? (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : null}
            </span>
            <div className="min-w-0">
              <p
                className={`text-sm font-medium ${
                  request.satisfied ? "text-ink-soft line-through decoration-verdict-green/40" : "text-ink"
                }`}
              >
                {request.title}
              </p>
              {request.satisfied ? (
                <p className="mt-0.5 text-xs font-medium text-verdict-green">Received</p>
              ) : (
                <>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{request.reason}</p>
                  <p className="mt-1 text-xs text-ink-faint">
                    {request.optional
                      ? "Optional, but useful if you have it."
                      : "Recommended for the first full assessment."}
                  </p>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReportHandoffCard({ result }: { result: IntakeTurnResult }) {
  const scaffold = result.reportScaffold;

  if (!scaffold) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-verdict-green/30 bg-paper p-5 shadow-[0_1px_0_rgba(0,0,0,0.02),0_20px_40px_-32px_rgba(48,95,65,0.35)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-verdict-green">
            Final evaluation
          </p>
          <p className="mt-1 text-lg text-ink">Report payload ready</p>
        </div>
        <span className="rounded-full border border-verdict-green/30 bg-verdict-green/10 px-3 py-1 text-xs font-medium text-verdict-green">
          Scaffold only
        </span>
      </div>

      <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-soft">
        <section>
          <p className="font-medium text-ink">Best case</p>
          <p className="mt-1">{scaffold.bestCase}</p>
        </section>
        <section>
          <p className="font-medium text-ink">Counter-argument steelman</p>
          <ul className="mt-1 space-y-1.5">
            {scaffold.counterArgument.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
        <section>
          <p className="font-medium text-ink">Evidence gaps</p>
          <ul className="mt-1 space-y-1.5">
            {scaffold.evidenceGaps.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-4 border-t border-line-soft pt-4 text-sm text-ink-soft">
        <p className="font-medium text-ink">Next handoff</p>
        <p className="mt-1">{scaffold.recommendation}</p>
        <p className="mt-3 text-xs text-ink-faint">
          The report rendering layer is still separate, so this card only exposes the structured handoff.
        </p>
      </div>
    </div>
  );
}

// Lightweight Markdown renderer for assistant messages: paragraphs, bullet and
// numbered lists, and **bold**. Deliberately tiny — no dependency — because the
// model only ever emits these few constructs. Grouping consecutive list lines
// into a single <ul>/<ol> is what turns inline "(1)…(2)…" prose into clean lists.
type MsgHighlight = { text: string; type: "support" | "flag" };

function FormattedMessage({
  content,
  highlights = [],
}: {
  content: string;
  highlights?: MsgHighlight[];
}) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let key = 0;

  const flushList = () => {
    if (!list) return;
    const items = list.items.map((item, i) => (
      <li key={i} className="leading-relaxed">
        {renderInline(item, highlights)}
      </li>
    ));
    blocks.push(
      list.ordered ? (
        <ol key={key++} className="ml-5 list-decimal space-y-1">
          {items}
        </ol>
      ) : (
        <ul key={key++} className="ml-5 list-disc space-y-1">
          {items}
        </ul>
      ),
    );
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }

    const ordered = line.match(/^(?:\d+[.)]|\(\d+\))\s+(.*)$/);
    const bullet = line.match(/^[-*•]\s+(.*)$/);

    if (ordered) {
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(ordered[1]);
    } else if (bullet) {
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(bullet[1]);
    } else {
      flushList();
      blocks.push(
        <p key={key++} className="leading-relaxed">
          {renderInline(line, highlights)}
        </p>,
      );
    }
  }
  flushList();

  return <div className="space-y-2.5">{blocks}</div>;
}

// Same green(support)/red(flag) semantics as the report's HighlightedText.
function markClass(type: "support" | "flag") {
  return type === "support"
    ? "rounded px-0.5 bg-verdict-green/15 text-verdict-green"
    : "rounded px-0.5 bg-verdict-red/15 text-verdict-red";
}

// Render a line with green/red <mark> highlights (verbatim substrings) and
// **bold**. Highlights are applied first; bold is applied to the gaps between.
function renderInline(text: string, highlights: MsgHighlight[] = []): React.ReactNode {
  const ranges = highlights
    .map((h) => ({ ...h, start: text.indexOf(h.text) }))
    .filter((r) => r.start !== -1)
    .sort((a, b) => a.start - b.start)
    .reduce<Array<MsgHighlight & { start: number; end: number }>>((acc, r) => {
      const end = r.start + r.text.length;
      // Skip overlapping matches.
      if (acc.length && r.start < acc[acc.length - 1].end) return acc;
      acc.push({ ...r, end });
      return acc;
    }, []);

  if (ranges.length === 0) return renderBold(text);

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let key = 0;
  for (const r of ranges) {
    if (r.start > cursor) nodes.push(<span key={key++}>{renderBold(text.slice(cursor, r.start))}</span>);
    nodes.push(
      <mark key={key++} className={markClass(r.type)}>
        {r.text}
      </mark>,
    );
    cursor = r.end;
  }
  if (cursor < text.length) nodes.push(<span key={key++}>{renderBold(text.slice(cursor))}</span>);
  return nodes;
}

// Render **bold** spans within a string; everything else is plain text.
function renderBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function dedupeFiles(files: SessionFile[]) {
  return files.filter(
    (file, index, current) => current.findIndex((item) => item.id === file.id) === index,
  );
}

function formatKind(kind: IntakeAttachmentKind) {
  switch (kind) {
    case "pdf-document":
      return "PDF document";
    case "image-evidence":
      return "Image evidence";
    case "text-source":
      return "Text source";
    default:
      return "Needs review";
  }
}

function formatStage(stage: string) {
  return stage
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
