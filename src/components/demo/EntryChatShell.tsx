"use client";

import { useMemo, useRef, useState, useTransition } from "react";

import { classifyAttachment } from "@/lib/intake/files";
import type {
  IntakeAttachmentKind,
  IntakeTurnResult,
} from "@/lib/intake/types";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments: Array<{ name: string; kind: IntakeAttachmentKind }>;
};

type SessionFile = {
  id: string;
  file: File;
  kind: IntakeAttachmentKind;
};

export default function EntryChatShell() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pendingFiles, setPendingFiles] = useState<SessionFile[]>([]);
  const [sessionFiles, setSessionFiles] = useState<SessionFile[]>([]);
  const [result, setResult] = useState<IntakeTurnResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const visibleProgress = result?.readinessScore ?? 5;
  const stageLabel = formatStage(result?.currentStage ?? "understanding-problem");
  const allEvidence = useMemo(() => sessionFiles, [sessionFiles]);

  const suggestions = [
    "My landlord won't fix the damp and mould in my flat.",
    "I paid a deposit and never got the protection details.",
    "A builder did poor work and won't refund me.",
  ];

  function queueFiles(fileList: FileList | null) {
    if (!fileList) return;

    const nextFiles = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file,
      kind: classifyAttachment(file.name, file.type || "application/octet-stream"),
    }));

    setPendingFiles((current) => dedupeFiles([...current, ...nextFiles]));
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

    setMessages(nextMessages);
    setSessionFiles(nextSessionFiles);
    setDraft("");
    setPendingFiles([]);
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

        if (force) {
          formData.append("forceEvaluate", "true");
        }

        const response = await fetch("/api/intake", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error ?? "The intake request failed.");
        }

        const intakeResult = (await response.json()) as IntakeTurnResult;
        setResult(intakeResult);
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: intakeResult.assistantMessage,
            attachments: [],
          },
        ]);
      } catch (submissionError) {
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
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-6">
          {/* ── Chat column ───────────────────────────────────────────── */}
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.5rem] border border-line bg-paper shadow-[0_1px_0_rgba(0,0,0,0.02),0_24px_48px_-32px_rgba(40,20,20,0.38)]">
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <BrandMark />
              <div>
                <p className="text-sm font-semibold text-ink">Steelman intake</p>
                <p className="text-xs text-ink-faint">Honest case assessment — not legal advice</p>
              </div>
            </div>

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
                  {isPending ? <TypingBubble /> : null}
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-line bg-paper px-4 py-4 sm:px-6">
              {messages.length >= 3 && !result?.reportScaffold ? (
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
                  onChange={(event) => queueFiles(event.target.files)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach files (PDF, image, text)"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-lg text-ink-soft transition-colors hover:bg-canvas-deep hover:text-ink"
                >
                  <span aria-hidden>+</span>
                  <span className="sr-only">Attach files</span>
                </button>

                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendTurn();
                    }
                  }}
                  placeholder="Tell us what happened, and what outcome you want…"
                  rows={1}
                  className="max-h-40 min-h-10 flex-1 resize-none self-center bg-transparent py-2 text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-faint"
                  disabled={isPending}
                />

                <button
                  type="button"
                  onClick={() => sendTurn()}
                  disabled={isPending || (!draft.trim() && pendingFiles.length === 0)}
                  title="Send"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-lg text-paper transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink-faint"
                >
                  <span aria-hidden>{isPending ? "…" : "↑"}</span>
                  <span className="sr-only">Send</span>
                </button>
              </div>

              <p className="mt-2 px-2 text-xs text-ink-faint">
                PDFs, images, and text files supported. Press Enter to send, Shift+Enter for a new line.
              </p>
              {error ? <p className="mt-2 px-2 text-sm text-verdict-red">{error}</p> : null}
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <aside className="scroll-thin min-h-0 space-y-4 overflow-y-auto pb-2 lg:pr-1">
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

function BrandMark() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent shadow-[0_6px_16px_-8px_rgba(150,20,20,0.7)]">
      <span className="block h-3 w-3 rotate-45 rounded-[2px] bg-paper" />
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
            Hi — I&apos;m the Steelman intake assistant. Tell me what happened in your own words,
            and upload anything important (letters, photos, contracts).
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
        <p className="whitespace-pre-wrap">{message.content}</p>
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

function TypingBubble() {
  return (
    <div className="flex items-start gap-3">
      <BrandMark />
      <div className="flex items-center gap-1.5 rounded-[1.25rem] rounded-tl-md border border-line bg-paper px-5 py-4 shadow-sm">
        <span className="h-2 w-2 animate-bounce rounded-full bg-ink-faint [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-ink-faint [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-ink-faint" />
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
  return (
    <div className="rounded-2xl border border-accent/25 bg-accent-tint p-5">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Evidence request
      </p>
      <div className="mt-3 space-y-3">
        {requests.map((request) => (
          <div key={request.title} className="rounded-xl border border-accent/15 bg-paper px-4 py-3">
            <p className="text-sm font-medium text-ink">{request.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{request.reason}</p>
            <p className="mt-2 text-xs text-ink-faint">
              {request.optional ? "Optional, but useful if you have it." : "Recommended for the first full assessment."}
            </p>
          </div>
        ))}
      </div>
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
