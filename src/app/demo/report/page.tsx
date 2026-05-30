"use client";

import { useState, useRef, useEffect } from "react";
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
  STEELMAN_CHAINS,
} from "@/lib/demo-data";

const PAGE_TABS = ["Overview", "Documents", "References", "The Steelman"] as const;
type PageTab = (typeof PAGE_TABS)[number];
const ANALYSIS_TABS = ["Arguments for", "Counterarguments", "Summary"] as const;
type AnalysisTab = (typeof ANALYSIS_TABS)[number];

const RECOMMENDATION_STYLE = {
  "escalate-to-solicitor": { label: "Escalate to solicitor", bg: "bg-verdict-amber/10", border: "border-verdict-amber/40", text: "text-verdict-amber" },
  "self-serve": { label: "Self-serve", bg: "bg-verdict-green/10", border: "border-verdict-green/40", text: "text-verdict-green" },
  "do-not-pursue": { label: "Do not pursue", bg: "bg-verdict-red/10", border: "border-verdict-red/40", text: "text-verdict-red" },
  "reconsider-pursuing": { label: "Reconsider pursuing", bg: "bg-verdict-red/10", border: "border-verdict-red/40", text: "text-verdict-red" },
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

function FloatingChat({ messages, addMessage, addFile, addUserFile, onExpand, onRegenerate }: { messages: { role: string; content: string }[]; addMessage: (msg: { role: "user" | "assistant"; content: string }) => void; addFile: (f: { name: string; size: string }) => void; addUserFile: (f: { name: string; url: string; type: "pdf" | "image" | "other" }) => void; onExpand: () => void; onRegenerate: () => void }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const chatFileRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    addMessage({ role: "user", content: text });
    setInput("");
    setTimeout(() => {
      addMessage({ role: "assistant", content: "I've noted that additional detail. Let me update the case assessment to reflect this new information." });
      setTimeout(onRegenerate, 500);
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((f) => {
      addFile({ name: f.name, size: `${(f.size / 1024).toFixed(0)} KB` });
      const url = URL.createObjectURL(f);
      const type = f.type.startsWith("image/") ? "image" as const : f.type === "application/pdf" ? "pdf" as const : "other" as const;
      addUserFile({ name: f.name, url, type });
      addMessage({ role: "user", content: `[Uploaded: ${f.name}]` });
    });
    e.target.value = "";
    setTimeout(() => {
      addMessage({ role: "assistant", content: "Document received. I'll incorporate this into the case assessment." });
      setTimeout(onRegenerate, 500);
    }, 600);
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
          <button onClick={() => chatFileRef.current?.click()} className="rounded-lg p-1.5 text-ink-faint hover:bg-canvas-deep hover:text-ink" title="Upload file">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
          </button>
          <input ref={chatFileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.gif,.webp" className="hidden" onChange={handleFileUpload} />
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Add details or evidence..." className="flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-ink-faint" />
          <button onClick={handleSend} disabled={!input.trim()} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-paper disabled:bg-ink/15 disabled:text-ink-faint">Send</button>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  const router = useRouter();
  const { messages, addMessage, reportData, analysisData, researchItems, toggleResearch, uploadedFiles, addFile, userFiles, addUserFile, activeCase } = useDemoContext();
  const [activeTab, setActiveTab] = useState<PageTab>("Overview");
  const [analysisTab, setAnalysisTab] = useState<AnalysisTab>("Arguments for");
  const [decision, setDecision] = useState<"submit" | "escalate" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileResults, setFileResults] = useState(MOCK_FILE_RESULTS.map((f) => ({ ...f })));
  const [expandedRef, setExpandedRef] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string; type: "pdf" | "image" | "other" } | null>(null);
  const [filesLoaded, setFilesLoaded] = useState(true);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [showEmailCompose, setShowEmailCompose] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [letterBody, setLetterBody] = useState(MOCK_SUBMISSION_PREVIEW);
  const [emailAttachments, setEmailAttachments] = useState<string[]>(["Pre-Action Letter.pdf", ...CASE_07_FILES.map((f) => f.name)]);
  const removeAttachment = (name: string) => setEmailAttachments((prev) => prev.filter((a) => a !== name));
  // The Steelman tab: one chain expanded at a time (hero chain open by default)
  const [openChain, setOpenChain] = useState<string | null>(STEELMAN_CHAINS[0]?.id ?? null);
  const [contactedLawyers, setContactedLawyers] = useState<Set<string>>(new Set());
  const [linkCopied, setLinkCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const caseRefs = activeCase?.references ?? MOCK_EXTENDED_REFERENCES;
  const caseCounterRefs = activeCase?.counterReferences ?? MOCK_COUNTER_REFERENCES;
  const caseProspects = activeCase?.prospects ?? "arguable";
  const caseRecommendation = activeCase?.recommendation ?? "escalate-to-solicitor";
  // Live intake supplies its own grounded Steelman chains; curated/empty cases
  // fall back to the built-in demo chains.
  const steelmanChains = activeCase?.steelman?.length ? activeCase.steelman : STEELMAN_CHAINS;

  const activeHighlights = expandedRef
    ? (caseRefs.find((r) => r.id === expandedRef)?.highlightLinks ??
       caseCounterRefs.find((r) => r.id === expandedRef)?.highlightLinks ?? [])
    : [];

  const toggleFileResult = (id: string) => setFileResults((prev) => prev.map((f) => (f.id === id ? { ...f, selected: !f.selected } : f)));

  useEffect(() => {
    if (uploadedFiles.length === 0) {
      CASE_07_FILES.forEach((f) => addFile({ name: f.name, size: f.size }));
    }
  }, []);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRealUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((f) => {
      addFile({ name: f.name, size: `${(f.size / 1024).toFixed(0)} KB` });
      const url = URL.createObjectURL(f);
      const type = f.type.startsWith("image/") ? "image" as const : f.type === "application/pdf" ? "pdf" as const : "other" as const;
      addUserFile({ name: f.name, url, type });
    });
    e.target.value = "";
  };

  const handleDownloadPdf = () => {
    setPdfGenerating(true);
    setTimeout(() => {
      window.print();
      setPdfGenerating(false);
    }, 200);
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
            <div className="flex flex-col gap-2">
              <div className="flex gap-3">
                <button onClick={handleDownloadPdf} disabled={pdfGenerating} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-xs font-medium text-paper transition-colors hover:bg-accent-deep disabled:opacity-50">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  {pdfGenerating ? "Generating..." : "Download PDF"}
                </button>
                <button onClick={() => router.push("/demo")} className="inline-flex flex-1 items-center justify-center rounded-full border border-line px-4 py-2.5 text-xs font-medium text-ink transition-colors hover:bg-canvas-deep">Dashboard</button>
              </div>
              <button
                onClick={() => {
                  const caseId = activeCase?.id ?? "case-07";
                  const url = `${window.location.origin}/demo/report/${caseId}`;
                  navigator.clipboard.writeText(url);
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 3000);
                }}
                className={`inline-flex w-full items-center justify-center gap-1.5 rounded-full border px-4 py-2.5 text-xs font-medium transition-colors ${linkCopied ? "border-verdict-green/40 bg-verdict-green/10 text-verdict-green" : "border-line text-ink hover:bg-canvas-deep"}`}
              >
                {linkCopied ? (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Link copied
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
                    Share report with solicitor
                  </>
                )}
              </button>
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
                    <img src={lawyer.imageUrl} alt={lawyer.name} className="h-16 w-16 rounded-full border border-line bg-canvas-deep object-cover" />
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
    if (emailSent) {
      return (
        <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-verdict-green/15">
              <svg className="h-8 w-8 text-verdict-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="mt-5 text-3xl text-ink">Letter sent</h2>
            <p className="mt-2 text-[15px] text-ink-soft">Pre-action letter with {CASE_07_FILES.length} attached documents sent to {emailTo || "the recipient"}.</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <button onClick={() => router.push("/demo")} className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-canvas-deep">Back to dashboard</button>
              <button onClick={() => { setSubmitted(false); setDecision(null); setEmailSent(false); setShowEmailCompose(false); }} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent-deep">View report</button>
            </div>
          </div>
        </div>
      );
    }

    if (showEmailCompose) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="rounded-2xl border border-line bg-paper shadow-[0_8px_30px_-8px_rgba(40,20,20,0.3)]">
            {/* Email header */}
            <div className="border-b border-line p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-ink">Send pre-action letter</h2>
                <button onClick={() => setShowEmailCompose(false)} className="rounded-lg p-1.5 text-ink-faint hover:bg-canvas-deep hover:text-ink">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* To field */}
            <div className="border-b border-line-soft px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-ink-faint">To:</span>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="landlord@example.com"
                  className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="border-b border-line-soft px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-ink-faint">Subject:</span>
                <span className="text-sm text-ink">Pre-Action Letter — {reportData.title}</span>
              </div>
            </div>

            {/* Attachments */}
            <div className="border-b border-line-soft px-5 py-3">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">Attachments ({emailAttachments.length})</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {emailAttachments.map((name) => (
                  <span key={name} className={`group inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs ${name === "Pre-Action Letter.pdf" ? "border-accent/30 bg-accent-tint font-medium text-accent" : "border-line bg-canvas-deep text-ink-soft"}`}>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
                    {name}
                    <button onClick={() => removeAttachment(name)} className="ml-1 rounded-full p-0.5 opacity-0 transition-opacity hover:bg-ink/10 group-hover:opacity-100">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Letter body — editable */}
            <div className="px-5 py-4">
              <textarea
                value={letterBody}
                onChange={(e) => setLetterBody(e.target.value)}
                className="w-full resize-none whitespace-pre-wrap rounded-lg border border-line-soft bg-transparent p-3 font-serif text-sm leading-relaxed text-ink outline-none transition-colors focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
                rows={16}
              />
              <div className="mt-4 border-t border-line-soft pt-4">
                <span className="text-xs text-ink-faint">Statutory basis:</span>
                <ul className="mt-1 space-y-0.5 text-xs text-ink-soft">
                  {caseRefs.filter((r) => r.relevance === "high").map((r) => (
                    <li key={r.id}>&#167; {r.citation}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Send button */}
            <div className="border-t border-line p-5">
              <button
                onClick={() => { setEmailSent(true); }}
                disabled={!emailTo.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                {emailAttachments.length > 0 ? `Send with ${emailAttachments.length} attachments` : "Send letter"}
              </button>
            </div>
          </div>
        </div>
      );
    }

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
              <button
                onClick={() => setShowEmailCompose(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-xs font-medium text-paper transition-colors hover:bg-accent-deep"
              >
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

        <div className="mt-6 flex flex-wrap gap-1 border-b border-line">
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
                    <span className="text-sm font-medium text-ink">{previewFile.name}</span>
                    <button onClick={() => setPreviewFile(null)} className="rounded-lg p-1.5 text-ink-faint hover:bg-canvas-deep hover:text-ink">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  {previewFile.type === "pdf" ? (
                    <iframe src={previewFile.url} className="h-[70vh] w-full" title="Document preview" />
                  ) : previewFile.type === "image" ? (
                    <div className="flex justify-center p-4"><img src={previewFile.url} alt={previewFile.name} className="max-h-[70vh] rounded-lg" /></div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-ink-faint">
                      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                      <p className="mt-3 text-sm">{previewFile.name}</p>
                      <p className="mt-1 text-xs">Preview not available for this file type</p>
                    </div>
                  )}
                </div>
              )}

              {!previewFile && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-line bg-paper py-6 transition-colors hover:border-accent/40 hover:bg-accent-tint"
                  >
                    <svg className="h-6 w-6 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    <span className="text-sm font-medium text-ink-soft">Upload additional files</span>
                    <span className="text-xs text-ink-faint">PDF, images, or text files</span>
                  </button>
                  <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.txt,.doc,.docx" className="hidden" onChange={handleRealUpload} />

                  {(uploadedFiles.length > 0 || userFiles.length > 0) && (
                    <div className="space-y-2">
                      <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">Case files ({uploadedFiles.length + userFiles.length})</span>
                      {uploadedFiles.length > 0 && CASE_07_FILES.map((f) => (
                        <button key={f.path} onClick={() => setPreviewFile({ url: f.path, name: f.name, type: f.type === "text" ? "other" : f.type })} className="flex w-full items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-left transition-colors hover:border-accent/30 hover:bg-accent-tint">
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
                        <button key={f.url} onClick={() => setPreviewFile({ url: f.url, name: f.name, type: f.type })} className="flex w-full items-center gap-3 rounded-xl border border-accent/30 bg-accent-tint px-4 py-3 text-left transition-colors hover:bg-accent-tint">
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

          {/* ==================== THE STEELMAN ==================== */}
          {activeTab === "The Steelman" && (
            <div className="space-y-6">
              {/* Intro — frame the tab honestly */}
              <div>
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">The Steelman — the strongest arguments the other side will make</span>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
                  Each argument below is one a court would hear from the other side, grounded in a quote from your own case file. We give you the strongest honest reply to each &mdash; and show you where it stays contested, rather than pretending you&rsquo;ve won.
                </p>
              </div>

              {/* Summary strip — the honest overview at a glance (the billboard test) */}
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-canvas-deep px-4 py-3">
                <span className="font-serif text-lg text-ink">{steelmanChains.length} arguments</span>
                <span className="text-sm text-ink-soft">they will run against you</span>
                {steelmanChains.filter((c) => c.verdict === "arguable").length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-verdict-amber/40 bg-verdict-amber/10 px-2.5 py-1 text-xs font-semibold text-verdict-amber">
                    <span className="h-1.5 w-1.5 rounded-full bg-verdict-amber" />
                    {steelmanChains.filter((c) => c.verdict === "arguable").length} arguable
                  </span>
                )}
                {steelmanChains.filter((c) => c.verdict === "strong-for-them").length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-verdict-red/40 bg-verdict-red/10 px-2.5 py-1 text-xs font-semibold text-verdict-red">
                    {steelmanChains.filter((c) => c.verdict === "strong-for-them").length} strong for them
                  </span>
                )}
                <span className="ml-auto text-xs text-ink-faint">Tap any argument to see the chain</span>
              </div>

              {/* Accordion of chains — the collapsed list IS the overview; one open at a time */}
              <div className="space-y-3">
                {steelmanChains.map((chain, i) => {
                  const open = openChain === chain.id;
                  const isArguable = chain.verdict === "arguable";
                  return (
                    <div key={chain.id} className={`overflow-hidden rounded-2xl border bg-paper transition-colors ${open ? "border-accent" : "border-line"}`}>
                      {/* Header — node 1 (the opponent's argument) doubles as the toggle */}
                      <button onClick={() => setOpenChain(open ? null : chain.id)} className="flex w-full items-center gap-4 p-5 text-left">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${open ? "bg-accent text-paper" : "bg-canvas-deep text-ink-soft"}`}>{i + 1}</span>
                        <span className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-verdict-red">The opponent will argue</span>
                          <span className="mt-1 block font-serif text-[15px] leading-snug text-ink">{chain.opponentArgument}</span>
                        </span>
                        <span className={`hidden shrink-0 rounded-md border px-2.5 py-1 text-xs font-semibold sm:inline ${isArguable ? "border-verdict-amber/40 bg-verdict-amber/10 text-verdict-amber" : "border-verdict-red/40 bg-verdict-red/10 text-verdict-red"}`}>
                          {isArguable ? "ARGUABLE" : "STRONG FOR THEM"}
                        </span>
                        <svg className={`h-5 w-5 shrink-0 text-ink-faint transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                      </button>

                      {/* Body — the threaded chain, revealed on expand. Spine = left border; the final node is an open dashed circle that refuses to close. */}
                      {open && (
                        <div className="border-t border-line-soft px-5 pt-4 pb-6">
                          <div className="relative ml-2 space-y-6 border-l border-line pl-8">
                            {/* Node 2 — they quote your own evidence (the gut-punch) */}
                            <div className="relative">
                              <span className="absolute top-0 -left-[44px] flex h-6 w-6 items-center justify-center rounded-full bg-accent text-paper">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-verdict-red">They quote your own evidence</span>
                              <div className="mt-2 rounded-xl border border-verdict-red/20 bg-verdict-red/5 p-4">
                                <p className="font-serif text-[15px] italic leading-relaxed text-ink">&ldquo;{chain.sourceQuote}&rdquo;</p>
                                <p className="mt-2 text-xs font-medium text-verdict-red">{chain.quoteCaption}</p>
                              </div>
                            </div>

                            {/* Node 3 — your strongest honest reply, grounded in statute */}
                            <div className="relative">
                              <span className="absolute top-0 -left-[44px] flex h-6 w-6 items-center justify-center rounded-full bg-accent text-paper">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent">Your strongest reply</span>
                              <p className="mt-2 text-sm leading-relaxed text-ink">{chain.reply}</p>
                              <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-line bg-canvas-deep px-3 py-1.5 text-xs text-ink-soft">
                                <span className="font-bold text-accent">&#167;</span>{chain.statute}
                              </div>
                            </div>

                            {/* Node 4 — still unresolved: an open, dashed node, never a checkmark */}
                            <div className="relative">
                              <span className="absolute top-0 -left-[44px] h-6 w-6 rounded-full border-2 border-dashed border-verdict-amber bg-paper" />
                              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-verdict-amber">Still unresolved</span>
                              <div className="mt-2 rounded-xl border border-dashed border-verdict-amber/50 bg-verdict-amber/5 p-4">
                                <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${isArguable ? "border-verdict-amber/40 bg-verdict-amber/10 text-verdict-amber" : "border-verdict-red/40 bg-verdict-red/10 text-verdict-red"}`}>
                                  {isArguable ? "ARGUABLE" : "STRONG FOR THEM"}
                                </span>
                                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{chain.unresolvedNote}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Tie the per-chain "unresolved" to the page-level verdict */}
              <div className="rounded-xl border border-line bg-paper p-5">
                <p className="text-sm leading-relaxed text-ink-soft">
                  Every exchange above stays <span className="font-medium text-ink">contested</span>. Taken together, this is an <span className="font-medium text-verdict-amber">arguable</span> case &mdash; strong enough to pursue, but only with the file prepared. See the{" "}
                  <button onClick={() => setActiveTab("Overview")} className="font-medium text-accent hover:text-accent-deep">verdict &amp; next steps &rarr;</button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <FloatingChat messages={messages} addMessage={addMessage} addFile={addFile} addUserFile={addUserFile} onExpand={() => router.push("/demo/chat")} onRegenerate={() => { setLoading(true); setTimeout(() => setLoading(false), 3000); }} />
    </>
  );
}
