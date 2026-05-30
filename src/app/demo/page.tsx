"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoContext } from "@/lib/demo-context";
import { CASE_01, CASE_07, type CaseData } from "@/lib/case-data";

const STATUS_STYLE = {
  complete: { label: "Complete", dot: "bg-verdict-green", text: "text-verdict-green" },
  "in-progress": { label: "In progress", dot: "bg-verdict-amber", text: "text-verdict-amber" },
  new: { label: "New", dot: "bg-accent", text: "text-accent" },
} as const;

const PROSPECT_STYLE = {
  strong: { label: "Strong", bg: "bg-verdict-green/10", border: "border-verdict-green/40", text: "text-verdict-green" },
  arguable: { label: "Arguable", bg: "bg-verdict-amber/10", border: "border-verdict-amber/40", text: "text-verdict-amber" },
  weak: { label: "Weak", bg: "bg-verdict-red/10", border: "border-verdict-red/40", text: "text-verdict-red" },
  pending: { label: "Pending", bg: "bg-canvas-deep", border: "border-line", text: "text-ink-faint" },
} as const;

const REC_LABELS: Record<string, string> = {
  "self-serve": "Self-serve",
  "escalate-to-solicitor": "Escalate to solicitor",
  "reconsider-pursuing": "Do not pursue",
};

type DashboardCase = {
  case: CaseData | null;
  title: string;
  description: string;
  status: keyof typeof STATUS_STYLE;
  prospects: keyof typeof PROSPECT_STYLE;
  date: string;
  recommendation?: string;
};

const DASHBOARD_CASES: DashboardCase[] = [
  {
    case: CASE_07,
    title: CASE_07.title,
    description: CASE_07.description,
    status: CASE_07.status,
    prospects: CASE_07.prospects,
    date: CASE_07.date,
    recommendation: REC_LABELS[CASE_07.recommendation],
  },
  {
    case: CASE_01,
    title: CASE_01.title,
    description: CASE_01.description,
    status: CASE_01.status,
    prospects: CASE_01.prospects,
    date: CASE_01.date,
    recommendation: REC_LABELS[CASE_01.recommendation],
  },
  {
    case: null,
    title: "Heating failure — Flat 8, Elm House",
    description: "Boiler broken since February, landlord unresponsive. Two young children in the property.",
    status: "in-progress",
    prospects: "pending",
    date: "29 May 2026",
  },
  {
    case: null,
    title: "Noise complaint — 22 Park Lane",
    description: "Neighbour dispute over noise levels. Looking into whether this is a landlord or council matter.",
    status: "new",
    prospects: "pending",
    date: "30 May 2026",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const { setActiveCase } = useDemoContext();

  const handleCaseClick = (c: DashboardCase) => {
    if (c.case) {
      setActiveCase(c.case);
      router.push("/demo/report");
    } else {
      router.push("/demo/chat");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
            <span className="h-1 w-1 rounded-full bg-accent" />
            Dashboard
          </span>
          <h1 className="mt-3 text-3xl leading-snug text-ink sm:text-4xl">Your cases</h1>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-soft">
            Track and manage your legal assessments. Start a new case or pick up where you left off.
          </p>
        </div>
        <Link href="/demo/chat" className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-accent px-6 text-sm font-medium text-paper transition-colors hover:bg-accent-deep">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          New case
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total cases", value: DASHBOARD_CASES.length.toString() },
          { label: "Complete", value: DASHBOARD_CASES.filter((c) => c.status === "complete").length.toString() },
          { label: "In progress", value: DASHBOARD_CASES.filter((c) => c.status === "in-progress").length.toString() },
          { label: "New", value: DASHBOARD_CASES.filter((c) => c.status === "new").length.toString() },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-line bg-paper px-4 py-3">
            <p className="text-xs text-ink-faint">{stat.label}</p>
            <p className="mt-1 font-serif text-2xl text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {DASHBOARD_CASES.map((c, i) => {
          const status = STATUS_STYLE[c.status];
          const prospect = PROSPECT_STYLE[c.prospects];
          return (
            <button
              key={i}
              onClick={() => handleCaseClick(c)}
              className="group flex w-full flex-col gap-4 rounded-2xl border border-line bg-paper p-5 text-left transition-colors hover:border-accent/30 hover:bg-accent-tint sm:flex-row sm:items-center sm:p-6"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-[15px] font-medium text-ink group-hover:text-accent">{c.title}</h3>
                  <span className="flex items-center gap-1.5 text-xs">
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    <span className={status.text}>{status.label}</span>
                  </span>
                </div>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-soft">{c.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                <span className={`rounded-md border px-2.5 py-1 text-xs font-medium ${prospect.bg} ${prospect.border} ${prospect.text}`}>{prospect.label}</span>
                {c.recommendation && <span className="text-xs text-ink-faint">{c.recommendation}</span>}
                <span className="text-xs text-ink-faint">{c.date}</span>
              </div>
              <svg className="hidden h-5 w-5 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}
