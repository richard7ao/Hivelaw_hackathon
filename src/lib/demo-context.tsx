"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { IntakeReport } from "@/lib/intake/types";
import type { CaseData } from "./case-data";
import {
  MOCK_RESEARCH,
  MOCK_REPORT,
  MOCK_ANALYSIS,
  MOCK_EXTENDED_REFERENCES,
  MOCK_COUNTER_REFERENCES,
} from "./demo-data";

export type Message = { role: "user" | "assistant"; content: string };

export type ResearchItem = {
  id: string;
  snippet: string;
  source: string;
  relevance: "high" | "moderate" | "low";
  selected: boolean;
};

export type UploadedFile = { name: string; size: string };
export type UserFile = { name: string; url: string; type: "pdf" | "image" | "other" };

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
  userFiles: UserFile[];
  addUserFile: (f: UserFile) => void;
  reportData: ReportData;
  analysisData: AnalysisData;
  activeCase: CaseData | null;
  setActiveCase: (c: CaseData) => void;
  // Live intake: the entry chat maps its AI report into a CaseData and pushes
  // it in, so the report page renders it through the same activeCase path.
  setReport: (report: IntakeReport) => void;
};

const DemoContext = createContext<DemoState | null>(null);

export function useDemoContext() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoContext must be used within DemoProvider");
  return ctx;
}

// The active case (whether picked from the dashboard or built live by the chat)
// is persisted locally as JSON so it survives a reload and the chat -> report
// hop. File blobs aren't serialisable, so only the structured case is stored.
const STORAGE_KEY = "hivelaw.demo.active-case.v1";

export function DemoProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [researchItems, setResearchItems] = useState<ResearchItem[]>(MOCK_RESEARCH);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);
  const [activeCase, setActiveCaseState] = useState<CaseData | null>(null);

  // Hydrate the persisted case after mount (avoids an SSR hydration mismatch).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setActiveCaseState(JSON.parse(raw) as CaseData);
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

  const addFile = (f: UploadedFile) => setUploadedFiles((prev) => [...prev, f]);
  const addUserFile = (f: UserFile) => setUserFiles((prev) => [...prev, f]);

  const setActiveCase = (c: CaseData) => {
    setActiveCaseState(c);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    }
  };

  // Map the entry chat's live AI report into a CaseData and make it active.
  const setReport = (report: IntakeReport) => {
    setActiveCase({
      id: "live-intake",
      title: report.title,
      subtitle: report.subtitle,
      description: report.summary,
      prospects: report.prospects === "pending" ? "arguable" : report.prospects,
      recommendation: report.recommendation,
      recommendationDetail: report.summary,
      report: {
        title: report.title,
        subtitle: report.subtitle,
        paragraphs: report.paragraphs,
      },
      analysis: {
        forPoints: report.forPoints,
        counterPoints: report.counterPoints,
        summary: report.summary,
      },
      references: MOCK_EXTENDED_REFERENCES,
      counterReferences: MOCK_COUNTER_REFERENCES,
      status: "in-progress",
      date: "",
    });
  };

  const reportData = activeCase?.report ?? MOCK_REPORT;
  const analysisData = activeCase?.analysis ?? MOCK_ANALYSIS;

  return (
    <DemoContext.Provider
      value={{
        messages,
        addMessage,
        researchItems,
        toggleResearch,
        uploadedFiles,
        addFile,
        userFiles,
        addUserFile,
        reportData,
        analysisData,
        activeCase,
        setActiveCase,
        setReport,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}
