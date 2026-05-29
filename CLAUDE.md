# CLAUDE.md — Lawhive Hackathon (Hivelaw)

> **Purpose of this repo right now:** research & brainstorm context. There is no
> production code yet. The source of truth for the plan is [`brief.md`](./brief.md);
> this file is the fast-orientation summary. When `brief.md` and this file
> disagree, `brief.md` wins — update this file to match.

## What this is

A web app where a **renter** describes a disrepair problem (scoped to **damp &
mould**) in plain English, uploads photo evidence, and gets back:

1. A legally-grounded explanation of their rights (citation-backed, no invented law).
2. Sendable pre-action documents (pre-action protocol letter + environmental
   health complaint), downloadable as PDF.
3. A clean handoff to a **Lawhive solicitor** with a pre-prepared case file when
   the case warrants it.

One sentence: *Lawhive in your pocket for renters facing disrepair.*

## Event context

- **Hackathon:** Lawhive HQ, Hoxton, London — **30 May 2026**.
- **Track:** B (Know Your Rights) — renters' rights, anchored on disrepair (damp & mould).
- **Team:** Thinker + Engineer + Lawyer.
- **Judges/sponsors:** Anthropic, Google Cloud, Gemini, Lovable, GV, Balderton, Lawhive.
- **Prizes:** £5,000 / £2,500 / £1,000.
- **Hackathon site:** https://hackathon.lhv.tools/ (access email: lsmwallfacer@gmail.com).

## Why now (the wedge)

- **Renters' Rights Act 2025 came into force 1 May 2026** — Section 21 (no-fault)
  evictions abolished, fixed-term ASTs gone, rent-in-advance capped, new pet
  rights, new rent-increase challenge via First-Tier Tribunal.
- Most LLMs were trained on pre-1-May corpora → **vanilla ChatGPT confidently
  cites Section 21 as if it still exists.** This stale-AI gap is the demo's foil.
- New Private Rented Sector Landlord Ombudsman doesn't go live until **2028** —
  a ~2-year window where renters have new rights but no infrastructure.

## Market facts (for pitch grounding — verify before quoting on stage)

- 6.2M private renters in England experienced disrepair last year (~3 in 4); half had damp/mould. (Shelter/YouGov)
- Shelter's disrepair pages hit every ~18 seconds.
- Citizens Advice: 200+ disrepair-related people/day; 1,829 disrepair cases in March 2026 (up from 1,666 YoY).
- Property Ombudsman: 58% complaint surge Nov 2025–Feb 2026 ("Renters' Rights effect").
- Half of complaints to landlords go unresolved; 47% of renters with issues never complained (mostly eviction fear).
- TAM framing: 6.2M × £500–£3,000 avg claim × 10–20% who'd act = multi-hundred-million-pound underserved market.

## GTM (lead with Route 1 — Lawhive is on the panel)

1. **Lawhive partnership** — be the intake/triage front door; self-serve cases
   stay self-served, escalations go to Lawhive *with a prepared case file*. 10x
   intake throughput, lower cost-to-serve. Not a competitor — a moat extension.
2. **Advocacy orgs** — Shelter, Citizens Advice, Generation Rent, ACORN, etc.
   They have audience + trust; co-brand / white-label.
3. **Lettings agents / corporate landlords** — sell to the side with money; a
   clean pre-action letter is easier to handle than an angry email. Most
   defensible long-term commercial path.

## Intended stack

- **Frontend:** Next.js + Tailwind on Vercel — chat UI + document viewer.
- **Backend:** Next.js API routes (Node) + Anthropic SDK. One repo, one deploy.
- **Models:**
  - `claude-opus-4-7` — reasoning + letter drafting (+ vision for defect photos).
  - `claude-haiku-4-5-20251001` — classification + extraction.
- **Legal corpus:** flat files in `/corpus`, loaded into context with **prompt
  caching enabled from day 1** ($5→$0.50/MTok cached). Pull *real* statute text
  from legislation.gov.uk — do not paraphrase.
  - Renters' Rights Act 2025 (relevant sections)
  - Landlord and Tenant Act 1985 ss.8–17
  - Homes (Fitness for Human Habitation) Act 2018
  - Housing Act 2004 Part 1 (HHSRS)
  - Pre-Action Protocol for Housing Conditions Claims
  - Defective Premises Act 1972 s.4
- **Doc output:** Markdown → rendered HTML preview + downloadable PDF.
- **3D/spatial (v2 only, smoke-test in v1):** Apple RoomPlan → USDZ →
  `usdzconvert` → GLB → `<model-viewer>`.

## v1 hard scope (build only this)

1. Single-page web app with chat interface.
2. Claude agent with **3 tools**: `classify_hazard`, `lookup_statute`, `draft_letter`.
3. Upload up to 3 photos; each → Claude vision → structured defect record.
4. Generate one pre-action protocol letter + one environmental health complaint.
5. Both downloadable as PDF.
6. Runs on localhost. No auth, no DB, no deploy.
7. **Damp & mould only.** Everything else → "not yet supported." Non-negotiable.

**v1 is NOT** the polished product or the judge-facing demo. **v1 IS** a scrappy
end-to-end thing proving we understand every component, plus a lawyer-validated
case file proving Route 1 GTM.

## Agent design (v1)

- Identity: legal *assistant* for England housing disrepair, **not a solicitor**.
  Gives grounded, citation-backed info; drafts pre-action docs; escalates when warranted.
- Loop: understand → analyse evidence → classify hazard → look up statute →
  draft docs → recommend next steps (incl. solicitor).
- **Hard rules:** never invent a statute (every claim cites the corpus); state
  low confidence honestly; letters follow pre-action protocol format exactly.
- **Escalate to solicitor when:** possession proceedings, vulnerable household,
  personal injury, or claim value > £10,000.
- Tool schemas live in `/agent/tools.ts`. No orchestration framework — raw Anthropic tool-use API.

## Demo spine (8 min, three wow moments, order matters)

1. **ChatGPT foil** — ask ChatGPT about a Section 21 notice; it cites dead law.
   (Credibility: stale AI can't be trusted here.)
2. **The letter** — a real, correctly-cited pre-action letter a housing
   solicitor would sign. (Substance: not advice, *correspondence*.)
3. **Spatial evidence** — 3D flat scan with AI-tagged defect pins. (Awe: the
   Twitter moment.) Then the Lawhive handoff (Route 1 GTM built into the demo).

Demo runs **locally**, assets pre-captured in `/demo-assets`, inputs rehearsed,
agent responses real but battle-tested. No live judge input, no Q&A mid-demo.

## Working norms for Claude in this repo

1. One task at a time; each day's task in `brief.md §4` is the unit.
2. **Ask before scope-expanding** — surface, don't silently expand.
3. Be honest about what doesn't work (redesign early beats discovering late).
4. Optimise for the team *learning the stack*, not code elegance — v1 is
   throwaway. Comments > DRY.
5. **Flag every legal-correctness assumption** so the lawyer can spot-check.
6. Keep the corpus real — actual statute text, not paraphrase.

## Current state

- Repo contains only `brief.md` and `README.md`. No code, corpus, or assets yet.
- Next likely actions: scaffold Next.js app, assemble `/corpus`, or sharpen pitch/demo.
