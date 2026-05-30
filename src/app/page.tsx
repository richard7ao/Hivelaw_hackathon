import type { ReactNode } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Sponsors from "@/components/Sponsors";
import SteelmanLogo from "@/components/SteelmanLogo";

function Kicker({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
      <span className="h-1 w-1 rounded-full bg-accent" />
      {children}
    </span>
  );
}

function Cite({ n }: { n: number }) {
  return (
    <a href="#sources" className="text-accent/75 transition-colors hover:text-accent">
      <sup className="ml-0.5 text-[0.62em] font-semibold">{n}</sup>
    </a>
  );
}

const STATS = [
  { figure: "$1T", label: "global legal services market.", cite: 1 },
  { figure: "5.1B", label: "people worldwide have an unmet justice need.", cite: 2 },
  { figure: ">50%", label: "of people with a legal problem can't get help.", cite: 3 },
  { figure: "6M", label: "adults in England & Wales with unmet legal needs each year.", cite: 4 },
  { figure: "38%", label: "of UK adults with a civil issue got no help at all.", cite: 5 },
  { figure: "−46%", label: "drop in legal aid cases since LASPO. 44% of areas have no provider.", cite: 6 },
];

const THREE_ACTS = [
  {
    step: "01",
    title: "Your strongest case",
    body: "Validate first. The agent reads your entire case file and finds your single strongest position, in plain English.",
    color: "text-verdict-green",
  },
  {
    step: "02",
    title: "The Steelman",
    body: "The hero. The agent argues the other side's best case against you — quoting your own documents back at you as weapons. Every quote string-matched against the real file.",
    color: "text-accent",
  },
  {
    step: "03",
    title: "The Case Reality Report",
    body: "Prospects (strong / arguable / weak), an evidence-gap checklist, and an honest recommendation: handle it yourself, escalate to a solicitor, or reconsider pursuing.",
    color: "text-verdict-amber",
  },
];

const COMPARE = [
  { q: "Shows you how you'll lose", chatbot: false, chatbotNote: "always agrees", us: true, usNote: "argues against you" },
  { q: "Quotes your own evidence back at you", chatbot: false, chatbotNote: "generic advice", us: true, usNote: "verbatim, string-matched" },
  { q: "Tells you when you don't have a case", chatbot: false, chatbotNote: "always obliges", us: true, usNote: "honest recalibration" },
  { q: "Grounded in actual statute text", chatbot: false, chatbotNote: "hallucinates citations", us: true, usNote: "closed corpus, verified" },
  { q: "Produces an evidence-gap checklist", chatbot: false, chatbotNote: "vague next steps", us: true, usNote: "actionable, specific" },
];

const ROUTES = [
  {
    tag: "Route 1 · lead with this",
    title: "Lawhive's honest intake front door",
    body: "Fewer dead-end intakes, lower cost-to-serve. Self-serve cases stay self-served; escalations arrive with a prepared file. Not a competitor — a moat extension.",
    note: "\"Doesn't talking people out of claims kill leads?\" No. It kills the ones you lose money on, and sharpens the ones you don't.",
  },
  {
    tag: "Route 2",
    title: "Advocacy organisations",
    body: "Shelter, Citizens Advice, Generation Rent, ACORN. They have the audience and the trust; they don't have the engineering. Co-brand or white-label.",
    note: null,
  },
  {
    tag: "Route 3",
    title: "Lettings agents & corporate landlords",
    body: "A clean, well-formatted pre-action letter is easier to handle than a confused, angry email. Sell to the side with money.",
    note: null,
  },
];

const SOURCES = [
  { n: 1, who: "Grand View Research / IMARC", what: "Global Legal Services Market Report 2025." },
  { n: 2, who: "World Justice Project", what: "Measuring the Justice Gap (2019)." },
  { n: 3, who: "World Justice Project", what: "Global Insights on Access to Justice." },
  { n: 4, who: "Legal Services Board", what: "Legal Needs Survey 2024 (England & Wales)." },
  { n: 5, who: "Legal Services Board", what: "Legal Needs Survey 2024." },
  { n: 6, who: "Law Society", what: "LASPO Act impact data; Legal Aid Deserts, Feb 2024." },
];

export default function Home() {
  return (
    <>
      <Nav />

      {/* 1 — HERO */}
      <section className="snap relative flex min-h-dvh flex-col overflow-hidden pt-16">
        <div className="dot-grid dot-grid-fade absolute inset-0" aria-hidden />
        <div className="orbit-field" aria-hidden>
          <div className="orbit orbit-spin" style={{ width: 560, height: 560, "--orbit-dur": "30s" } as React.CSSProperties}>
            <span className="orbit-particle" />
          </div>
          <div className="orbit orbit-spin" style={{ width: 860, height: 860, "--orbit-dur": "44s", animationDirection: "reverse" } as React.CSSProperties}>
            <span className="orbit-particle" />
          </div>
          <div className="orbit" style={{ width: 1180, height: 1180 }} />
        </div>

        <div className="relative mx-auto w-full max-w-[88rem] px-6 pt-5">
          <Sponsors tone="light" className="border-b border-line pb-5" />
        </div>

        <div className="relative mx-auto w-full max-w-[88rem] px-6 pt-10 pb-4 text-center">
          <h2 className="font-serif text-2xl text-ink sm:text-3xl">Everyone has a right to good legal advice.</h2>
        </div>

        <div className="relative mx-auto grid w-full max-w-[88rem] grid-cols-1 items-center gap-12 px-6 pt-4 pb-24 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Kicker>Access to justice · for everyone</Kicker>
            <h1 className="mt-6 max-w-2xl text-5xl leading-[1.04] text-ink sm:text-6xl lg:text-[4.25rem]">
              Every legal AI tells you you're right.
              <br />
              <span className="italic text-accent">We tell you how you'll lose.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              The Steelman argues the opponent's best case against you — using your
              own documents — so you know where you really stand before you spend
              time and money you can't get back.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/demo"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-base font-medium text-paper transition-colors duration-200 hover:bg-accent-deep"
              >
                Try the demo
                <span aria-hidden>&rarr;</span>
              </Link>
              <a
                href="#how"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-line px-6 text-base font-medium text-ink transition-colors duration-200 hover:bg-canvas-deep"
              >
                See how it works
                <span aria-hidden>&darr;</span>
              </a>
            </div>
          </div>

          {/* Hero card — the Steelman quote punch */}
          <Reveal delay={120} className="lg:w-full lg:max-w-md lg:justify-self-end">
            <div className="rounded-2xl border border-line bg-paper p-6 shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_60px_-40px_rgba(40,20,20,0.45)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
                  The Steelman
                </span>
                <span className="font-serif text-sm text-ink-faint">Case 07</span>
              </div>
              <p className="mt-5 font-serif text-lg leading-snug text-ink">
                The council will argue Crystal waived her claim.
              </p>
              <div className="mt-4 rounded-lg border border-verdict-red/30 bg-verdict-red/5 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-verdict-red">
                  Your own document, used against you
                </p>
                <p className="mt-2 font-serif text-sm italic leading-relaxed text-ink">
                  &ldquo;I confirm that the above works have been carried out to my
                  satisfaction.&rdquo;
                </p>
                <p className="mt-2 text-xs text-ink-soft">
                  Source: contractor_works_form.pdf &middot; <span className="text-verdict-green">✓ verified</span>
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-ink-faint">
                <SteelmanLogo className="h-4 w-4 text-accent" />
                Every quote string-matched against the real file.
              </div>
            </div>
          </Reveal>
        </div>

        <a
          href="#problem"
          className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink sm:flex"
        >
          Scroll <span aria-hidden>&darr;</span>
        </a>
      </section>

      {/* 2 — THE PROBLEM */}
      <section id="problem" className="snap border-t border-line bg-canvas-deep">
        <div className="mx-auto max-w-[88rem] px-6 py-24 sm:py-28">
          <Reveal>
            <Kicker>The problem</Kicker>
            <h2 className="mt-5 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
              Five billion people can't get legal help. Not because they don't have a case.
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {STATS.map((s, i) => (
              <Reveal key={s.figure} delay={i * 60}>
                <div className="border-t border-line pt-5">
                  <p className="font-serif text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
                    {s.figure}
                  </p>
                  <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink-soft">
                    {s.label}
                    <Cite n={s.cite} />
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — THE GAP */}
      <section className="snap border-t border-line">
        <div className="mx-auto grid max-w-[88rem] grid-cols-1 gap-12 px-6 py-24 sm:py-28 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <Kicker>The gap</Kicker>
            <h2 className="mt-5 text-4xl leading-tight text-ink sm:text-5xl">
              Every tool on the market agrees with you. That's the problem.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="max-w-xl space-y-5 text-lg leading-relaxed text-ink-soft">
              <p>
                The gap between what you believe happened and what a judge needs
                to <em>see</em> is the single biggest source of friction at the
                start of any legal matter. Every AI chatbot widens that gap by
                telling you what you want to hear.
              </p>
              <p>
                The Steelman closes it. We don't discourage people — we arm
                them. Better to take the other side's hardest punch from us, in
                private, than from a judge when it's too late to fix.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 — HOW IT WORKS (Three Acts) */}
      <section id="how" className="snap border-t border-line bg-canvas-deep">
        <div className="mx-auto max-w-[88rem] px-6 py-24 sm:py-28">
          <Reveal>
            <Kicker>How it works</Kicker>
            <h2 className="mt-5 max-w-2xl text-4xl leading-tight text-ink sm:text-5xl">
              Three acts. One honest answer.
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            {THREE_ACTS.map((act, i) => (
              <Reveal key={act.step} delay={i * 100}>
                <div className="flex h-full flex-col bg-paper p-8">
                  <div className="flex items-baseline gap-3">
                    <span className={`font-serif text-sm ${act.color}`}>{act.step}</span>
                    <span className="h-px flex-1 bg-line-soft" />
                  </div>
                  <h3 className="mt-5 text-2xl text-ink">{act.title}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">
                    {act.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — THE FOIL (comparison) */}
      <section id="foil" className="snap border-t border-line">
        <div className="mx-auto max-w-[88rem] px-6 py-24 sm:py-28">
          <Reveal>
            <Kicker>The foil</Kicker>
            <h2 className="mt-5 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
              The AI they'll reach for is confidently wrong.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              ChatGPT told someone's mum she was right. It missed every
              counter-argument that would have sunk her case. In a regulated
              domain, helpful isn't the same as honest.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-paper">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-line">
                    <th className="px-5 py-4 text-sm font-medium text-ink-faint sm:px-7">Can it…</th>
                    <th className="px-5 py-4 text-sm font-medium text-ink-faint">AI chatbot</th>
                    <th className="px-5 py-4 text-sm font-semibold text-ink">Steelman</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row) => (
                    <tr key={row.q} className="border-b border-line-soft last:border-0">
                      <td className="px-5 py-4 text-[15px] leading-snug text-ink sm:px-7">{row.q}</td>
                      <td className="px-5 py-4 align-top">
                        <span className="flex items-center gap-2 text-ink-faint">
                          <span aria-hidden className="text-base">✕</span>
                          <span className="text-sm">{row.chatbotNote}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <span className="flex items-center gap-2 text-ink">
                          <span aria-hidden className="text-base text-verdict-green">✓</span>
                          <span className="text-sm">{row.usNote}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6 — THE TRUST MECHANIC */}
      <section id="trust" className="snap border-t border-line bg-ink text-canvas">
        <div className="mx-auto grid max-w-[88rem] grid-cols-1 gap-14 px-6 py-24 sm:py-28 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-canvas/55">
              <span className="h-1 w-1 rounded-full bg-accent" />
              The trust mechanic
            </span>
            <h2 className="mt-6 text-4xl leading-[1.1] text-canvas sm:text-5xl">
              We're three engineers — not lawyers.{" "}
              <span className="italic text-accent">That's exactly why we built it this way.</span>
            </h2>
            <div className="mt-7 max-w-xl space-y-5 text-lg leading-relaxed text-canvas/70">
              <p>
                Every quote is string-matched character-for-character against the
                user's real documents. If a quote isn't in the file, it never
                reaches the screen.
              </p>
              <p>
                Legal citations come only from a closed library of actual statute
                text we control. If the model can't find a basis there, it says
                so — it doesn't guess. A wrong statute is worse than no statute.
              </p>
              <p>
                The honest "no" is the most useful thing an agent can do. A wrong
                "yes" wastes a filing fee. A wrong "no" is worse — so when it's
                genuinely unsure, it routes to a human.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-canvas/15 bg-canvas/[0.04] p-6">
              <div className="flex gap-2">
                <span className="rounded-md border border-verdict-red/50 bg-verdict-red/15 px-2.5 py-1 text-xs font-semibold text-verdict-red">WEAK</span>
                <span className="rounded-md border border-canvas/15 px-2.5 py-1 text-xs font-medium text-canvas/45">ARGUABLE</span>
                <span className="rounded-md border border-canvas/15 px-2.5 py-1 text-xs font-medium text-canvas/45">STRONG</span>
              </div>
              <p className="mt-5 font-serif text-2xl leading-snug text-canvas">
                Not yet an actionable claim.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-canvas/70">
                <li className="flex gap-3 border-t border-canvas/10 pt-3">
                  <span aria-hidden className="text-accent">—</span>
                  The landlord was first told last week; they must get a reasonable chance to fix it.
                </li>
                <li className="flex gap-3 border-t border-canvas/10 pt-3">
                  <span aria-hidden className="text-accent">—</span>
                  No record yet of the report, the cause, or the damage.
                </li>
              </ul>
              <div className="mt-5 rounded-lg bg-canvas/[0.06] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-canvas/50">Do this instead</p>
                <p className="mt-2 text-sm text-canvas/80">
                  Report it in writing today, photograph the affected area, and come back in 14 days if nothing changes.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7 — GO TO MARKET */}
      <section id="gtm" className="snap border-t border-line bg-canvas-deep">
        <div className="mx-auto max-w-[88rem] px-6 py-24 sm:py-28">
          <Reveal>
            <Kicker>Go to market</Kicker>
            <h2 className="mt-5 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
              Built to make Lawhive's funnel sharper, not noisier.
            </h2>
          </Reveal>
          <div className="mt-12 space-y-4">
            {ROUTES.map((r, i) => (
              <Reveal key={r.title} delay={i * 80}>
                <div className="grid grid-cols-1 gap-5 rounded-2xl border border-line bg-paper p-7 sm:grid-cols-[0.4fr_1fr] sm:p-8">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-accent">{r.tag}</span>
                    <h3 className="mt-3 text-2xl leading-snug text-ink">{r.title}</h3>
                  </div>
                  <div>
                    <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft">{r.body}</p>
                    {r.note && (
                      <p className="mt-4 max-w-2xl border-t border-line-soft pt-4 text-sm italic leading-relaxed text-ink">{r.note}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8 — SOURCES */}
      <section id="sources" className="snap border-t border-line">
        <div className="mx-auto grid max-w-[88rem] grid-cols-1 gap-12 px-6 py-24 sm:py-28 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <Kicker>Data sources</Kicker>
            <h2 className="mt-5 text-4xl leading-tight text-ink sm:text-5xl">
              Every claim, sourced.
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-soft">
              Verify before quoting on stage. All figures below are from the
              cited source directly.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
                Figures on this page
              </p>
              <ol className="mt-4 space-y-3">
                {SOURCES.map((s) => (
                  <li key={s.n} className="flex gap-3 border-t border-line-soft pt-3 text-[15px] leading-snug">
                    <span className="font-serif text-accent">{s.n}</span>
                    <span className="text-ink">
                      <span className="font-medium">{s.who}.</span>{" "}
                      <span className="text-ink-soft">{s.what}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 9 — FINAL CTA + FOOTER */}
      <section className="snap relative overflow-hidden border-t border-line bg-ink text-canvas">
        <div className="dot-grid dot-grid-fade absolute inset-0 opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-6 py-28 text-center sm:py-32">
          <Reveal>
            <SteelmanLogo className="mx-auto h-16 w-16 text-accent" />
            <h2 className="mt-6 text-4xl leading-[1.08] text-canvas sm:text-6xl">
              The tool that tells you how you'll lose is the one that finally gives
              people a fair shot.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-canvas/65">
              Everyone has a right to know where they stand. Pick any case and
              watch it argue against you.
            </p>
            <Link
              href="/demo"
              className="mt-10 inline-flex h-13 items-center gap-2 rounded-full bg-accent px-7 text-base font-medium text-paper transition-colors duration-200 hover:bg-accent-deep"
            >
              Try the demo
              <span aria-hidden>&rarr;</span>
            </Link>
          </Reveal>
        </div>

        <footer className="relative border-t border-canvas/10">
          <div className="mx-auto max-w-[88rem] px-6 py-10">
            <Sponsors tone="dark" className="border-b border-canvas/10 pb-8" />
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <SteelmanLogo className="h-5 w-5 text-accent" />
                <span className="font-serif text-lg font-semibold text-canvas">Steelman</span>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-canvas/45">
                Built for the Lawhive hackathon, Hoxton, 30 May 2026.
                Steelman is a legal-assessment assistant, not a solicitor: it
                gives information, not advice.
              </p>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
}
