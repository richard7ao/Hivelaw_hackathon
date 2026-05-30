"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoContext } from "@/lib/demo-context";
import { MOCK_FILE_RESULTS } from "@/lib/demo-data";

function HighlightedText({ text, highlights }: { text: string; highlights: { text: string; type: "support" | "flag" }[] }) {
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

    if (idx > 0) {
      result.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
    }
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

  if (remaining) {
    result.push(<span key={key++}>{remaining}</span>);
  }

  return <>{result}</>;
}

export default function ReportPage() {
  const router = useRouter();
  const { uploadedFiles, addFile, reportData } = useDemoContext();
  const [showReport, setShowReport] = useState(false);
  const [fileResults, setFileResults] = useState(
    MOCK_FILE_RESULTS.map((f) => ({ ...f })),
  );

  const handleUpload = () => {
    addFile({ name: "tenancy-agreement.pdf", size: "240 KB" });
    addFile({ name: "landlord-emails.pdf", size: "128 KB" });
    addFile({ name: "mould-photos.zip", size: "3.2 MB" });
  };

  const toggleFileResult = (id: string) =>
    setFileResults((prev) =>
      prev.map((f) => (f.id === id ? { ...f, selected: !f.selected } : f)),
    );

  if (showReport) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-2xl border border-line bg-paper p-7 shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_60px_-44px_rgba(40,20,20,0.4)] sm:p-9">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-line-soft pb-5">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
                Case assessment report
              </span>
              <h2 className="mt-2 text-2xl leading-snug text-ink">
                {reportData.title}
              </h2>
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

          {/* Body */}
          <div className="mt-6 space-y-5 font-serif text-[15px] leading-relaxed text-ink">
            {reportData.paragraphs.map((para, i) => (
              <p key={i}>
                <HighlightedText text={para.text} highlights={para.highlights} />
              </p>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 flex items-center gap-4 border-t border-line-soft pt-5 text-xs text-ink-faint">
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

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push("/demo/analysis")}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent-deep"
          >
            Continue to analysis
            <span aria-hidden>&rarr;</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
        <span className="h-1 w-1 rounded-full bg-accent" />
        Upload evidence
      </span>
      <h2 className="mt-4 text-3xl leading-snug text-ink">
        Add your documents
      </h2>
      <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-ink-soft">
        Upload your tenancy agreement, correspondence with the landlord, and any photographs of the disrepair.
      </p>

      {/* Upload zone */}
      <button
        onClick={handleUpload}
        className="mt-6 flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-line bg-paper py-10 transition-colors hover:border-accent/40 hover:bg-accent-tint"
      >
        <svg className="h-10 w-10 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <span className="text-sm font-medium text-ink-soft">
          Click to upload files
        </span>
        <span className="text-xs text-ink-faint">
          PDF, images, or text files
        </span>
      </button>

      {/* Uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3"
            >
              <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="flex-1 text-sm text-ink">{f.name}</span>
              <span className="text-xs text-ink-faint">{f.size}</span>
            </div>
          ))}
        </div>
      )}

      {/* File-linked results */}
      {uploadedFiles.length > 0 && (
        <>
          <div className="mt-8">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
              Extracted evidence
            </span>
            <div className="mt-3 space-y-2">
              {fileResults.map((fr) => (
                <button
                  key={fr.id}
                  onClick={() => toggleFileResult(fr.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                    fr.selected
                      ? "border-accent/40 bg-accent-tint"
                      : "border-line bg-paper hover:bg-canvas-deep"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      fr.selected
                        ? "border-accent bg-accent"
                        : "border-ink-faint/40"
                    }`}
                  >
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

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowReport(true)}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent-deep"
            >
              Generate report
              <span aria-hidden>&rarr;</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
