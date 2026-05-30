"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoContext } from "@/lib/demo-context";
import {
  MOCK_FILE_RESULTS,
  MOCK_SUBMISSION_PREVIEW,
} from "@/lib/demo-data";

const TABS = ["Overview", "Documents", "References"] as const;
type Tab = (typeof TABS)[number];

function HighlightedText({
  text,
  highlights,
}: {
  text: string;
  highlights: { text: string; type: "support" | "flag" }[];
}) {
  if (!highlights.length) return <>{text}</>;
  let result: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  const sorted = [...highlights].sort(
    (a, b) => text.indexOf(a.text) - text.indexOf(b.text),
  );
  for (const h of sorted) {
    const idx = remaining.indexOf(h.text);
    if (idx === -1) continue;
    if (idx > 0) result.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
    result.push(
      <mark
        key={key++}
        className={`rounded px-0.5 ${
          h.type === "support"
            ? "bg-verdict-green/15 text-verdict-green"
            : "bg-verdict-red/15 text-verdict-red"
        }`}
      >
        {h.text}
      </mark>,
    );
    remaining = remaining.slice(idx + h.text.length);
  }
  if (remaining) result.push(<span key={key++}>{remaining}</span>);
  return <>{result}</>;
}

const RELEVANCE_STYLE = {
  high: "border-verdict-green/40 bg-verdict-green/10 text-verdict-green",
  moderate: "border-verdict-amber/40 bg-verdict-amber/10 text-verdict-amber",
  low: "border-line bg-canvas-deep text-ink-faint",
} as const;

export default function ReportPage() {
  const router = useRouter();
  const {
    reportData,
    analysisData,
    researchItems,
    toggleResearch,
    uploadedFiles,
    addFile,
  } = useDemoContext();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [decision, setDecision] = useState<"submit" | "escalate" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("for");
  const [fileResults, setFileResults] = useState(
    MOCK_FILE_RESULTS.map((f) => ({ ...f })),
  );

  const toggle = (s: string) => setOpenSection((prev) => (prev === s ? null : s));
  const toggleFileResult = (id: string) =>
    setFileResults((prev) =>
      prev.map((f) => (f.id === id ? { ...f, selected: !f.selected } : f)),
    );
  const handleUpload = () => {
    if (uploadedFiles.length > 0) return;
    addFile({ name: "tenancy-agreement.pdf", size: "240 KB" });
    addFile({ name: "landlord-emails.pdf", size: "128 KB" });
    addFile({ name: "mould-photos.zip", size: "3.2 MB" });
  };

  if (submitted) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-verdict-green/15">
            <svg className="h-8 w-8 text-verdict-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-5 text-3xl text-ink">
            {decision === "escalate" ? "Escalated to Lawhive" : "Submitted successfully"}
          </h2>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft">
            {decision === "escalate"
              ? "Your case file has been sent to a Lawhive solicitor for review. They'll be in touch within 2 working days."
              : "Your pre-action letter has been prepared and is ready to send."}
          </p>
          <button
            onClick={() => router.push("/demo")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent-deep"
          >
            Back to dashboard
            <span aria-hidden>&rarr;</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
            <span className="h-1 w-1 rounded-full bg-accent" />
            Case assessment report
          </span>
          <h1 className="mt-3 text-3xl leading-snug text-ink sm:text-4xl">
            {reportData.title}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">{reportData.subtitle}</p>
        </div>
        <button
          className="rounded-lg border border-line p-2 text-ink-faint transition-colors hover:bg-canvas-deep hover:text-ink"
          title="Download report"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-line">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-ink"
                : "text-ink-faint hover:text-ink-soft"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === "Overview" && (
          <div className="space-y-8">
            {/* Report body */}
            <div className="rounded-2xl border border-line bg-paper p-7 sm:p-9">
              <div className="space-y-5 font-serif text-[15px] leading-relaxed text-ink">
                {reportData.paragraphs.map((para, i) => (
                  <p key={i}>
                    <HighlightedText text={para.text} highlights={para.highlights} />
                  </p>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-4 border-t border-line-soft pt-5 text-xs text-ink-faint">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded bg-verdict-green/25" />
                  Supporting evidence
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded bg-verdict-red/25" />
                  Flag / risk
                </span>
              </div>
            </div>

            {/* Arguments for / counter / summary + decision */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.85fr]">
              <div className="space-y-3">
                {/* Arguments for */}
                <div className="rounded-xl border border-line bg-paper">
                  <button onClick={() => toggle("for")} className="flex w-full items-center justify-between px-5 py-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-verdict-green/15">
                        <svg className="h-4 w-4 text-verdict-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium text-ink">Arguments for</span>
                    </div>
                    <svg className={`h-5 w-5 text-ink-faint transition-transform ${openSection === "for" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {openSection === "for" && (
                    <div className="border-t border-line-soft px-5 py-4">
                      <ul className="space-y-2.5">
                        {analysisData.forPoints.map((point, i) => (
                          <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink">
                            <span className="mt-0.5 text-verdict-green">+</span>{point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Counterarguments */}
                <div className="rounded-xl border border-line bg-paper">
                  <button onClick={() => toggle("counter")} className="flex w-full items-center justify-between px-5 py-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-verdict-red/15">
                        <svg className="h-4 w-4 text-verdict-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium text-ink">Counterarguments</span>
                    </div>
                    <svg className={`h-5 w-5 text-ink-faint transition-transform ${openSection === "counter" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {openSection === "counter" && (
                    <div className="border-t border-line-soft px-5 py-4">
                      <ul className="space-y-2.5">
                        {analysisData.counterPoints.map((point, i) => (
                          <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink">
                            <span className="mt-0.5 text-verdict-red">&minus;</span>{point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="rounded-xl border border-line bg-paper">
                  <button onClick={() => toggle("summary")} className="flex w-full items-center justify-between px-5 py-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-tint">
                        <span className="h-2 w-2 rounded-full bg-accent" />
                      </span>
                      <span className="text-sm font-medium text-ink">Report summary</span>
                    </div>
                    <svg className={`h-5 w-5 text-ink-faint transition-transform ${openSection === "summary" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {openSection === "summary" && (
                    <div className="border-t border-line-soft px-5 py-4">
                      <p className="text-sm leading-relaxed text-ink-soft">{analysisData.summary}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Decision + preview */}
              <div className="space-y-4">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
                  Recommended action
                </span>
                <button
                  onClick={() => setDecision("submit")}
                  className={`flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-colors ${decision === "submit" ? "border-verdict-green/40 bg-verdict-green/5" : "border-line bg-paper hover:bg-canvas-deep"}`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${decision === "submit" ? "bg-verdict-green/20" : "bg-canvas-deep"}`}>
                    <svg className={`h-5 w-5 ${decision === "submit" ? "text-verdict-green" : "text-ink-faint"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">Send pre-action letter</p>
                    <p className="mt-0.5 text-xs text-ink-soft">Proceed with a formal letter before action</p>
                  </div>
                </button>

                <button
                  onClick={() => setDecision("escalate")}
                  className={`flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-colors ${decision === "escalate" ? "border-accent/40 bg-accent-tint" : "border-line bg-paper hover:bg-canvas-deep"}`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${decision === "escalate" ? "bg-accent/15" : "bg-canvas-deep"}`}>
                    <svg className={`h-5 w-5 ${decision === "escalate" ? "text-accent" : "text-ink-faint"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">Escalate to Lawhive</p>
                    <p className="mt-0.5 text-xs text-ink-soft">Refer to a solicitor with the prepared case file</p>
                  </div>
                </button>

                {decision && (
                  <>
                    <div className="rounded-xl border border-line bg-paper">
                      <div className="border-b border-line-soft px-5 py-3">
                        <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
                          {decision === "escalate" ? "Case file preview" : "Letter preview"}
                        </span>
                      </div>
                      <div className="px-5 py-4">
                        <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-ink-soft">{MOCK_SUBMISSION_PREVIEW}</pre>
                      </div>
                    </div>
                    <button
                      onClick={() => setSubmitted(true)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent-deep"
                    >
                      {decision === "escalate" ? "Escalate to Lawhive" : "Submit letter"}
                      <span aria-hidden>&rarr;</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Documents" && (
          <div className="space-y-6">
            <button
              onClick={handleUpload}
              className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-line bg-paper py-10 transition-colors hover:border-accent/40 hover:bg-accent-tint"
            >
              <svg className="h-10 w-10 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-sm font-medium text-ink-soft">Click to upload files</span>
              <span className="text-xs text-ink-faint">PDF, images, or text files</span>
            </button>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">Uploaded files</span>
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3">
                    <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span className="flex-1 text-sm text-ink">{f.name}</span>
                    <span className="text-xs text-ink-faint">{f.size}</span>
                  </div>
                ))}
              </div>
            )}

            {uploadedFiles.length > 0 && (
              <div>
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">Extracted evidence</span>
                <div className="mt-3 space-y-2">
                  {fileResults.map((fr) => (
                    <button
                      key={fr.id}
                      onClick={() => toggleFileResult(fr.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${fr.selected ? "border-accent/40 bg-accent-tint" : "border-line bg-paper hover:bg-canvas-deep"}`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${fr.selected ? "border-accent bg-accent" : "border-ink-faint/40"}`}>
                        {fr.selected && (
                          <svg className="h-3 w-3 text-paper" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className="text-sm text-ink">{fr.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "References" && (
          <div className="space-y-3">
            {researchItems.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleResearch(item.id)}
                className={`group flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${item.selected ? "border-accent/40 bg-accent-tint" : "border-line bg-paper hover:border-line-soft hover:bg-canvas-deep"}`}
              >
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${item.selected ? "border-accent bg-accent" : "border-ink-faint/40"}`}>
                  {item.selected && (
                    <svg className="h-3 w-3 text-paper" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-ink">{item.snippet}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${RELEVANCE_STYLE[item.relevance]}`}>
                      {item.relevance}
                    </span>
                    <span className="text-xs text-ink-faint">{item.source}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
