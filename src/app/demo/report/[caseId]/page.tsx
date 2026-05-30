"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDemoContext } from "@/lib/demo-context";
import { ALL_CASES } from "@/lib/case-data";
import ReportPage from "../page";

export default function CaseReportPage() {
  const params = useParams();
  const caseId = params.caseId as string;
  const { setActiveCase } = useDemoContext();

  useEffect(() => {
    const caseData = ALL_CASES[caseId];
    if (caseData) setActiveCase(caseData);
  }, [caseId, setActiveCase]);

  return <ReportPage />;
}
