import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Sponsors from "@/components/Sponsors";

export const metadata: Metadata = {
  title: "Hivelaw: the live agent",
  description:
    "The live Hivelaw prospects-assessment agent. Launching at the Lawhive hackathon, Hoxton, 30 May 2026.",
};

/**
 * Demo stub. The live agent (chat + tools + corpus) is a separate build; this
 * page is the wired destination for the landing-page CTA so the button is never
 * dead, and it is ready to swap the disabled console for the real chat.
 */
export default function DemoPage() {
  return (
    <>
      <Nav />
      <main className="dot-grid relative flex min-h-dvh flex-col items-center justify-center px-6 py-28 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Live agent
        </span>

        <h1 className="mt-6 max-w-2xl text-balance text-5xl font-medium leading-[1.05] text-ink sm:text-6xl">
          The agent lives here.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          We are wiring the live prospects assessment in: evidence ingestion, the
          RED / AMBER / GREEN verdict, and a protocol-compliant letter, every
          claim cited. It goes live at Lawhive HQ, Hoxton, on 30 May 2026.
        </p>

        {/* Disabled console mock — the shape the real chat will fill. */}
        <div className="mt-12 w-full max-w-xl">
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-5 py-4 text-left shadow-[0_1px_0_rgba(0,0,0,0.02),0_18px_40px_-28px_rgba(40,20,20,0.35)]">
            <span className="flex-1 text-[15px] text-ink-faint">
              Describe your damp &amp; mould problem in plain English…
            </span>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex h-9 cursor-not-allowed items-center gap-1.5 rounded-full bg-ink/15 px-4 text-sm font-medium text-ink-faint"
            >
              Send
            </button>
          </div>
          <p className="mt-3 text-xs text-ink-faint">
            Damp &amp; mould only for v1. Everything else returns an honest
            &ldquo;not yet supported.&rdquo;
          </p>
        </div>

        <Link
          href="/"
          className="mt-14 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
        >
          <span aria-hidden>&larr;</span>
          Back to the overview
        </Link>

        <div className="mt-16 w-full max-w-[88rem] border-t border-line px-6 pt-8">
          <Sponsors tone="light" className="justify-center" />
        </div>
      </main>
    </>
  );
}
