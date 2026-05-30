"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoContext } from "@/lib/demo-context";
import { MOCK_SUBMISSION_PREVIEW } from "@/lib/demo-data";

export default function AnalysisPage() {
  const router = useRouter();
  const { analysisData } = useDemoContext();
  const [decision, setDecision] = useState<"submit" | "escalate" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("for");

  const toggle = (section: string) =>
    setOpenSection((prev) => (prev === section ? null : section));

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
            onClick={() => router.push("/")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent-deep"
          >
            Back to home
            <span aria-hidden>&rarr;</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
        <span className="h-1 w-1 rounded-full bg-accent" />
        Final analysis
      </span>
      <h2 className="mt-4 text-3xl leading-snug text-ink">
        Case assessment
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.85fr]">
        {/* Left — accordion sections */}
        <div className="space-y-3">
          {/* Arguments for */}
          <div className="rounded-xl border border-line bg-paper">
            <button
              onClick={() => toggle("for")}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-verdict-green/15">
                  <svg className="h-4 w-4 text-verdict-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-ink">Arguments for</span>
              </div>
              <svg
                className={`h-5 w-5 text-ink-faint transition-transform ${openSection === "for" ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {openSection === "for" && (
              <div className="border-t border-line-soft px-5 py-4">
                <ul className="space-y-2.5">
                  {analysisData.forPoints.map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink">
                      <span className="mt-0.5 text-verdict-green">+</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Counterarguments */}
          <div className="rounded-xl border border-line bg-paper">
            <button
              onClick={() => toggle("counter")}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-verdict-red/15">
                  <svg className="h-4 w-4 text-verdict-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-ink">Counterarguments</span>
              </div>
              <svg
                className={`h-5 w-5 text-ink-faint transition-transform ${openSection === "counter" ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {openSection === "counter" && (
              <div className="border-t border-line-soft px-5 py-4">
                <ul className="space-y-2.5">
                  {analysisData.counterPoints.map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink">
                      <span className="mt-0.5 text-verdict-red">&minus;</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-line bg-paper">
            <button
              onClick={() => toggle("summary")}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-tint">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </span>
                <span className="text-sm font-medium text-ink">Report summary</span>
              </div>
              <svg
                className={`h-5 w-5 text-ink-faint transition-transform ${openSection === "summary" ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {openSection === "summary" && (
              <div className="border-t border-line-soft px-5 py-4">
                <p className="text-sm leading-relaxed text-ink-soft">
                  {analysisData.summary}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right — decision branch + preview */}
        <div className="space-y-6">
          {/* Decision cards */}
          <div className="space-y-3">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
              Recommended action
            </span>
            <button
              onClick={() => setDecision("submit")}
              className={`flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-colors ${
                decision === "submit"
                  ? "border-verdict-green/40 bg-verdict-green/5"
                  : "border-line bg-paper hover:bg-canvas-deep"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  decision === "submit" ? "bg-verdict-green/20" : "bg-canvas-deep"
                }`}
              >
                <svg className={`h-5 w-5 ${decision === "submit" ? "text-verdict-green" : "text-ink-faint"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-ink">Send pre-action letter</p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  Case has sufficient evidence to proceed with a formal letter before action
                </p>
              </div>
            </button>

            <button
              onClick={() => setDecision("escalate")}
              className={`flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-colors ${
                decision === "escalate"
                  ? "border-accent/40 bg-accent-tint"
                  : "border-line bg-paper hover:bg-canvas-deep"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  decision === "escalate" ? "bg-accent/15" : "bg-canvas-deep"
                }`}
              >
                <svg className={`h-5 w-5 ${decision === "escalate" ? "text-accent" : "text-ink-faint"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium text-ink">Escalate to Lawhive</p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  Refer to a solicitor with the prepared case file and evidence
                </p>
              </div>
            </button>
          </div>

          {/* Submission preview */}
          {decision && (
            <div className="rounded-xl border border-line bg-paper">
              <div className="border-b border-line-soft px-5 py-3">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
                  {decision === "escalate" ? "Case file preview" : "Letter preview"}
                </span>
              </div>
              <div className="px-5 py-4">
                <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-ink-soft">
                  {MOCK_SUBMISSION_PREVIEW}
                </pre>
              </div>
            </div>
          )}

          {decision && (
            <button
              onClick={() => setSubmitted(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent-deep"
            >
              {decision === "escalate" ? "Escalate to Lawhive" : "Submit letter"}
              <span aria-hidden>&rarr;</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
