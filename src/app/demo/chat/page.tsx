import EntryChatShell from "@/components/demo/EntryChatShell";

// The entry chat is the real, Anthropic-backed intake (api/intake + lib/intake),
// with the live progress + evidence-request + report-scaffold sidebar.
// It replaces the earlier mock chat that used demo-context + MOCK_ASSISTANT_REPLY.
export default function ChatPage() {
  return <EntryChatShell />;
}
