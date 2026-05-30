"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { CaseData } from "./case-data";

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
};

const DemoContext = createContext<DemoState | null>(null);

export function useDemoContext() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoContext must be used within DemoProvider");
  return ctx;
}

import { MOCK_RESEARCH, MOCK_REPORT, MOCK_ANALYSIS } from "./demo-data";

export function DemoProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [researchItems, setResearchItems] = useState<ResearchItem[]>(MOCK_RESEARCH);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);
  const [activeCase, setActiveCaseState] = useState<CaseData | null>(null);

  const addMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);

  const toggleResearch = (id: string) =>
    setResearchItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );

  const addFile = (f: UploadedFile) =>
    setUploadedFiles((prev) => [...prev, f]);

  const addUserFile = (f: UserFile) =>
    setUserFiles((prev) => [...prev, f]);

  const setActiveCase = (c: CaseData) => setActiveCaseState(c);

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
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}
