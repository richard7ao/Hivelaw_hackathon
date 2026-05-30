import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export type CaseDocument = {
  filename: string;
  description: string;
  evidenceType: string;
};

export type CaseManifestEntry = {
  id: string;
  title: string;
  domain: "housing-disrepair" | "deposit-protection" | "general-housing";
  claimant: string;
  problemStatement: string;
  keyFacts: string[];
  expectedEvidence: string[];
  documentInventory: CaseDocument[];
  followUpFocus: string[];
  fileRequestHints: string[];
  keywords: string[];
};

const CASES_ROOT = path.join(process.cwd(), "cases");

let manifestPromise: Promise<CaseManifestEntry[]> | null = null;

export function getCasesManifest() {
  if (!manifestPromise) {
    manifestPromise = buildCasesManifest();
  }

  return manifestPromise;
}

async function buildCasesManifest() {
  const files = await walk(CASES_ROOT);
  const caseFiles = files
    .filter((filePath) => /case_.*_Problem_Statement\.md$/i.test(filePath))
    .sort();

  return Promise.all(caseFiles.map(parseCaseFile));
}

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }

      return [fullPath];
    }),
  );

  return files.flat();
}

async function parseCaseFile(filePath: string): Promise<CaseManifestEntry> {
  const text = await readFile(filePath, "utf8");
  const title = matchSection(text, /^#\s+(.+)$/m) ?? path.basename(filePath, ".md");
  const claimant = matchSection(text, /^\*\*Claimant:\*\*\s*(.+)$/m) ?? "Unknown claimant";
  const problemStatement =
    matchSection(
      text,
      /## Problem, in the client's own words\s+([\s\S]*?)\n---\s+## Key Information/m,
    )
      ?.replace(/\n+/g, " ")
      .trim() ?? "";

  const keyFacts = parseKeyFacts(text);
  const documentInventory = parseDocumentInventory(text);
  const expectedEvidence = Array.from(
    new Set(documentInventory.map((item) => item.evidenceType)),
  );
  const domain = inferDomain(title, problemStatement, documentInventory);

  return {
    id: path.relative(CASES_ROOT, path.dirname(filePath)).replace(/\\/g, "/"),
    title,
    domain,
    claimant,
    problemStatement,
    keyFacts,
    expectedEvidence,
    documentInventory,
    followUpFocus: followUpFocusFor(domain),
    fileRequestHints: fileHintsFor(domain),
    keywords: buildKeywords(title, problemStatement, documentInventory),
  };
}

function parseKeyFacts(text: string) {
  const section = matchSection(
    text,
    /## Key Information\s+[\s\S]*?\n\|---\|---\|\n([\s\S]*?)\n---\s+## Documents Provided/m,
  );

  if (!section) {
    return [];
  }

  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"))
    .map((line) => line.split("|").map((part) => part.trim()).filter(Boolean))
    .filter((parts) => parts.length >= 2)
    .map(([field, value]) => `${field.replace(/\*+/g, "")}: ${value}`);
}

function parseDocumentInventory(text: string): CaseDocument[] {
  const section = matchSection(
    text,
    /## Documents Provided\s+[\s\S]*?\n\|---\|---\|---\|\n([\s\S]*)$/m,
  );

  if (!section) {
    return [];
  }

  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"))
    .map((line) => line.split("|").map((part) => part.trim()).filter(Boolean))
    .filter((parts) => parts.length >= 3)
    .map(([, filename, description]) => ({
      filename,
      description,
      evidenceType: inferEvidenceType(filename, description),
    }));
}

function inferDomain(title: string, problemStatement: string, documents: CaseDocument[]) {
  const haystack = `${title} ${problemStatement} ${documents
    .map((item) => item.filename + " " + item.description)
    .join(" ")}`.toLowerCase();

  if (haystack.includes("deposit")) {
    return "deposit-protection";
  }

  if (
    haystack.includes("damp") ||
    haystack.includes("mould") ||
    haystack.includes("mold") ||
    haystack.includes("disrepair")
  ) {
    return "housing-disrepair";
  }

  return "general-housing";
}

function inferEvidenceType(filename: string, description: string) {
  const label = `${filename} ${description}`.toLowerCase();

  if (label.includes("tenancy")) return "tenancy agreement";
  if (label.includes("bank statement") || label.includes("payment")) {
    return "payment proof";
  }
  if (label.includes("email")) return "email chain";
  if (label.includes("photo") || label.includes("image")) return "photos";
  if (label.includes("report") || label.includes("inspection")) {
    return "inspection report";
  }
  if (label.includes("gp") || label.includes("doctor")) return "medical evidence";
  if (label.includes("search result") || label.includes("screenshot")) {
    return "portal screenshots";
  }
  if (label.includes("form")) return "signed form";
  if (label.includes("call log")) return "call log";

  return "supporting document";
}

function followUpFocusFor(domain: CaseManifestEntry["domain"]) {
  switch (domain) {
    case "deposit-protection":
      return [
        "When was the deposit paid and when did the tenancy start?",
        "Was the landlord a private landlord or an agent?",
        "Have all three deposit protection schemes been checked?",
        "What outcome matters most: return of the deposit, compensation, or both?",
      ];
    case "housing-disrepair":
      return [
        "How long has the issue been going on and how often has it been reported?",
        "Which rooms are affected and is anyone's health being affected?",
        "What has the landlord, council, or contractor actually done so far?",
        "What evidence already exists in writing or in photos?",
      ];
    default:
      return [
        "What happened?",
        "Who is the other side?",
        "What evidence do you already have?",
      ];
  }
}

function fileHintsFor(domain: CaseManifestEntry["domain"]) {
  switch (domain) {
    case "deposit-protection":
      return [
        "tenancy agreement",
        "proof of deposit payment",
        "scheme search screenshots",
      ];
    case "housing-disrepair":
      return [
        "tenancy agreement",
        "email chain with landlord or council",
        "dated photos showing progression",
        "inspection report or signed works form",
        "GP letter if there is a health impact",
      ];
    default:
      return ["agreement or contract", "emails or letters", "photos or screenshots"];
  }
}

function buildKeywords(
  title: string,
  problemStatement: string,
  documents: CaseDocument[],
) {
  const raw = `${title} ${problemStatement} ${documents
    .map((item) => `${item.filename} ${item.description}`)
    .join(" ")}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3);

  return Array.from(new Set(raw));
}

function matchSection(text: string, pattern: RegExp) {
  return text.match(pattern)?.[1]?.trim();
}
