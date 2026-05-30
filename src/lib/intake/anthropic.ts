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

  for (const [index, file] of files.entries()) {
    const attachment = attachments[index];

    if (!attachment) continue;

    if (attachment.kind === "pdf-document") {
      contentBlocks.push({
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: await fileToBase64(file),
        },
      });
      continue;
    }

    if (attachment.kind === "image-evidence") {
      contentBlocks.push({
        type: "image",
        source: {
          type: "base64",
          media_type: attachment.mimeType,
          data: await fileToBase64(file),
        },
      });
      continue;
    }

    if (attachment.kind === "text-source" && attachment.textContent) {
      contentBlocks.push({
        type: "text",
        text: `Attachment: ${attachment.name}\n${attachment.textContent}`,
      });
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
    model: process.env.STEELMAN_INTAKE_MODEL ?? "claude-sonnet-4-5",
    max_tokens: 4096,
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

  return normalizeIntakeResult(parsed, "anthropic");
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
