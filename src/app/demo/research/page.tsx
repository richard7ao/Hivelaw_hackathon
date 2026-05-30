"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoContext } from "@/lib/demo-context";

const RELEVANCE_STYLE = {
  high: "border-verdict-green/40 bg-verdict-green/10 text-verdict-green",
  moderate: "border-verdict-amber/40 bg-verdict-amber/10 text-verdict-amber",
  low: "border-line bg-canvas-deep text-ink-faint",
} as const;

export default function ResearchPage() {
  const router = useRouter();
  const { messages, addMessage, researchItems, toggleResearch } = useDemoContext();
  const [input, setInput] = useState("");

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    addMessage({ role: "user", content: text });
    setInput("");
    setTimeout(() => {
      addMessage({
        role: "assistant",
        content:
          "I've updated the research results based on your additional context. The provisions below remain the most relevant to your situation.",
      });
    }, 800);
  };

  const selectedCount = researchItems.filter((r) => r.selected).length;

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] max-w-6xl flex-col px-4 lg:flex-row lg:gap-8">
      {/* Chat thread */}
      <div className="flex flex-1 flex-col border-b border-line pb-4 lg:border-b-0 lg:border-r lg:pr-8 lg:pb-0">
        <div className="flex-1 overflow-y-auto py-6">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
            <span className="h-1 w-1 rounded-full bg-accent" />
            Conversation
          </span>
          <div className="mt-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent text-paper"
                      : "border border-line bg-paper text-ink"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-line pt-4">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-paper px-3 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask a follow-up question..."
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-paper transition-colors hover:bg-accent-deep disabled:bg-ink/15 disabled:text-ink-faint"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Research results */}
      <div className="flex flex-1 flex-col py-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
            <span className="h-1 w-1 rounded-full bg-accent" />
            Research results
          </span>
          {selectedCount > 0 && (
            <span className="text-xs text-ink-soft">
              {selectedCount} selected
            </span>
          )}
        </div>

        <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
          {researchItems.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleResearch(item.id)}
              className={`group flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                item.selected
                  ? "border-accent/40 bg-accent-tint"
                  : "border-line bg-paper hover:border-line-soft hover:bg-canvas-deep"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  item.selected
                    ? "border-accent bg-accent"
                    : "border-ink-faint/40"
                }`}
              >
                {item.selected && (
                  <svg className="h-3 w-3 text-paper" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <div className="flex-1">
                <p className="text-sm leading-relaxed text-ink">{item.snippet}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-xs font-medium ${RELEVANCE_STYLE[item.relevance]}`}
                  >
                    {item.relevance}
                  </span>
                  <span className="text-xs text-ink-faint">{item.source}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 border-t border-line pt-4">
          <button
            onClick={() => router.push("/demo/report")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent-deep"
          >
            Continue to report
            <span aria-hidden>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
