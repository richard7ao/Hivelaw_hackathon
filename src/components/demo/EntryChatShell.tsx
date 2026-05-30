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

  function sendTurn() {
    if ((!draft.trim() && pendingFiles.length === 0) || isPending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: draft.trim() || "Uploaded supporting evidence.",
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
    <section className="dot-grid h-full overflow-hidden bg-canvas">
      <div className="mx-auto flex h-full max-w-[88rem] flex-col overflow-hidden px-6 py-6 sm:py-8">
        <div className="border-b border-line pb-6">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Live intake
          </span>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="flex h-full min-h-0 flex-col rounded-[1.75rem] border border-line bg-paper shadow-[0_1px_0_rgba(0,0,0,0.02),0_24px_48px_-32px_rgba(40,20,20,0.38)]">
            <div className="border-b border-line px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
                    Entry chat
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    Upload is always available. The larger evidence prompt only appears when the
                    intake can explain why a document would materially help.
                  </p>
                </div>
                <EngineBadge engine={result?.engine ?? "local-demo"} />
              </div>
              <div className="mt-4">
                <ProgressCard
                  progress={visibleProgress}
                  stageLabel={stageLabel}
                  result={result}
                  embedded
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
              {messages.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </div>
              )}
            </div>

            {result?.fileRequests.length ? (
              <div className="border-t border-line px-6 py-4 lg:hidden">
                <EvidenceRequestCard requests={result.fileRequests} />
              </div>
            ) : null}

            <div className="border-t border-line px-6 py-5">
              {pendingFiles.length > 0 ? (
                <div className="mb-4 flex flex-wrap gap-2">
                  {pendingFiles.map((pendingFile) => (
                    <button
                      key={pendingFile.id}
                      type="button"
                      onClick={() => removePendingFile(pendingFile.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-accent/30 hover:text-ink"
                    >
                      <span>{pendingFile.file.name}</span>
                      <span aria-hidden>&times;</span>
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="rounded-3xl border border-line bg-canvas px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Tell us what happened, what outcome you want, and upload anything important."
                  rows={4}
                  className="min-h-28 w-full resize-none bg-transparent text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-faint"
                  disabled={isPending}
                />

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
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
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-paper px-4 text-sm font-medium text-ink transition-colors hover:bg-canvas-deep"
                    >
                      <span aria-hidden>+</span>
                      Attach files
                    </button>
                    <span className="text-xs text-ink-faint">
                      PDFs, images, and text files supported.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={sendTurn}
                    disabled={isPending || (!draft.trim() && pendingFiles.length === 0)}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-paper transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink-faint"
                  >
                    {isPending ? "Thinking..." : "Send"}
                    <span aria-hidden>&rarr;</span>
                  </button>
                </div>
              </div>

              {error ? <p className="mt-3 text-sm text-verdict-red">{error}</p> : null}
            </div>
          </div>

          <aside className="min-h-0 space-y-4 overflow-y-auto pr-1">
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
                      <div className="flex-1">
                        <p className="text-sm text-ink">{entry.file.name}</p>
                        <p className="text-xs text-ink-faint">{formatKind(entry.kind)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSessionFile(entry.id)}
                        className="text-xs text-ink-faint transition-colors hover:text-ink"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {result?.fileRequests.length ? (
              <div className="hidden lg:block">
                <EvidenceRequestCard requests={result.fileRequests} />
              </div>
            ) : null}

            {result?.reportScaffold ? <ReportHandoffCard result={result} /> : null}
          </aside>
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return <div className="h-full min-h-[24rem]" />;
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-[1.5rem] px-5 py-4 text-[15px] leading-relaxed ${
          isUser ? "bg-accent text-paper" : "border border-line bg-canvas text-ink"
        }`}
      >
        <p>{message.content}</p>
        {message.attachments.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.attachments.map((attachment) => (
              <span
                key={`${message.id}-${attachment.name}`}
                className={`rounded-full px-3 py-1 text-xs ${
                  isUser
                    ? "bg-paper/15 text-paper"
                    : "border border-line bg-paper text-ink-soft"
                }`}
              >
                {attachment.name}
              </span>
            ))}
          </div>
        ) : null}
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

function EngineBadge({ engine }: { engine: IntakeTurnResult["engine"] }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        engine === "anthropic"
          ? "border border-verdict-green/30 bg-verdict-green/10 text-verdict-green"
          : "border border-line bg-canvas text-ink-faint"
      }`}
    >
      {engine === "anthropic" ? "Anthropic live" : "Local demo reasoning"}
    </span>
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
