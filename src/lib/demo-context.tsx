"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { IntakeReport } from "@/lib/intake/types";

export type Message = { role: "user" | "assistant"; content: string };

export type ReportVerdict = {
  prospects: "strong" | "arguable" | "weak" | "pending";
  recommendation: "self-serve" | "escalate-to-solicitor" | "reconsider-pursuing";
};

export type ResearchItem = {
  id: string;
  snippet: string;
  source: string;
  relevance: "high" | "moderate" | "low";
  selected: boolean;
};

export type UploadedFile = { name: string; size: string };

export type ReportHighlight = { text: string; type: "support" | "flag" };

export type ReportParagraph = {
  text: string;
  highlights: ReportHighlight[];
};

export type ReportData = {
  title: string;
  subtitle: string;
  paragraphs: ReportParagraph[];
};

export type AnalysisData = {
  forPoints: string[];
  counterPoints: string[];
  summary: string;
};

type DemoState = {
  messages: Message[];
  addMessage: (msg: Message) => void;
  researchItems: ResearchItem[];
  toggleResearch: (id: string) => void;
  uploadedFiles: UploadedFile[];
  addFile: (f: UploadedFile) => void;
  reportData: ReportData;
  analysisData: AnalysisData;
  reportVerdict: ReportVerdict;
  // True once the chat has populated the report with real content (vs the mock).
  reportPopulated: boolean;
  // Called from the entry chat each turn to push the AI's live report in.
  setReport: (report: IntakeReport) => void;
};

const DemoContext = createContext<DemoState | null>(null);

export function useDemoContext() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoContext must be used within DemoProvider");
  return ctx;
}

import { MOCK_RESEARCH, MOCK_REPORT, MOCK_ANALYSIS } from "./demo-data";

const DEFAULT_VERDICT: ReportVerdict = {
  prospects: "arguable",
  recommendation: "escalate-to-solicitor",
};

// Everything the chat builds is persisted locally as JSON so it survives a
// reload and the chat -> report hop. (File blobs aren't serialisable, so only
// the structured report is stored.)
const STORAGE_KEY = "hivelaw.demo.report.v1";

type PersistedReport = {
  reportData: ReportData;
  analysisData: AnalysisData;
  reportVerdict: ReportVerdict;
  reportPopulated: boolean;
};

export function DemoProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [researchItems, setResearchItems] = useState<ResearchItem[]>(MOCK_RESEARCH);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [reportData, setReportData] = useState<ReportData>(MOCK_REPORT);
  const [analysisData, setAnalysisData] = useState<AnalysisData>(MOCK_ANALYSIS);
  const [reportVerdict, setReportVerdict] = useState<ReportVerdict>(DEFAULT_VERDICT);
  const [reportPopulated, setReportPopulated] = useState(false);

  // Hydrate the persisted report after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as PersistedReport;
      if (parsed.reportPopulated) {
        setReportData(parsed.reportData);
        setAnalysisData(parsed.analysisData);
        setReportVerdict(parsed.reportVerdict);
        setReportPopulated(true);
      }
    } catch {
      // Ignore corrupt storage — fall back to the mock report.
    }
  }, []);

  const addMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);

  const toggleResearch = (id: string) =>
    setResearchItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );

  const addFile = (f: UploadedFile) =>
    setUploadedFiles((prev) => [...prev, f]);

  // Map the AI's live report into the report-page shapes and persist it.
  const setReport = (report: IntakeReport) => {
    const nextReportData: ReportData = {
      title: report.title,
      subtitle: report.subtitle,
      paragraphs: report.paragraphs,
    };
    const nextAnalysis: AnalysisData = {
      forPoints: report.forPoints,
      counterPoints: report.counterPoints,
      summary: report.summary,
    };
    const nextVerdict: ReportVerdict = {
      prospects: report.prospects,
      recommendation: report.recommendation,
    };

    setReportData(nextReportData);
    setAnalysisData(nextAnalysis);
    setReportVerdict(nextVerdict);
    setReportPopulated(true);

    if (typeof window !== "undefined") {
      const payload: PersistedReport = {
        reportData: nextReportData,
        analysisData: nextAnalysis,
        reportVerdict: nextVerdict,
        reportPopulated: true,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
  };

  return (
    <DemoContext.Provider
      value={{
        messages,
        addMessage,
        researchItems,
        toggleResearch,
        uploadedFiles,
        addFile,
        reportData,
        analysisData,
        reportVerdict,
        reportPopulated,
        setReport,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}
