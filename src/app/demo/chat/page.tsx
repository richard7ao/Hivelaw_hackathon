"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoContext } from "@/lib/demo-context";
import { MOCK_ASSISTANT_REPLY } from "@/lib/demo-data";

export default function EntryChat() {
  const router = useRouter();
  const { messages, addMessage, addFile, addUserFile } = useDemoContext();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const chatFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isTyping) return;
    addMessage({ role: "user", content: text });
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      addMessage({ role: "assistant", content: MOCK_ASSISTANT_REPLY });
      setIsTyping(false);
      setShowContinue(true);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((f) => {
      addFile({ name: f.name, size: `${(f.size / 1024).toFixed(0)} KB` });
      const url = URL.createObjectURL(f);
      const type = f.type.startsWith("image/") ? "image" as const : f.type === "application/pdf" ? "pdf" as const : "other" as const;
      addUserFile({ name: f.name, url, type });
      addMessage({ role: "user", content: `[Uploaded: ${f.name}]` });
    });
    e.target.value = "";
    setIsTyping(true);
    setTimeout(() => {
      addMessage({ role: "assistant", content: "Thank you for uploading that document. I'll include it in the case assessment. Do you have any other evidence to share, or shall I proceed with the analysis?" });
      setIsTyping(false);
      setShowContinue(true);
    }, 1200);
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] max-w-3xl flex-col px-4">
      {/* Thread */}
      <div ref={threadRef} className="flex-1 overflow-y-auto py-8">
        {messages.length === 0 && !isTyping && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
              <span className="h-1 w-1 rounded-full bg-accent" />
              Case assessment
            </span>
            <h1 className="mt-4 max-w-md text-3xl leading-snug text-ink sm:text-4xl">
              Describe your legal issue
            </h1>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft">
              Tell us what happened, in plain English. Upload documents and evidence to strengthen your case.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-[15px] leading-relaxed ${msg.role === "user" ? "bg-accent text-paper" : "border border-line bg-paper text-ink"}`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl border border-line bg-paper px-5 py-3">
                <span className="h-2 w-2 animate-pulse rounded-full bg-ink-faint" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-ink-faint [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-ink-faint [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>

        {showContinue && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.push("/demo/report")}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent-deep"
            >
              View case report
              <span aria-hidden>&rarr;</span>
            </button>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-line py-4">
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.02),0_8px_20px_-12px_rgba(40,20,20,0.25)]">
          <button onClick={() => chatFileRef.current?.click()} className="rounded-lg p-1 text-ink-faint transition-colors hover:text-ink" title="Upload document">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
          </button>
          <input ref={chatFileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.gif,.webp" className="hidden" onChange={handleFileUpload} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe your issue or upload evidence..."
            className="flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-paper transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink-faint"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
