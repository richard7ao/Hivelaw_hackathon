# CLAUDE.md — Lawhive Hackathon (Hivelaw): **The Steelman**

> **Purpose of this repo:** build, demo, and rehearse **The Steelman** — the legal
> agent that argues the opponent's best case *against you*. The source of truth for
> the plan is [`docs/steelman-plan.md`](./docs/steelman-plan.md) (status: APPROVED);
> this file is the fast-orientation summary. When the two disagree,
> `docs/steelman-plan.md` wins — update this file to match.
>
> **We are fully committed to the Steelman.** The prior plan (a damp-and-mould
> claim-accelerator, formerly in `brief.md`) was scrapped after an LLM council
> found it answered the wrong question — it always says "yes, here's your letter."
> `brief.md` has been deleted. Do not resurrect that plan.

## What this is

One sentence: *Every legal AI tells you you're right. We built the one that tells
you how you'll lose — because that's what protects you.*

A web app where a person with a consumer legal dispute in England pastes/uploads
their case file and gets back a **Case Reality Report** in three acts:

1. **Best case** — their single strongest position, in plain English (validate first).
2. **The Steelman** — the 2–4 strongest arguments the *other side* will make, each
   grounded in a **verbatim quote from the user's own documents**. The hero moment:
   the agent quoting your own evidence back at you as a weapon.
3. **The verdict** — prospects (strong/arguable/weak) + an actionable evidence-gap
   checklist + a recommendation (self-serve, escalate to a Lawhive solicitor *with
   the file*, or reconsider pursuing).

Why it's defensible as a demo: it's **impossible to fake** — a judge picks a case
folder and the agent argues against them live on documents nobody rehearsed — and
it turns the panel's own hardest insight ("the most valuable thing an agent can do
is sometimes talk someone out of a claim") into a memorable, visceral moment.

## Event context

- **Hackathon:** Lawhive HQ (WeWork, 145 City Road), Hoxton, London — **30 May 2026**.
- **Track:** A (Open Brief) — a recalibration agent spanning every case type, with
  B's "know your rights" question as its anchor.
- **Team:** 3 engineers (no lawyer). Stage roles: Opener + Driver + Closer.
- **Judges/sponsors:** Anthropic, Google Cloud, Gemini, Lovable, GV, Balderton, Lawhive.
- **Prizes:** £5,000 / £2,500 / £1,000.
- **Hackathon site:** https://hackathon.lhv.tools/ (access email: lsmwallfacer@gmail.com).

## The wedge (access-to-justice line)

Almost every consumer-legal AI validates the user. None of them show the user how
they will lose. That gap — between what you believe happened and what a judge will
need to see — is the single biggest source of friction at the start of any matter.
*The tool that tells you how you'll lose is the one that actually protects you.*

Steelmanning lives mostly in **evidence and procedure** (burden of proof, what a
judge needs to see, limitation periods, pre-action conduct) — domain-general and
far safer than confidently citing a 29-day-old statute. That deliberately sidesteps
the single-point-of-failure that sank the prior plan.

## GTM (Route 1 is built into the demo)

1. **Lawhive partnership** — be the honest intake/triage front door. Self-serve
   cases stay self-served; escalations go to Lawhive *with a prepared case file*.
   The honest "no" is a feature Lawhive *wants*: fewer dead-end intakes, lower
   cost-to-serve. Not a competitor — a moat extension.
2. **Advocacy orgs** — Shelter, Citizens Advice, Generation Rent, ACORN. Audience +
   trust; co-brand / white-label.
3. **Lettings agents / corporate landlords** — a clean, realistic pre-action posture
   is easier to handle than an angry email.

## Intended stack

- **Frontend:** Next.js + Tailwind on Vercel — chat UI + Case Reality Report viewer.
- **Backend:** Next.js API routes (Node) + Anthropic SDK. One repo, one deploy.
- **Models:** `claude-opus-4-8` for the three-act reasoning (configurable via
  `STEELMAN_MODEL`); effort `high` by default (`STEELMAN_EFFORT`).
- **Architecture (v1):** **single prompt, single completion, structured JSON output.**
  No tool loop, no orchestration framework, no retrieval — the cases are 2–6 KB and
  fit whole in context. Raw Anthropic API.
- **Stay all-Anthropic.** Ignore the GCP/Gemini nod — Anthropic is on the panel and
  the night before is not the time to add Vertex plumbing (team decision; accept the
  small ding).
- **Legal corpus (`/corpus`, BUILT — CEO-review scope addition):** real statute
  text pulled *verbatim* from legislation.gov.uk (no paraphrase), injected into the
  prompt. Housing only for the demo. Built: Housing Act 2004 ss.213–214 (deposit +
  s.214(4) 1–3× penalty), Landlord and Tenant Act 1985 s.11 (repairing covenant),
  LTA 1985 s.9A (fitness for human habitation, via Homes (Fitness) Act 2018), and
  the Pre-Action Protocol for Housing Conditions Claims, each with a "typical outcome
  range" note. Every `legal_basis.source_quote` is string-matched against the corpus;
  unmatched citations are **stripped**. Named case-law precedent is **deferred to v2**
  (LLMs hallucinate case citations). Corpus is ~4.2k tokens (may engage prompt caching).

## v1 hard scope (build only this)

1. **Document ingestion FIRST** — accept arbitrary provided case files (markdown
   today; PDFs via simple text extraction), parse to text, feed to Claude. Must be
   robust, not hardcoded to one case. This IS judging criterion 2 ("a judge can
   interact with it").
2. The three-act agent: the keystone prompt (lives in `scripts/run-cases.ts`,
   mirrored in the eventual API route), single completion, structured JSON.
3. **Anti-hallucination guard (non-negotiable):** after the model returns,
   string-match every `source_quote` against the ingested case text. Steelman quote
   not found → flag ⚠. Legal-citation quote not found in the corpus → **strip it
   entirely** (a wrong statute is worse than no statute). The whole credibility claim
   is "it quotes your own evidence" — a fabricated quote inverts the demo live.
4. Case Reality Report view: render the JSON cleanly. The evidence-gap checklist is
   the hero artifact. The recommendation renders as **verdict-conditional Next Steps**
   (strong→self-serve · arguable→escalate-to-Lawhive *with the prepared file* ·
   weak→honest-no) — the access-to-justice close made literal. HTML on localhost.
5. Live-pick flow: dropdown of **only validated (engineer hand-checked) cases** + optional file-upload
   fallback (runs, but carries no soundness guarantee).
6. **Pre-cache the JSON for every validated case;** render from cache live (responses
   are real, just pre-generated), with the live API as the "run it fresh?" backup.

**v1 is NOT** PDF export, 3D/spatial, multi-agent, an agentic tool loop, vision on
evidence photos, auth, a DB, **a numeric £/time/outcome estimator (ungroundable — it
inverts the trust mechanic; explicitly CUT, see `docs/decisions/2026-05-30-feature-scope.md`),
or live case-law matching (the 6 verified precedent PDFs in `cases/reference/` are a
deferred stretch — cached + hand-verified summaries only, never in the 3-min spine)**.
v1 ingests **text only** (both hero beats are text-grounded). Cut anything off the
critical path.

## Agent design (v1)

- Identity: an honest **case-assessment assistant** for England consumer legal
  disputes, **not a solicitor**. Shows the truth — including how the other side
  attacks — before the user spends time/money they can't get back.
- Output schema (JSON): `best_case` · `opponent_steelman: [{argument, source_quote}]`
  · `evidence_gaps[]` · `prospects: strong|arguable|weak` · `recommendation:
  self-serve|escalate-to-solicitor|reconsider-pursuing`. With the corpus, steelman
  points and the verdict also carry `legal_basis: [{citation, source_quote}]`.
- **Hard rules:** work ONLY from the case file; never invent facts, statutes, or
  quotes; every `source_quote` must appear verbatim in the file; cite statute ONLY
  from the corpus (else say "no corpus provision applies"); when unsure, say so.

## Demo spine (3-minute slot, 3 speakers — HARD constraint)

**Canonical script + screen contract: `PITCH.md` (repo root).** Format is locked as a
**pre-recorded screen capture with live stage voice-over by all three engineers** —
the table below is the skeleton; PITCH.md wins for exact wording, timing, and the
beat-by-beat build contract. One pre-loaded case, one hero beat, ~1 min each. Featured
case: **Case 07 (Crystal, damp)** — the signed *"I confirm that the above works have
been carried out to my satisfaction"* form is the killer steelman quote.

| Time | Speaker | Says / shows |
|---|---|---|
| 0:00–0:40 | **Opener** | Cold open + category argument. Pulls up Crystal's case. |
| 0:40–1:50 | **Driver** | Act 1 strongest case (~10s) → **Act 2 the Steelman: agent quotes her own signed satisfaction form back at her** (~40s, the moment) → Act 3 the Case Reality Report renders. |
| 1:50–3:00 | **Closer** | Trust mechanic ("we're engineers, not lawyers — the agent can't claim what it can't ground") + the honest "no" as a feature Lawhive wants + the live app as the dare ("pick any case and check the quotes") + access-to-justice close. |

The team has **no lawyer**, so the credibility moat is not "our lawyer validates
live" but (1) the **verifiable trust mechanic** (every quote string-matched to the
file, citations only from a closed corpus, ungrounded claims stripped) and (2) the
**live app** judges can pick any case in afterwards. Nobody on stage claims to be a
lawyer. Renders from pre-cached real responses (instant, deterministic). **If the slot
is ~5 min:** add a genuinely weak case as a 30-second "honest no" contrast and
optionally re-introduce judge-picks-from-dropdown. Rehearse the 3-min core either way.

## Working norms for Claude in this repo

1. One task at a time; the build plan in `docs/steelman-plan.md` is the unit.
2. **Ask before scope-expanding** — surface, don't silently expand.
3. Be honest about what doesn't work (redesign early beats discovering late).
4. Optimise for the team *learning the stack*, not code elegance — v1 is throwaway.
   Comments > DRY.
5. **Flag every legal-correctness assumption explicitly** — the team has no lawyer,
   so keep featured claims in evidence/procedure and never assert "this is the law."
6. Keep the corpus real — actual statute text, not paraphrase.

## Current state

- **Approved plan:** `docs/steelman-plan.md`. Old plan (`brief.md`) deleted.
- **Working:** batch runner `scripts/run-cases.ts` (`npm run cases`) sends every
  file in `/cases` (10 synthetic cases) through the three-act prompt and writes a
  per-case report to `/reports` plus `/reports/INDEX.md`. This is the artifact the
  engineers self-review (grounding + plausibility, NOT legal sign-off) to decide which
  cases are demo-safe.
- **Reports generated:** all 10 cases ran clean; Case 07 → arguable / escalate.
- **Legal corpus + citation guard:** BUILT in `scripts/run-cases.ts` (`legal_basis`
  in the schema, corpus injected, ungrounded citations stripped). Not yet verified on
  a live API run — confirm the model populates `legal_basis` and the strip-guard fires.
- **Not built yet:** the Next.js chat UI + Case Reality Report viewer, the live-pick
  dropdown, and the pre-cached render path.
- **Scope decision (2026-05-30, `docs/decisions/2026-05-30-feature-scope.md`):**
  Feature 3 (verdict-conditional Next Steps) is IN core; the numeric estimator is CUT
  (ungroundable, inverts trust); similar-cases matching is CUT this build (stretch only).
- **Next likely actions:** verify the corpus/citation guard on a real run; scaffold the
  Next.js app + report viewer with the verdict-conditional Next Steps block; lock +
  rehearse the 3-minute script; record the master demo video.
