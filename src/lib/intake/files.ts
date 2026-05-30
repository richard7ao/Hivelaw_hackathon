import path from "node:path";

import { extractText, getDocumentProxy } from "unpdf";

import type { IntakeAttachmentInput, IntakeAttachmentKind } from "./types";

const TEXT_EXTENSIONS = new Set([".txt", ".md", ".json", ".csv", ".log"]);
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

// Cap per-document text so a big bundle (many PDFs at once) stays fast and the
// prompt stays small. The decisive wording in legal docs is near the top.
const MAX_DOC_CHARS = 8000;

export function classifyAttachment(
  name: string,
  mimeType: string,
): IntakeAttachmentKind {
  const extension = path.extname(name).toLowerCase();

  if (mimeType === "application/pdf" || extension === ".pdf") {
    return "pdf-document";
  }

  if (mimeType.startsWith("image/") || IMAGE_EXTENSIONS.has(extension)) {
    return "image-evidence";
  }

  if (mimeType.startsWith("text/") || TEXT_EXTENSIONS.has(extension)) {
    return "text-source";
  }

  return "unknown-needs-review";
}

export async function mapFormFileToAttachment(file: File) {
  const kind = classifyAttachment(file.name, file.type || "application/octet-stream");
  const attachment: IntakeAttachmentInput = {
    name: file.name,
    kind,
    size: file.size,
    mimeType: file.type || "application/octet-stream",
  };

  if (kind === "text-source") {
    attachment.textContent = (await file.text()).slice(0, MAX_DOC_CHARS);
  } else if (kind === "pdf-document") {
    // Extract the text layer server-side. This is far faster and cheaper than
    // shipping the whole PDF as base64 to the model, and it gives us the text
    // to string-match the Steelman quotes against (grounding). Scanned PDFs
    // with no text layer fall back to base64 vision in the Anthropic path.
    attachment.textContent = await extractPdfText(file);
  }

  return attachment;
}

async function extractPdfText(file: File): Promise<string | undefined> {
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const pdf = await getDocumentProxy(bytes);
    const { text } = await extractText(pdf, { mergePages: true });
    const clean = (Array.isArray(text) ? text.join("\n") : text).replace(/\s+\n/g, "\n").trim();
    // Too little text usually means a scanned/image-only PDF — let vision handle it.
    return clean.length >= 40 ? clean.slice(0, MAX_DOC_CHARS) : undefined;
  } catch {
    return undefined;
  }
}

export async function fileToBase64(file: File) {
  const bytes = await file.arrayBuffer();
  return Buffer.from(bytes).toString("base64");
}
