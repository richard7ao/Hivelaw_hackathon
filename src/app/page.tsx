import type { ReactNode } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Sponsors from "@/components/Sponsors";

/*
  Hivelaw landing — pitch deck as a single scroll.
  Source of narrative: brief.md (§0 pitch, §8 slides). Visual lane: background-agents.com.

  LEGAL / FACTUAL CLAIMS TO SPOT-CHECK (flagged for the lawyer per project norms):
  - Renters' Rights Act 2025 in force 1 May 2026; Section 21 abolished. (why-now, foil)
  - PRS Landlord Ombudsman live 2028. (why-now)
  - Market stats (6.2M, ~3 in 4, half damp/mould, every 18s, 200+/day, 58%, 47%)
    are from brief.md and attributed on-page to Shelter/YouGov, Citizens Advice,
    Property Ombudsman. brief.md says "verify before quoting on stage."
*/

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
  { figure: "6.2M", label: "private renters in England hit by disrepair last year, around three in four.", cite: 1 },
  { figure: "1 in 2", label: "of those renters had damp and mould specifically.", cite: 1 },
  { figure: "18 sec", label: "between visits to Shelter’s online disrepair pages.", cite: 1 },
  { figure: "200+", label: "disrepair cases a day reaching Citizens Advice.", cite: 2 },
  { figure: "58%", label: "surge in Property Ombudsman complaints, Nov 2025–Feb 2026.", cite: 3 },
  { figure: "47%", label: "of renters with problems never complained, mostly fearing eviction.", cite: 4 },
];

const COMPARE = [
  { q: "Knows Section 21 was abolished on 1 May 2026", chatbot: false, chatbotNote: "cites dead law", us: true, usNote: "pinned to current statute" },
  { q: "Shows a source for every legal claim", chatbot: false, chatbotNote: "no citations", us: true, usNote: "footnoted to the corpus" },
  { q: "Tells you when you do not have a case", chatbot: false, chatbotNote: "always obliges", us: true, usNote: "honest recalibration" },
  { q: "Produces a protocol-compliant letter", chatbot: false, chatbotNote: "generic advice", us: true, usNote: "a letter a solicitor would sign" },
  { q: "Honest about its own scope", chatbot: false, chatbotNote: "guesses anything", us: true, usNote: "damp & mould, or “not yet”" },
];

const PIPELINE = [
  { step: "01", title: "Describe", body: "The problem, in plain English. No legal vocabulary required." },
  { step: "02", title: "Share", body: "Tenancy agreement, the landlord email chain, up to 3 photos." },
  { step: "03", title: "Assess", body: "A prospects verdict first: RED, AMBER or GREEN, with reasons." },
  { step: "04", title: "Ground", body: "Hazard classified to HHSRS; statute cited, visibly." },
  { step: "05", title: "Prepare", body: "Pre-action letter and complaint, or the honest no." },
  { step: "06", title: "Hand off", body: "To a Lawhive solicitor, case file ready, weak points flagged." },
];

const ROUTES = [
  {
    tag: "Route 1 · lead with this",
    title: "Lawhive’s honest intake front door",
    body: "We raise intake throughput and the quality of what reaches a solicitor. Self-serve stays self-served, weak cases are told the truth, strong cases escalate with a prepared file. The value is qualified volume, not maximum volume.",
    note: "“Doesn’t talking people out of claims kill leads?” No. It kills the ones you lose money on, and sharpens the ones you don’t.",
  },
  {
    tag: "Route 2",
    title: "Distribution through advocacy orgs",
    body: "Shelter, Citizens Advice, Generation Rent, ACORN. They have the audience and the trust; they don’t have the engineering. Co-brand or white-label.",
    note: null,
  },
  {
    tag: "Route 3",
    title: "Lettings agents and corporate landlords",
    body: "Sell to the side with money. A clean, well-formatted pre-action letter is easier to handle than a confused, angry email. The most defensible path long-term.",
    note: null,
  },
];

const SOURCES = [
  { n: 1, who: "Shelter / YouGov", what: "English private renters and disrepair (2025)." },
  { n: 2, who: "Citizens Advice", what: "Disrepair and housing casework (2026)." },
  { n: 3, who: "The Property Ombudsman", what: "Complaints data, Nov 2025–Feb 2026." },
  { n: 4, who: "Shelter", what: "Renters’ experiences of reporting disrepair (2025)." },
];

const CORPUS = [
  "Renters’ Rights Act 2025 (relevant sections)",
  "Landlord and Tenant Act 1985, ss. 8–17",
  "Homes (Fitness for Human Habitation) Act 2018",
  "Housing Act 2004, Part 1 (HHSRS)",
  "Pre-Action Protocol for Housing Conditions Claims",
  "Defective Premises Act 1972, s. 4",
];

export default function Home() {
  return (
    <>
      <Nav />

      {/* 1 — HERO ------------------------------------------------------------ */}
      <section className="snap relative flex min-h-dvh flex-col overflow-hidden pt-16">
        <div className="dot-grid dot-grid-fade absolute inset-0" aria-hidden />
        <div className="orbit-field" aria-hidden>
          <div
            className="orbit orbit-spin"
            style={{ width: 560, height: 560, "--orbit-dur": "30s" } as React.CSSProperties}
          >
            <span className="orbit-particle" />
          </div>
          <div
            className="orbit orbit-spin"
            style={
              {
                width: 860,
                height: 860,
                "--orbit-dur": "44s",
                animationDirection: "reverse",
              } as React.CSSProperties
            }
          >
            <span className="orbit-particle" />
          </div>
          <div className="orbit" style={{ width: 1180, height: 1180 }} />
        </div>

        <div className="relative mx-auto w-full max-w-[88rem] px-6 pt-5">
          <Sponsors tone="light" className="border-b border-line pb-5" />
        </div>

        <div className="relative mx-auto grid w-full max-w-[88rem] grid-cols-1 items-center gap-12 px-6 pt-12 pb-24 lg:grid-cols-[1.15fr_0.85fr] lg:pt-16">
          <div>
            <Kicker>Know your rights · disrepair (damp &amp; mould)</Kicker>
            <h1 className="mt-6 max-w-2xl text-5xl leading-[1.04] text-ink sm:text-6xl lg:text-[4.25rem]">
              The truth about your case.
              <br />
              <span className="italic text-accent">Before</span> you fight for it.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              Hivelaw reads a renter’s evidence, grounds every answer in current
              law, and says where they really stand. It prepares the letter when
              it’s worth sending, and saves them the year when it isn’t.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/demo"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-base font-medium text-paper transition-colors duration-200 hover:bg-accent-deep"
              >
                Use the demo
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

          {/* Prospects-verdict preview card (mirrors the reference's hero card) */}
          <Reveal delay={120} className="lg:w-full lg:max-w-md lg:justify-self-end">
            <div className="rounded-2xl border border-line bg-paper p-6 shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_60px_-40px_rgba(40,20,20,0.45)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
                  Prospects assessment
                </span>
                <span className="font-serif text-sm text-ink-faint">case 02</span>
              </div>
              <div className="mt-5 flex gap-2">
                <span className="rounded-md border border-line px-2.5 py-1 text-xs font-medium text-ink-faint">RED</span>
                <span className="rounded-md border border-line px-2.5 py-1 text-xs font-medium text-ink-faint">AMBER</span>
                <span className="rounded-md border border-verdict-green/40 bg-verdict-green/10 px-2.5 py-1 text-xs font-semibold text-verdict-green">
                  GREEN
                </span>
              </div>
              <p className="mt-5 font-serif text-2xl leading-snug text-ink">
                A real claim, worth acting on.
              </p>
              <dl className="mt-5 space-y-2.5 text-sm">
                <div className="flex justify-between gap-4 border-t border-line-soft pt-2.5">
                  <dt className="text-ink-faint">Defect</dt>
                  <dd className="text-right text-ink">Damp &amp; mould, bedroom</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-line-soft pt-2.5">
                  <dt className="text-ink-faint">Hazard</dt>
                  <dd className="text-right text-ink">HHSRS Category 1</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-line-soft pt-2.5">
                  <dt className="text-ink-faint">Reported</dt>
                  <dd className="text-right text-ink">3 times since January</dd>
                </div>
              </dl>
              <div className="mt-5 flex items-center gap-2 border-t border-line-soft pt-4 text-xs text-ink-faint">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Grounded in 3 statutory sources, each visible to the renter.
              </div>
            </div>
          </Reveal>
        </div>

        <a
          href="#problem"
          className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.2em] text-ink-faint transition-colors hover:text-ink sm:flex"
        >
          Scroll
          <span aria-hidden>&darr;</span>
        </a>
      </section>

      {/* 2 — PROBLEM --------------------------------------------------------- */}
      <section id="problem" className="snap border-t border-line bg-canvas-deep">
        <div className="mx-auto max-w-[88rem] px-6 py-24 sm:py-28">
          <Reveal>
            <Kicker>The problem</Kicker>
            <h2 className="mt-5 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
              Six million renters. A system that was never built for them.
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

      {/* 3 — WHY NOW --------------------------------------------------------- */}
      <section id="why" className="snap border-t border-line">
        <div className="mx-auto grid max-w-[88rem] grid-cols-1 gap-12 px-6 py-24 sm:py-28 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <Kicker>Why now</Kicker>
            <h2 className="mt-5 text-4xl leading-tight text-ink sm:text-5xl">
              The law changed on 1 May. The tools didn’t.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="max-w-xl space-y-5 text-lg leading-relaxed text-ink-soft">
              <p>
                The Renters’ Rights Act 2025 came into force on 1 May 2026.
                Section 21 no-fault evictions: abolished. Fixed-term tenancies:
                gone. Rent in advance: capped. New routes to challenge a rent
                rise. Renters hold more cards than they have in a generation.
              </p>
              <p>
                The eviction fear that kept nearly half of them silent has just
                collapsed. But the new Private Rented Sector Landlord Ombudsman
                doesn’t arrive until 2028. That leaves a two-year window where
                renters have new rights and no new infrastructure to use them.
              </p>
              <div className="mt-8 flex items-stretch gap-4 rounded-xl border border-line bg-paper p-5">
                <div className="flex-1">
                  <p className="font-serif text-2xl text-ink">1 May 2026</p>
                  <p className="mt-1 text-sm text-ink-soft">New rights land.</p>
                </div>
                <div className="flex flex-col items-center justify-center px-2 text-center">
                  <span className="text-xs uppercase tracking-[0.16em] text-accent">
                    You are here
                  </span>
                  <span className="mt-1 h-px w-16 bg-line sm:w-24" />
                </div>
                <div className="flex-1 text-right">
                  <p className="font-serif text-2xl text-ink-faint">2028</p>
                  <p className="mt-1 text-sm text-ink-soft">Ombudsman goes live.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 — STALE-AI FOIL --------------------------------------------------- */}
      <section id="foil" className="snap border-t border-line bg-canvas-deep">
        <div className="mx-auto max-w-[88rem] px-6 py-24 sm:py-28">
          <Reveal>
            <Kicker>The foil</Kicker>
            <h2 className="mt-5 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
              The AI they’ll reach for is confidently wrong.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Most models were trained before 1 May 2026. Ask one about a Section
              21 notice and it cites a law that no longer exists. In a regulated
              domain, stale isn’t a quirk. It’s malpractice.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-paper">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-line">
                    <th className="px-5 py-4 text-sm font-medium text-ink-faint sm:px-7">
                      In a regulated domain, can it…
                    </th>
                    <th className="px-5 py-4 text-sm font-medium text-ink-faint">
                      Vanilla AI chatbot
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold text-ink">
                      Hivelaw
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row) => (
                    <tr key={row.q} className="border-b border-line-soft last:border-0">
                      <td className="px-5 py-4 text-[15px] leading-snug text-ink sm:px-7">
                        {row.q}
                      </td>
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

      {/* 5 — HOW IT WORKS ---------------------------------------------------- */}
      <section id="how" className="snap border-t border-line">
        <div className="mx-auto max-w-[88rem] px-6 py-24 sm:py-28">
          <Reveal>
            <Kicker>How it works</Kicker>
            <h2 className="mt-5 max-w-2xl text-4xl leading-tight text-ink sm:text-5xl">
              Evidence in. An honest answer out.
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {PIPELINE.map((p, i) => (
              <Reveal key={p.step} delay={i * 70}>
                <div className="flex h-full flex-col bg-paper p-7">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-sm text-accent">{p.step}</span>
                    <span className="h-px flex-1 bg-line-soft" />
                  </div>
                  <h3 className="mt-4 text-2xl text-ink">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-8 text-sm text-ink-faint">
              Four tools, raw Anthropic tool-use, no orchestration framework:{" "}
              <span className="text-ink-soft">assess_prospects</span>,{" "}
              <span className="text-ink-soft">classify_hazard</span>,{" "}
              <span className="text-ink-soft">lookup_statute</span>,{" "}
              <span className="text-ink-soft">draft_letter</span>.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 6 — THE HONEST NO --------------------------------------------------- */}
      <section id="verdict" className="snap border-t border-line bg-ink text-canvas">
        <div className="mx-auto grid max-w-[88rem] grid-cols-1 gap-14 px-6 py-24 sm:py-28 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-canvas/55">
              <span className="h-1 w-1 rounded-full bg-accent" />
              The hard part
            </span>
            <h2 className="mt-6 text-4xl leading-[1.1] text-canvas sm:text-5xl">
              The most useful thing it can do is tell you to{" "}
              <span className="italic text-accent">stand down</span>.
            </h2>
            <div className="mt-7 max-w-xl space-y-5 text-lg leading-relaxed text-canvas/70">
              <p>
                Lawhive’s own brief says the first conversation isn’t legal
                analysis, it’s recalibration. So Hivelaw is built to return RED:
                not an actionable claim. With reasons. With citations. With the
                cheaper, faster step to take instead.
              </p>
              <p>
                A wrong “yes” wastes a filing fee. A wrong “no” is worse, so when
                it’s genuinely unsure, it routes to a human. It never quietly
                turns a real claim away.
              </p>
            </div>
          </Reveal>

          {/* RED verdict example — verdict colours read as a system, not brand */}
          <Reveal delay={120}>
            <div className="rounded-2xl border border-canvas/15 bg-canvas/[0.04] p-6">
              <div className="flex gap-2">
                <span className="rounded-md border border-verdict-red/50 bg-verdict-red/15 px-2.5 py-1 text-xs font-semibold text-verdict-red">
                  RED
                </span>
                <span className="rounded-md border border-canvas/15 px-2.5 py-1 text-xs font-medium text-canvas/45">AMBER</span>
                <span className="rounded-md border border-canvas/15 px-2.5 py-1 text-xs font-medium text-canvas/45">GREEN</span>
              </div>
              <p className="mt-5 font-serif text-2xl leading-snug text-canvas">
                Not yet an actionable claim.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-canvas/70">
                <li className="flex gap-3 border-t border-canvas/10 pt-3">
                  <span aria-hidden className="text-accent">—</span>
                  The landlord was first told last week; they must get a
                  reasonable chance to fix it.
                </li>
                <li className="flex gap-3 border-t border-canvas/10 pt-3">
                  <span aria-hidden className="text-accent">—</span>
                  No record yet of the report, the cause, or the damage.
                </li>
              </ul>
              <div className="mt-5 rounded-lg bg-canvas/[0.06] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-canvas/50">
                  Do this instead
                </p>
                <p className="mt-2 text-sm text-canvas/80">
                  Report it in writing today, photograph the affected wall, and
                  come back in 14 days if nothing changes.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7 — THE LETTER ------------------------------------------------------ */}
      <section id="letter" className="snap border-t border-line">
        <div className="mx-auto grid max-w-[88rem] grid-cols-1 gap-12 px-6 py-24 sm:py-28 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <Kicker>The artefact</Kicker>
            <h2 className="mt-5 text-4xl leading-tight text-ink sm:text-5xl">
              Not advice. Correspondence a solicitor would sign.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
              When the case is real, Hivelaw drafts a pre-action protocol letter
              and a pre-filled environmental-health complaint. Every legal claim
              is footnoted to its source, formatted to the protocol exactly, and
              downloadable as PDF.
            </p>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-faint">
              Citizens Advice gives advice. Hivelaw produces the sendable
              document, with the weak points already flagged for the renter.
            </p>
          </Reveal>

          {/* Letter mock with a margin "sources" rail */}
          <Reveal delay={120}>
            <div className="rounded-2xl border border-line bg-paper p-7 shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_60px_-44px_rgba(40,20,20,0.4)] sm:p-9">
              <div className="flex items-center justify-between border-b border-line-soft pb-4">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
                  Letter before action
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-tint px-3 py-1 text-xs font-medium text-accent">
                  PDF ready
                </span>
              </div>
              <div className="mt-5 space-y-3.5 font-serif text-[15px] leading-relaxed text-ink">
                <p className="text-ink-soft">Dear Sir or Madam,</p>
                <p>
                  Re: disrepair at 12 Ardwick Court. We write before action under
                  the Pre-Action Protocol for Housing Conditions Claims.
                  <span className="align-super text-[0.62em] font-semibold text-accent">1</span>
                </p>
                <p>
                  The property suffers persistent damp and mould, a Category 1
                  hazard under the HHSRS.
                  <span className="align-super text-[0.62em] font-semibold text-accent">2</span>{" "}
                  You are obliged to keep it fit for human habitation
                  <span className="align-super text-[0.62em] font-semibold text-accent">3</span>{" "}
                  and to repair the structure under ss. 11–14.
                  <span className="align-super text-[0.62em] font-semibold text-accent">4</span>
                </p>
                <p className="text-ink-soft">
                  We require a written response within 20 working days …
                </p>
              </div>
              <div className="mt-6 border-t border-line-soft pt-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
                  Sources cited in this letter
                </p>
                <ol className="mt-3 space-y-1.5 text-xs text-ink-soft">
                  <li>1 · Pre-Action Protocol for Housing Conditions Claims</li>
                  <li>2 · Housing Act 2004, Part 1 (HHSRS)</li>
                  <li>3 · Homes (Fitness for Human Habitation) Act 2018</li>
                  <li>4 · Landlord and Tenant Act 1985, ss. 11–14</li>
                </ol>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8 — GO TO MARKET ---------------------------------------------------- */}
      <section id="gtm" className="snap border-t border-line bg-canvas-deep">
        <div className="mx-auto max-w-[88rem] px-6 py-24 sm:py-28">
          <Reveal>
            <Kicker>Go to market</Kicker>
            <h2 className="mt-5 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
              Built to make Lawhive’s funnel sharper, not noisier.
            </h2>
          </Reveal>
          <div className="mt-12 space-y-4">
            {ROUTES.map((r, i) => (
              <Reveal key={r.title} delay={i * 80}>
                <div className="grid grid-cols-1 gap-5 rounded-2xl border border-line bg-paper p-7 sm:grid-cols-[0.4fr_1fr] sm:p-8">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
                      {r.tag}
                    </span>
                    <h3 className="mt-3 text-2xl leading-snug text-ink">
                      {r.title}
                    </h3>
                  </div>
                  <div>
                    <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft">
                      {r.body}
                    </p>
                    {r.note && (
                      <p className="mt-4 max-w-2xl border-t border-line-soft pt-4 text-sm italic leading-relaxed text-ink">
                        {r.note}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9 — SOURCES --------------------------------------------------------- */}
      <section id="sources" className="snap border-t border-line">
        <div className="mx-auto grid max-w-[88rem] grid-cols-1 gap-12 px-6 py-24 sm:py-28 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <Kicker>Every claim, sourced</Kicker>
            <h2 className="mt-5 text-4xl leading-tight text-ink sm:text-5xl">
              The corpus.
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-soft">
              Statute is loaded verbatim from legislation.gov.uk, never
              paraphrased. The agent cannot make a legal claim without pointing
              to one of these.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
                  Legal corpus
                </p>
                <ul className="mt-4 space-y-3">
                  {CORPUS.map((c) => (
                    <li
                      key={c}
                      className="border-t border-line-soft pt-3 text-[15px] leading-snug text-ink"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
                  Figures on this page
                </p>
                <ol className="mt-4 space-y-3">
                  {SOURCES.map((s) => (
                    <li
                      key={s.n}
                      className="flex gap-3 border-t border-line-soft pt-3 text-[15px] leading-snug"
                    >
                      <span className="font-serif text-accent">{s.n}</span>
                      <span className="text-ink">
                        <span className="font-medium">{s.who}.</span>{" "}
                        <span className="text-ink-soft">{s.what}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 10 — FINAL CTA + FOOTER -------------------------------------------- */}
      <section className="snap relative overflow-hidden border-t border-line bg-ink text-canvas">
        <div className="dot-grid dot-grid-fade absolute inset-0 opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-6 py-28 text-center sm:py-32">
          <Reveal>
            <h2 className="text-4xl leading-[1.08] text-canvas sm:text-6xl">
              See it tell the truth about a real case.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-canvas/65">
              Two real scenarios. One it prepares and escalates. One it honestly
              turns away. You decide which to run.
            </p>
            <Link
              href="/demo"
              className="mt-10 inline-flex h-13 items-center gap-2 rounded-full bg-accent px-7 text-base font-medium text-paper transition-colors duration-200 hover:bg-accent-deep"
            >
              Use the demo
              <span aria-hidden>&rarr;</span>
            </Link>
          </Reveal>
        </div>

        <footer className="relative border-t border-canvas/10">
          <div className="mx-auto max-w-[88rem] px-6 py-10">
            <Sponsors tone="dark" className="border-b border-canvas/10 pb-8" />
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <span className="block h-2.5 w-2.5 rounded-[2px] bg-accent" />
                <span className="font-serif text-lg font-semibold text-canvas">
                  Hivelaw
                </span>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-canvas/45">
                A concept built for the Lawhive hackathon, Hoxton, 30 May 2026
                (Track B). Hivelaw is a legal assistant, not a solicitor: it
                gives information, not advice.
              </p>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
}
