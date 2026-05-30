import { NextResponse } from "next/server";

import { getCasesManifest } from "@/lib/cases/manifest";
import { runAnthropicIntake } from "@/lib/intake/anthropic";
import { mapFormFileToAttachment } from "@/lib/intake/files";
import { runLocalIntakeDemo } from "@/lib/intake/fallback";
import type { IntakeMessageInput } from "@/lib/intake/types";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const rawMessages = formData.get("messages");
    const messages = parseMessages(rawMessages);
    const files = formData.getAll("files").filter((value): value is File => value instanceof File);
    const attachments = await Promise.all(files.map(mapFormFileToAttachment));
    const cases = await getCasesManifest();
    const forceEvaluate = formData.get("forceEvaluate") === "true";

    const anthropicResult = await runAnthropicIntake(
      files,
      attachments,
      messages,
      cases,
      forceEvaluate,
    );

    if (anthropicResult) {
      return NextResponse.json(anthropicResult);
    }

    return NextResponse.json(runLocalIntakeDemo(messages, attachments, cases, forceEvaluate));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown intake error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function parseMessages(rawMessages: FormDataEntryValue | null): IntakeMessageInput[] {
  if (typeof rawMessages !== "string") {
    return [];
  }

  const parsed = JSON.parse(rawMessages) as IntakeMessageInput[];

  return parsed.filter(
    (message) =>
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string",
  );
}
