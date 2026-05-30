"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDemoContext } from "@/lib/demo-context";
import Spinner from "@/components/Spinner";
import SteelmanLogo from "@/components/SteelmanLogo";
import {
  MOCK_FILE_RESULTS,
  MOCK_SUBMISSION_PREVIEW,
  MOCK_EXTENDED_REFERENCES,
  MOCK_COUNTER_REFERENCES,
  MOCK_LAWYERS,
  CASE_07_FILES,
} from "@/lib/demo-data";

const PAGE_TABS = ["Overview", "Documents", "References"] as const;
type PageTab = (typeof PAGE_TABS)[number];
const ANALYSIS_TABS = ["Arguments for", "Counterarguments", "Summary"] as const;
type AnalysisTab = (typeof ANALYSIS_TABS)[number];

const RECOMMENDATION_STYLE = {
  "escalate-to-solicitor": { label: "Escalate to solicitor", bg: "bg-verdict-amber/10", border: "border-verdict-amber/40", text: "text-verdict-amber" },
  "self-serve": { label: "Self-serve", bg: "bg-verdict-green/10", border: "border-verdict-green/40", text: "text-verdict-green" },
  "do-not-pursue": { label: "Do not pursue", bg: "bg-verdict-red/10", border: "border-verdict-red/40", text: "text-verdict-red" },
  recommended: { label: "Recommended", bg: "bg-accent-tint", border: "border-accent/40", text: "text-accent" },
} as const;

function HighlightedText({ text, highlights, activeHighlights }: { text: string; highlights: { text: string; type: "support" | "flag" }[]; activeHighlights?: string[] }) {
  if (!highlights.length) return <>{text}</>;
  let result: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  const sorted = [...highlights].sort((a, b) => text.indexOf(a.text) - text.indexOf(b.text));
  for (const h of sorted) {
    const idx = remaining.indexOf(h.text);
    if (idx === -1) continue;
    if (idx > 0) result.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
    const isActive = activeHighlights?.includes(h.text);
    result.push(
      <mark key={key++} className={`rounded px-0.5 transition-all duration-300 ${isActive ? "ring-2 ring-accent ring-offset-1 font-semibold" : ""} ${h.type === "support" ? "bg-verdict-green/15 text-verdict-green" : "bg-verdict-red/15 text-verdict-red"}`}>
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

function FloatingChat({ messages, addMessage, onExpand }: { messages: { role: string; content: string }[]; addMessage: (msg: { role: "user" | "assistant"; content: string }) => void; onExpand: () => void }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    addMessage({ role: "user", content: text });
    setInput("");
    setTimeout(() => {
      addMessage({ role: "assistant", content: "I've noted that additional detail. Let me update the case assessment to reflect this new information." });
    }, 800);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent shadow-lg transition-transform hover:scale-105 hover:bg-accent-deep">
        <SteelmanLogo className="h-7 w-7 text-paper" />
      </button>
    );
  }

  return (
    <div className="fixed right-6 bottom-6 z-50 flex w-96 flex-col rounded-2xl border border-line bg-paper shadow-[0_8px_30px_-8px_rgba(40,20,20,0.4)]">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="text-sm font-medium text-ink">Case chat</span>
        <div className="flex items-center gap-1">
          <button onClick={onExpand} className="rounded-lg p-1.5 text-ink-faint hover:bg-canvas-deep hover:text-ink" title="Full chat">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
          </button>
          <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-ink-faint hover:bg-canvas-deep hover:text-ink">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto px-4 py-3">
        {messages.length === 0 ? (
          <p className="text-center text-xs text-ink-faint py-4">Start a conversation about your case</p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${msg.role === "user" ? "bg-accent text-paper" : "border border-line bg-canvas-deep text-ink"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="border-t border-line px-3 py-2">
        <div className="flex items-center gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Add details or evidence..." className="flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-ink-faint" />
          <button onClick={handleSend} disabled={!input.trim()} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-paper disabled:bg-ink/15 disabled:text-ink-faint">Send</button>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  const router = useRouter();
  const { messages, addMessage, reportData, analysisData, researchItems, toggleResearch, uploadedFiles, addFile, activeCase } = useDemoContext();
  const [activeTab, setActiveTab] = useState<PageTab>("Overview");
  const [analysisTab, setAnalysisTab] = useState<AnalysisTab>("Arguments for");
  const [decision, setDecision] = useState<"submit" | "escalate" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileResults, setFileResults] = useState(MOCK_FILE_RESULTS.map((f) => ({ ...f })));
  const [expandedRef, setExpandedRef] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [filesLoaded, setFilesLoaded] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [userFiles, setUserFiles] = useState<{ name: string; url: string }[]>([]);
  const [contactedLawyers, setContactedLawyers] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const caseRefs = activeCase?.references ?? MOCK_EXTENDED_REFERENCES;
  const caseCounterRefs = activeCase?.counterReferences ?? MOCK_COUNTER_REFERENCES;
  const caseProspects = activeCase?.prospects ?? "arguable";
  const caseRecommendation = activeCase?.recommendation ?? "escalate-to-solicitor";

  const activeHighlights = expandedRef
    ? (caseRefs.find((r) => r.id === expandedRef)?.highlightLinks ??
       caseCounterRefs.find((r) => r.id === expandedRef)?.highlightLinks ?? [])
    : [];

  const toggleFileResult = (id: string) => setFileResults((prev) => prev.map((f) => (f.id === id ? { ...f, selected: !f.selected } : f)));

  const handleUpload = () => {
    if (!filesLoaded) {
      setFilesLoaded(true);
      CASE_07_FILES.forEach((f) => addFile({ name: f.name, size: f.size }));
    }
  };

  const handleRealUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((f) => {
      addFile({ name: f.name, size: `${(f.size / 1024).toFixed(0)} KB` });
      const url = URL.createObjectURL(f);
      setUserFiles((prev) => [...prev, { name: f.name, url }]);
    });
  };

  const handleDownloadPdf = async () => {
    setPdfGenerating(true);
    const html = `
      <h1>Case Assessment Report — Steelman</h1>
      <h2>${reportData.title}</h2>
      <p><em>${reportData.subtitle}</em></p>
      ${reportData.paragraphs.map((p) => {
        let text = p.text;
        p.highlights.forEach((h) => {
          text = text.replace(h.text, `<span class="${h.type === "support" ? "support" : "flag"}">${h.text}</span>`);
        });
        return `<p>${text}</p>`;
      }).join("")}
      <h2>Arguments For</h2>
      <ul>${analysisData.forPoints.map((p) => `<li>${p}</li>`).join("")}</ul>
      <h2>Counterarguments</h2>
      <ul>${analysisData.counterPoints.map((p) => `<li>${p}</li>`).join("")}</ul>
      <h2>Assessment Summary</h2>
      <p>${analysisData.summary}</p>
      <h2>Pre-Action Letter</h2>
      <pre style="white-space:pre-wrap;font-family:Georgia,serif;font-size:14px;">${MOCK_SUBMISSION_PREVIEW}</pre>
      <h2>Statutory Basis</h2>
      ${caseRefs.filter((r) => r.relevance === "high").map((r) => `<div class="citation"><strong>${r.citation}</strong><br/>${r.summary}</div>`).join("")}
      <div class="footer">Generated by Steelman — Case Assessment AI. ${new Date().toLocaleDateString("en-GB")}. This is not legal advice.</div>
    `;
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, title: "steelman-case-report" }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "steelman-case-report.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.print();
    }
    setPdfGenerating(false);
  };

  if (loading) return <Spinner message="Regenerating case assessment..." />;

  if (submitted && decision === "escalate") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-tint">
            <SteelmanLogo className="h-7 w-7 text-accent" />
          </div>
          <h2 className="mt-4 text-3xl text-ink">Escalated to Lawhive</h2>
          <p className="mt-2 text-[15px] text-ink-soft">Your case file has been sent. Here are solicitors who specialise in housing disrepair.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Left — case summary */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-paper p-6">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">Case file summary</span>
              <h3 className="mt-3 text-lg font-medium text-ink">{reportData.title}</h3>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-md border border-verdict-amber/40 bg-verdict-amber/10 px-2 py-0.5 text-xs font-semibold text-verdict-amber">ARGUABLE</span>
                <span className="text-xs text-ink-faint">Escalate to solicitor</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{analysisData.summary}</p>
              <div className="mt-4 border-t border-line-soft pt-4">
                <span className="text-xs font-medium text-ink-faint">Key statutes cited</span>
                <ul className="mt-2 space-y-1 text-xs text-ink-soft">
                  {caseRefs.filter((r) => r.relevance === "high").map((r) => (
                    <li key={r.id} className="flex items-start gap-2"><span className="text-accent">&#167;</span>{r.shortLabel}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleDownloadPdf} disabled={pdfGenerating} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-xs font-medium text-paper transition-colors hover:bg-accent-deep disabled:opacity-50">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                {pdfGenerating ? "Generating..." : "Download PDF"}
              </button>
              <button onClick={() => router.push("/demo")} className="inline-flex flex-1 items-center justify-center rounded-full border border-line px-4 py-2.5 text-xs font-medium text-ink transition-colors hover:bg-canvas-deep">Dashboard</button>
            </div>
          </div>

          {/* Right — recommended lawyers */}
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">Recommended solicitors — housing disrepair</span>
            <div className="mt-4 space-y-4">
              {MOCK_LAWYERS.map((lawyer) => {
                const contacted = contactedLawyers.has(lawyer.id);
                return (
                <div key={lawyer.id} className={`rounded-2xl border bg-paper p-5 transition-colors ${contacted ? "border-verdict-green/30" : "border-line hover:border-accent/30"}`}>
                  <div className="flex gap-4">
                    <img src={lawyer.imageUrl} alt={lawyer.name} className="h-16 w-16 rounded-full border border-line bg-canvas-deep" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <a href={lawyer.profileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-ink hover:text-accent">{lawyer.name}</a>
                          <p className="text-xs text-ink-soft">{lawyer.firm}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <svg className="h-3.5 w-3.5 text-verdict-amber" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          <span className="font-medium text-ink">{lawyer.rating}</span>
                        </div>
                      </div>
                      <p className="mt-1 text-xs font-medium text-accent">{lawyer.specialisation}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-soft">{lawyer.experience}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {lawyer.qualifications.map((q) => (
                          <span key={q} className="rounded border border-line bg-canvas-deep px-2 py-0.5 text-[10px] text-ink-faint">{q}</span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-ink-faint">{lawyer.casesWon} cases won</span>
                        {contacted ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-verdict-green/40 bg-verdict-green/10 px-3 py-1.5 text-xs font-medium text-verdict-green">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            Consultation requested
                          </span>
                        ) : (
                          <button
                            onClick={() => setContactedLawyers((prev) => new Set([...prev, lawyer.id]))}
                            className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-paper transition-colors hover:bg-accent-deep"
                          >
                            Request consultation <span>&rarr;</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted && decision === "submit") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-verdict-green/15">
            <svg className="h-8 w-8 text-verdict-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="mt-5 text-3xl text-ink">Letter prepared</h2>
          <p className="mt-2 text-[15px] text-ink-soft">Your pre-action letter is ready to download and send to the landlord.</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-7 sm:p-9">
          <div className="flex items-center justify-between border-b border-line-soft pb-4">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">Pre-action letter</span>
            <div className="flex gap-2">
              <button onClick={handleDownloadPdf} disabled={pdfGenerating} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-medium text-ink transition-colors hover:bg-canvas-deep disabled:opacity-50">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                {pdfGenerating ? "..." : "Download PDF"}
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-xs font-medium text-paper transition-colors hover:bg-accent-deep">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                Send letter
              </button>
            </div>
          </div>
          <pre className="mt-5 whitespace-pre-wrap font-serif text-[15px] leading-relaxed text-ink">{MOCK_SUBMISSION_PREVIEW}</pre>
          <div className="mt-6 border-t border-line-soft pt-5">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">Statutory basis</span>
            <ul className="mt-3 space-y-1.5 text-xs text-ink-soft">
              {caseRefs.filter((r) => r.relevance === "high").map((r) => (
                <li key={r.id} className="flex items-start gap-2"><span className="mt-0.5 text-accent">&#167;</span><span>{r.citation}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-line bg-paper p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-md border border-verdict-amber/40 bg-verdict-amber/10 px-2.5 py-1 text-xs font-semibold text-verdict-amber">ARGUABLE</span>
            <span className="text-sm text-ink">Prospects assessment</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{analysisData.summary}</p>
        </div>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button onClick={() => router.push("/demo")} className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-canvas-deep">Back to dashboard</button>
          <button onClick={() => { setSubmitted(false); setDecision(null); }} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent-deep">View report</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-faint"><span className="h-1 w-1 rounded-full bg-accent" />Case assessment report</span>
            <h1 className="mt-3 text-3xl leading-snug text-ink sm:text-4xl">{reportData.title}</h1>
            <p className="mt-1 text-sm text-ink-soft">{reportData.subtitle}</p>
          </div>
          <button onClick={handleDownloadPdf} disabled={pdfGenerating} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink-faint transition-colors hover:bg-canvas-deep hover:text-ink disabled:opacity-50" title="Download PDF">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            {pdfGenerating ? "..." : "PDF"}
          </button>
        </div>

        <div className="mt-6 flex gap-1 border-b border-line">
          {PAGE_TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === tab ? "text-ink" : "text-ink-faint hover:text-ink-soft"}`}>
              {tab}
              {activeTab === tab && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" />}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {/* ==================== OVERVIEW ==================== */}
          {activeTab === "Overview" && (
            <div className="space-y-8">
              <div className="rounded-2xl border border-line bg-paper p-7 sm:p-9">
                <div className="space-y-5 font-serif text-[15px] leading-relaxed text-ink">
                  {reportData.paragraphs.map((para, i) => (<p key={i}><HighlightedText text={para.text} highlights={para.highlights} /></p>))}
                </div>
                <div className="mt-6 flex items-center gap-4 border-t border-line-soft pt-5 text-xs text-ink-faint">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-verdict-green/25" />Supporting evidence</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-verdict-red/25" />Flag / risk</span>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-paper">
                <div className="flex border-b border-line">
                  {ANALYSIS_TABS.map((tab) => (
                    <button key={tab} onClick={() => setAnalysisTab(tab)} className={`relative flex-1 px-4 py-3 text-sm font-medium transition-colors ${analysisTab === tab ? "text-ink" : "text-ink-faint hover:text-ink-soft"}`}>
                      {tab}
                      {analysisTab === tab && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" />}
                    </button>
                  ))}
                </div>
                <div className="p-5">
                  {analysisTab === "Arguments for" && (<ul className="space-y-3">{analysisData.forPoints.map((p, i) => (<li key={i} className="flex gap-3 text-sm leading-relaxed text-ink"><span className="mt-0.5 font-medium text-verdict-green">+</span>{p}</li>))}</ul>)}
                  {analysisTab === "Counterarguments" && (<ul className="space-y-3">{analysisData.counterPoints.map((p, i) => (<li key={i} className="flex gap-3 text-sm leading-relaxed text-ink"><span className="mt-0.5 font-medium text-verdict-red">&minus;</span>{p}</li>))}</ul>)}
                  {analysisTab === "Summary" && (<p className="text-sm leading-relaxed text-ink-soft">{analysisData.summary}</p>)}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-line bg-paper p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">Verdict</span>
                    <span className={`rounded-md border px-2.5 py-1 text-xs font-medium ${RECOMMENDATION_STYLE[caseRecommendation]?.bg ?? ""} ${RECOMMENDATION_STYLE[caseRecommendation]?.border ?? ""} ${RECOMMENDATION_STYLE[caseRecommendation]?.text ?? ""}`}>
                      {RECOMMENDATION_STYLE[caseRecommendation]?.label ?? caseRecommendation}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="rounded-md border border-line px-2.5 py-1 text-xs font-medium text-ink-faint">WEAK</span>
                    <span className="rounded-md border border-verdict-amber/40 bg-verdict-amber/10 px-2.5 py-1 text-xs font-semibold text-verdict-amber">ARGUABLE</span>
                    <span className="rounded-md border border-line px-2.5 py-1 text-xs font-medium text-ink-faint">STRONG</span>
                  </div>
                  <p className="mt-4 font-serif text-lg leading-snug text-ink">An arguable case, worth pursuing with preparation.</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">The evidence supports a claim but the signed satisfaction form is a material risk. An independent survey would significantly strengthen the position.</p>
                </div>

                <div className="rounded-2xl border border-line bg-paper p-6">
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">Recommended action</span>
                  <div className="mt-4 space-y-3">
                    <button onClick={() => setDecision("submit")} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${decision === "submit" ? "border-verdict-green/40 bg-verdict-green/5" : "border-line hover:bg-canvas-deep"}`}>
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${decision === "submit" ? "bg-verdict-green/20" : "bg-canvas-deep"}`}>
                        <svg className={`h-4 w-4 ${decision === "submit" ? "text-verdict-green" : "text-ink-faint"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                      </span>
                      <div><p className="text-sm font-medium text-ink">Send pre-action letter</p><p className="mt-0.5 text-xs text-ink-soft">Formal letter before action</p></div>
                    </button>
                    <button onClick={() => setDecision("escalate")} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${decision === "escalate" ? "border-accent/40 bg-accent-tint" : "border-line hover:bg-canvas-deep"}`}>
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${decision === "escalate" ? "bg-accent/15" : "bg-canvas-deep"}`}>
                        <svg className={`h-4 w-4 ${decision === "escalate" ? "text-accent" : "text-ink-faint"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                      </span>
                      <div><p className="text-sm font-medium text-ink">Escalate to Lawhive</p><p className="mt-0.5 text-xs text-ink-soft">Solicitor with prepared file</p></div>
                    </button>
                    {decision && (
                      <button onClick={() => setSubmitted(true)} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent-deep">
                        {decision === "escalate" ? "Escalate to Lawhive" : "Prepare letter"}<span aria-hidden>&rarr;</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-paper p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">Key references</span>
                  <button onClick={() => setActiveTab("References")} className="text-xs font-medium text-accent hover:text-accent-deep">View all &rarr;</button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {caseRefs.filter((r) => r.relevance === "high").map((r) => (<span key={r.id} className="rounded-lg border border-line bg-canvas-deep px-3 py-1.5 text-xs font-medium text-ink-soft">{r.shortLabel}</span>))}
                </div>
                <div className="mt-3 space-y-2">
                  {caseRefs.filter((r) => r.relevance === "high").map((r) => (
                    <div key={r.id} className="flex items-start gap-2 text-sm"><span className="mt-0.5 text-accent">&#167;</span><div><span className="font-medium text-ink">{r.shortLabel}</span><span className="text-ink-soft"> — {r.summary}</span></div></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== DOCUMENTS ==================== */}
          {activeTab === "Documents" && (
            <div className="space-y-6">
              {previewFile && (
                <div className="rounded-2xl border border-line bg-paper">
                  <div className="flex items-center justify-between border-b border-line px-5 py-3">
                    <span className="text-sm font-medium text-ink">{CASE_07_FILES.find((f) => f.path === previewFile)?.name}</span>
                    <button onClick={() => setPreviewFile(null)} className="rounded-lg p-1.5 text-ink-faint hover:bg-canvas-deep hover:text-ink">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  {previewFile.endsWith(".pdf") ? (
                    <iframe src={previewFile} className="h-[70vh] w-full" title="Document preview" />
                  ) : (
                    <div className="flex justify-center p-4"><img src={previewFile} alt="Evidence" className="max-h-[70vh] rounded-lg" /></div>
                  )}
                </div>
              )}

              {!previewFile && (
                <>
                  {!filesLoaded && (
                    <button
                      onClick={handleUpload}
                      className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-line bg-paper py-8 transition-colors hover:border-accent/40 hover:bg-accent-tint"
                    >
                      <svg className="h-8 w-8 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                      <span className="text-sm font-medium text-ink-soft">Click to load case files</span>
                      <span className="text-xs text-ink-faint">Loads documents from the case folder</span>
                    </button>
                  )}

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex w-full cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-line bg-paper py-6 transition-colors hover:border-accent/40 hover:bg-accent-tint ${filesLoaded ? "" : "mt-0"}`}
                  >
                    <svg className="h-6 w-6 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    <span className="text-sm font-medium text-ink-soft">Upload your own files</span>
                    <span className="text-xs text-ink-faint">PDF, images, or text files</span>
                  </button>
                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleRealUpload} />

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">Case files ({uploadedFiles.length})</span>
                      {CASE_07_FILES.map((f) => (
                        <button key={f.path} onClick={() => setPreviewFile(f.path)} className="flex w-full items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-left transition-colors hover:border-accent/30 hover:bg-accent-tint">
                          {f.type === "pdf" ? (
                            <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                          ) : (
                            <svg className="h-5 w-5 text-verdict-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                          )}
                          <span className="flex-1 text-sm text-ink">{f.name}</span>
                          <span className="text-xs text-ink-faint">{f.size}</span>
                          <span className="text-xs text-accent">View &rarr;</span>
                        </button>
                      ))}
                      {userFiles.map((f) => (
                        <button key={f.url} onClick={() => setPreviewFile(f.url)} className="flex w-full items-center gap-3 rounded-xl border border-accent/30 bg-accent-tint px-4 py-3 text-left transition-colors hover:bg-accent-tint">
                          <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                          <span className="flex-1 text-sm text-ink">{f.name}</span>
                          <span className="rounded border border-accent/30 px-1.5 py-0.5 text-[10px] font-medium text-accent">Uploaded</span>
                          <span className="text-xs text-accent">View &rarr;</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {uploadedFiles.length > 0 && (
                    <div>
                      <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">Extracted evidence</span>
                      <div className="mt-3 space-y-2">
                        {fileResults.map((fr) => (
                          <button key={fr.id} onClick={() => toggleFileResult(fr.id)} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${fr.selected ? "border-accent/40 bg-accent-tint" : "border-line bg-paper hover:bg-canvas-deep"}`}>
                            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${fr.selected ? "border-accent bg-accent" : "border-ink-faint/40"}`}>
                              {fr.selected && <svg className="h-3 w-3 text-paper" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                            </span>
                            <span className="text-sm text-ink">{fr.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ==================== REFERENCES ==================== */}
          {activeTab === "References" && (
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="shrink-0 lg:w-[340px]">
                <div className="sticky top-20 rounded-2xl border border-line bg-paper p-5">
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">Case report</span>
                  <div className="mt-3 max-h-[60vh] space-y-3 overflow-y-auto font-serif text-xs leading-relaxed text-ink-soft">
                    {reportData.paragraphs.map((para, i) => (<p key={i}><HighlightedText text={para.text} highlights={para.highlights} activeHighlights={activeHighlights} /></p>))}
                  </div>
                  <div className="mt-3 flex items-center gap-3 border-t border-line-soft pt-3 text-[10px] text-ink-faint">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-verdict-green/25" />Supporting</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-verdict-red/25" />Flag</span>
                  </div>
                </div>
              </div>
              <div className="min-w-0 flex-1 space-y-4">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-verdict-green">Supporting references</span>
                {caseRefs.map((ref) => (
                  <div key={ref.id} className={`rounded-xl border bg-paper transition-colors ${expandedRef === ref.id ? "border-accent/30" : "border-line"}`}>
                    <button onClick={() => setExpandedRef(expandedRef === ref.id ? null : ref.id)} className="flex w-full items-start justify-between p-5 text-left">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${RELEVANCE_STYLE[ref.relevance]}`}>{ref.relevance}</span>
                          <span className="text-sm font-medium text-ink">{ref.citation}</span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{ref.summary}</p>
                      </div>
                      <svg className={`ml-3 mt-1 h-5 w-5 shrink-0 text-ink-faint transition-transform ${expandedRef === ref.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </button>
                    {expandedRef === ref.id && (
                      <div className="border-t border-line-soft px-5 py-4 space-y-4">
                        <p className="font-serif text-sm leading-relaxed text-ink">{ref.fullText}</p>
                        <div className="rounded-lg bg-accent-tint p-4">
                          <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent">How this applies</span>
                          <p className="mt-2 text-sm leading-relaxed text-ink">{ref.application}</p>
                          {ref.highlightLinks.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {ref.highlightLinks.map((hl) => (<span key={hl} className="rounded border border-accent/30 bg-paper px-2 py-0.5 text-xs text-accent">&ldquo;{hl}&rdquo;</span>))}
                            </div>
                          )}
                        </div>
                        <a href={ref.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-deep">
                          View on legislation.gov.uk
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                        </a>
                      </div>
                    )}
                  </div>
                ))}

                <div className="mt-6" />
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-verdict-red">Counterargument references</span>
                {caseCounterRefs.map((cr) => (
                  <div key={cr.id} className={`rounded-xl border bg-paper transition-colors ${expandedRef === cr.id ? "border-verdict-red/30" : "border-line"}`}>
                    <button onClick={() => setExpandedRef(expandedRef === cr.id ? null : cr.id)} className="flex w-full items-start justify-between p-5 text-left">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md border border-verdict-red/40 bg-verdict-red/10 px-2 py-0.5 text-xs font-medium text-verdict-red">counter</span>
                          <span className="text-sm font-medium text-ink">{cr.argument}</span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{cr.basis}</p>
                      </div>
                      <svg className={`ml-3 mt-1 h-5 w-5 shrink-0 text-ink-faint transition-transform ${expandedRef === cr.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </button>
                    {expandedRef === cr.id && (
                      <div className="border-t border-line-soft px-5 py-4 space-y-4">
                        <p className="text-sm leading-relaxed text-ink">{cr.detail}</p>
                        {cr.highlightLinks.length > 0 && (
                          <div className="rounded-lg bg-verdict-red/5 p-4">
                            <span className="text-xs font-medium uppercase tracking-[0.14em] text-verdict-red">Related report text</span>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {cr.highlightLinks.map((hl) => (<span key={hl} className="rounded border border-verdict-red/30 bg-paper px-2 py-0.5 text-xs text-verdict-red">&ldquo;{hl}&rdquo;</span>))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <FloatingChat messages={messages} addMessage={addMessage} onExpand={() => router.push("/demo/chat")} />
    </>
  );
}
