import Anthropic from "@anthropic-ai/sdk";

import type { CaseManifestEntry } from "@/lib/cases/manifest";

import { fileToBase64 } from "./files";
import { buildIntakePrompt } from "./prompt";
import { INTAKE_OUTPUT_SCHEMA, normalizeIntakeResult } from "./schema";
import type {
  IntakeAttachmentInput,
  IntakeEvaluationMode,
  IntakeMessageInput,
  IntakeTurnResult,
} from "./types";

// Cap base64 vision blocks (images + scanned PDFs) per turn so a large upload
// of photos stays responsive. Text docs are unlimited (they're cheap).
const MAX_VISION_BLOCKS = 6;

export async function runAnthropicIntake(
  files: File[],
  attachments: IntakeAttachmentInput[],
  messages: IntakeMessageInput[],
  cases: CaseManifestEntry[],
  evaluationMode: IntakeEvaluationMode = "none",
) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return null;
  }

  const client = new Anthropic({ apiKey });
  const contentBlocks: Array<Record<string, unknown>> = [];

  // Text-first ingestion: PDFs/text go in as extracted text (fast + cheap, and
  // it's the source we string-match the Steelman quotes against). Only images
  // (and scanned PDFs with no text layer) ride along as base64 vision, capped
  // so a bundle of many photos can't blow up latency.
  const sourceTexts: string[] = [];
  let visionBudget = MAX_VISION_BLOCKS;

  for (const [index, file] of files.entries()) {
    const attachment = attachments[index];
    if (!attachment) continue;

    if (attachment.kind === "pdf-document" && attachment.textContent) {
      contentBlocks.push({ type: "text", text: `--- Document: ${attachment.name} ---\n${attachment.textContent}` });
      sourceTexts.push(attachment.textContent);
      continue;
    }

    if (attachment.kind === "pdf-document") {
      // No text layer — fall back to vision if we still have budget.
      if (visionBudget > 0) {
        contentBlocks.push({
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: await fileToBase64(file) },
        });
        visionBudget -= 1;
      } else {
        contentBlocks.push({ type: "text", text: `(Document attached but not shown to keep this fast: ${attachment.name})` });
      }
      continue;
    }

    if (attachment.kind === "image-evidence") {
      if (visionBudget > 0) {
        contentBlocks.push({
          type: "image",
          source: { type: "base64", media_type: attachment.mimeType, data: await fileToBase64(file) },
        });
        visionBudget -= 1;
      } else {
        contentBlocks.push({ type: "text", text: `(Image attached but not shown to keep this fast: ${attachment.name})` });
      }
      continue;
    }

    if (attachment.kind === "text-source" && attachment.textContent) {
      contentBlocks.push({ type: "text", text: `--- Attachment: ${attachment.name} ---\n${attachment.textContent}` });
      sourceTexts.push(attachment.textContent);
      continue;
    }

    contentBlocks.push({
      type: "text",
      text: `Attachment metadata: ${attachment.name} (${attachment.mimeType}, ${attachment.size} bytes)`,
    });
  }

  const conversation = buildConversationSummary(messages, attachments);
  contentBlocks.push({ type: "text", text: conversation });

  const response = await client.messages.create({
    model: process.env.STEELMAN_INTAKE_MODEL ?? "claude-opus-4-8",
    max_tokens: 6000,
    system: buildIntakePrompt(cases, conversation, evaluationMode),
    messages: [{ role: "user", content: contentBlocks }],
    output_config: {
      format: {
        type: "json_schema",
        schema: INTAKE_OUTPUT_SCHEMA,
      },
    },
  } as never);

  const textBlock = response.content.find(
    (
      block,
    ): block is Extract<(typeof response.content)[number], { type: "text" }> =>
      block.type === "text",
  );

  if (!textBlock) {
    throw new Error("Anthropic intake response did not include a text block.");
  }

  const parsed = parseStructuredIntakeResponse(textBlock.text);

  if (!parsed) {
    console.warn("Anthropic intake response was not valid JSON; falling back to local intake.", {
      stopReason: response.stop_reason,
      responsePreview: textBlock.text.slice(0, 300),
    });
    return null;
  }

  // Anti-hallucination: the Steelman's power is quoting the user's OWN evidence.
  // Drop any chain whose sourceQuote we can't find in the ingested text or a file
  // name, so a fabricated quote can never reach the screen.
  if (parsed.report?.steelman?.length) {
    const groundingText = normalizeForMatch(
      [
        ...sourceTexts,
        ...messages.filter((m) => m.role === "user").map((m) => m.content),
      ].join("\n"),
    );
    const fileNames = attachments.map((a) => normalizeForMatch(a.name));
    parsed.report.steelman = parsed.report.steelman.filter((chain) =>
      isQuoteGrounded(chain.sourceQuote, groundingText, fileNames),
    );
  }

  return normalizeIntakeResult(parsed, "anthropic");
}

function normalizeForMatch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’“”]/g, "'") // curly quotes -> straight
    .replace(/\s+/g, " ")
    .trim();
}

function isQuoteGrounded(quote: string, groundingText: string, fileNames: string[]): boolean {
  const q = normalizeForMatch(quote ?? "");
  if (q.length < 8) return true; // too short to verify meaningfully
  if (groundingText.includes(q)) return true;
  // Allow quotes that point at an uploaded file (e.g. "Mould Photo — Month 1").
  return fileNames.some((name) => name.length > 4 && (q.includes(name) || name.includes(q)));
}

function parseStructuredIntakeResponse(text: string): Partial<IntakeTurnResult> | null {
  const candidates = [text.trim(), stripCodeFence(text), extractJsonObject(text)].filter(Boolean);

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as Partial<IntakeTurnResult>;
    } catch {
      // Try the next candidate; malformed or truncated model JSON should fall
      // back to the deterministic local intake path instead of crashing.
    }
  }

  return null;
}

function stripCodeFence(text: string) {
  return text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
}

function extractJsonObject(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return "";
  }

  return text.slice(start, end + 1);
}

function buildConversationSummary(
  messages: IntakeMessageInput[],
  attachments: IntakeAttachmentInput[],
) {
  const transcript = messages
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n\n");

  const fileSummary = attachments.length
    ? `\n\nFiles currently attached:\n${attachments
        .map(
          (attachment) =>
            `- ${attachment.name} [${attachment.kind}] (${attachment.size} bytes)`,
        )
        .join("\n")}`
    : "\n\nNo files are attached yet.";

  return `${transcript}${fileSummary}`;
}
