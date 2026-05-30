"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Message = { role: "user" | "assistant"; content: string };

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

  const addMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);

  const toggleResearch = (id: string) =>
    setResearchItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );

  const addFile = (f: UploadedFile) =>
    setUploadedFiles((prev) => [...prev, f]);

  return (
    <DemoContext.Provider
      value={{
        messages,
        addMessage,
        researchItems,
        toggleResearch,
        uploadedFiles,
        addFile,
        reportData: MOCK_REPORT,
        analysisData: MOCK_ANALYSIS,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}
