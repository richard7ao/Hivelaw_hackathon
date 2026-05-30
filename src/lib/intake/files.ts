import path from "node:path";

import type { IntakeAttachmentInput, IntakeAttachmentKind } from "./types";

const TEXT_EXTENSIONS = new Set([".txt", ".md", ".json", ".csv", ".log"]);
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

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
    attachment.textContent = (await file.text()).slice(0, 20000);
  }

  return attachment;
}

export async function fileToBase64(file: File) {
  const bytes = await file.arrayBuffer();
  return Buffer.from(bytes).toString("base64");
}
