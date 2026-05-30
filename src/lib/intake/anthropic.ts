import Anthropic from "@anthropic-ai/sdk";

import type { CaseManifestEntry } from "@/lib/cases/manifest";

import { fileToBase64 } from "./files";
import { buildIntakePrompt } from "./prompt";
import { INTAKE_OUTPUT_SCHEMA, normalizeIntakeResult } from "./schema";
import type {
  IntakeAttachmentInput,
  IntakeMessageInput,
  IntakeTurnResult,
} from "./types";

export async function runAnthropicIntake(
  files: File[],
  attachments: IntakeAttachmentInput[],
  messages: IntakeMessageInput[],
  cases: CaseManifestEntry[],
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
    model: process.env.HIVELAW_INTAKE_MODEL ?? "claude-sonnet-4-5",
    max_tokens: 2200,
    system: buildIntakePrompt(cases, conversation),
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

  return normalizeIntakeResult(
    JSON.parse(textBlock.text) as Partial<IntakeTurnResult>,
    "anthropic",
  );
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
