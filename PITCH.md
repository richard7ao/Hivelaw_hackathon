# PITCH.md — The Steelman

> **Source of truth for the pitch.** Rewritten 30 May 2026 to match the app as it
> actually exists. If the app and this file disagree on *what the demo must show*,
> this file wins; `docs/steelman-plan.md` (APPROVED) wins for build scope.
>
> **Format (locked):** 3:00 hard ceiling. Delivered as a **pre-recorded screen-capture
> video** of the app running one damp-and-mould case, with **all three teammates
> voicing over it live on stage.** The video removes every live-failure mode (network,
> API latency, mis-clicks). The live voices carry the close; the live app is the proof
> judges can pick any case afterwards and check the quotes against the documents.
> Rehearse to a stopwatch; record one clean master video as the metronome.
>
> **We are three engineers — not lawyers.** Nobody on stage claims to be one. Our
> credibility is structural, not personal: every quote is matched against the user's
> real file, every legal point comes from a closed verbatim statute corpus, and
> anything we can't ground we don't say. In a room of real lawyers, that's the only
> safe version.

---

## ⚠️ Reconcile-before-stage (read first)

Decision: **fix the pitch, not the app** (the judges liked the app). This pitch is
already written to match the app. Three residual gaps remain — only one needs an app
edit; the other two are a recording choice and a known mismatch you accept.

1. **(Unavoidable, one-line app edit) The architecture claim on the landing page is
   false.** `src/app/page.tsx` advertises *"Four tools, raw Anthropic tool-use …
   assess_prospects, classify_hazard, lookup_statute, draft_letter."* **None of those
   tools exist in code.** The real engine (`scripts/run-cases.ts:295`) is a **single
   `messages.create` call with structured JSON output** (`json_schema`), adaptive
   thinking, and a prompt-cached corpus — no tool loop. This is the one place you can't
   pitch around: Anthropic is on the panel, the false claim is *on screen*, and "show me
   the tool calls" has no answer. Change the copy to "a single grounded completion."
   This pitch describes the real architecture.
2. **(Recording choice, no code) The demo UI is mock data, not grounded output.**
   `/demo` renders `src/lib/demo-data.ts`, not real Claude output. The credibility claim
   — *"every quote is string-matched to your real documents"* — is **true of the
   batch-runner output** (`reports/*.report.html`), not the mock. So **record the video
   from the grounded report**, not the mock UI. Don't weaken the claim to fit the mock;
   record the thing that backs the claim.
3. **(Accepted mismatch) Brand: the app says "Hivelaw" in the body/footer; we pitch as
   "The Steelman."** Decision is to keep **The Steelman** as the product name and not
   re-skin the app. Be aware the recorded video may show "Hivelaw" on screen while the
   voice says "The Steelman" — either tidy the few "Hivelaw" strings, or don't linger on
   them in frame.

(Also confirm with organizers: footer says **Track B**; the old plan said Track A.)

---

## 1. Elevator pitch (one line)

**Every legal AI tells you you're right. The most useful thing one can do is tell you
the truth — including when to stand down. We built the one that does.**

---

## 2. Paragraph pitch (~30 seconds)

Half of everyone who faces a legal problem can't get help — not because they don't
have a case, but because they can't afford to find out where they stand. Every
consumer-legal AI fills that gap by agreeing with you. The Steelman doesn't. You
describe your problem and share your evidence; it gives you an honest verdict first —
**RED, AMBER, or GREEN** — then grounds every word in current statute. When the case
is real, it drafts a **pre-action letter a solicitor would sign**, footnoted to the
law, downloadable as a PDF. When it isn't, it says so, with reasons and the cheaper
step to take instead. And in the moment that matters most, it argues the *other side's*
best case against you — quoting your own documents back at you as a weapon — so you take
the hardest punch from us, in private, instead of from a judge when it's too late. The
honest "no" is a feature Lawhive *wants*: fewer dead-end intakes, lower cost-to-serve,
and warm escalations that arrive with the evidence already mapped.

---

## 3. Full pitch

### 3.1 The category argument (why we exist)

Legal services is a **$1 trillion** global market. **5.1 billion people** have an unmet
justice need. More than half of everyone facing a legal problem can't get help — the
system doesn't reach them. The gap between what you *believe* happened and what a judge
needs to *see* is the single biggest source of friction at the start of any matter.
Every tool on the market widens that gap by validating you.

**Lawhive's own brief says the first conversation isn't legal analysis — it's
recalibration.** So that's what we built. The most useful thing a legal AI can do is
tell you the truth about where you stand, and sometimes that truth is "not yet" or
"not this way." We don't discourage people. We arm them: validate the strong parts,
expose the weak ones while they can still be fixed, and route the real cases forward
with their evidence in order.

### 3.2 Why now (the urgency)

**The law changed on 1 May 2026.** The Renters' Rights Act 2025 came into force:
Section 21 no-fault evictions abolished, fixed-term tenancies gone, rent-in-advance
capped, new routes to challenge a rent rise. The eviction fear that kept nearly half of
renters silent has collapsed — but the new Private Rented Sector Ombudsman doesn't
arrive until 2028. That's a **two-year window** where renters have new rights and no new
infrastructure to use them. And the AI they'll reach for was trained before 1 May: ask
it about a Section 21 notice and it cites a law that no longer exists. In a regulated
domain, stale isn't a quirk — it's malpractice. The Steelman is pinned to current
statute and shows a source for every claim.

### 3.3 The product

An honest case-assessment assistant for England consumer disputes — **not a solicitor.**
Evidence in, an honest answer out:

1. **Describe & share** — the problem in plain English; the tenancy agreement, the
   landlord email chain, photos. No legal vocabulary required.
2. **Assess** — a prospects verdict *first*: **RED / AMBER / GREEN**, with reasons.
3. **Ground** — the hazard classified (HHSRS), the statute cited, visibly. Every legal
   claim is footnoted to a closed, verbatim corpus pulled from legislation.gov.uk.
4. **The Steelman** — the signature feature: the 2–4 strongest arguments the *other
   side* will make, each as a chain — their argument → **a verbatim quote from your own
   documents** → the strongest honest reply → why it stays contested, not won.
5. **Prepare** — when the case is real, a **pre-action protocol letter + a pre-filled
   environmental-health complaint**, footnoted to statute, downloadable as PDF:
   correspondence a solicitor would sign. When it isn't, the honest no.
6. **Hand off** — to a matched Lawhive solicitor, case file ready, weak points flagged.

**The report** the user gets is four tabs: **Overview** (arguments for /
counterarguments / summary, plus the verdict and recommendation), **Documents**,
**References** (each statute with full text and how it applies), and **The Steelman**
(the chain-of-argument view).

### 3.4 Trust mechanic (say this out loud in the demo)

Every quote the agent attributes to your evidence is **string-matched
character-for-character** against your real documents. If a quote isn't in the file, it
never reaches the screen. Every legal citation is matched against the closed corpus; a
citation that isn't in the corpus is **stripped** — a wrong statute is worse than no
statute. The whole credibility claim is "it grounds everything," so a fabricated quote
is the one thing we will not allow.

### 3.5 The featured case

**Damp & mould — 12 Ardwick Court.** Persistent damp and mould in the bedroom and
bathroom since January 2026; the landlord notified in writing three times; no
meaningful inspection or repair. A strong story — until the gut-punch: after earlier
remedial works, the tenant signed a contractor's form. The Steelman finds the exact line
and quotes it back — **"I confirm that the above works have been carried out to my
satisfaction"** — and explains it's now the landlord's first line of defence, in the
tenant's own signature. Verdict: **AMBER — arguable.** Recommendation: escalate to a
solicitor *with the prepared file*, but get an independent damp survey first. Honest
recalibration in action: it validates the case, then hands you the exact moves that turn
an arguable position into a winning one.

---

## 4. The 3:00 demo — video storyboard + live voice-over script

**How to read this:** the **VIDEO** column is the recorded screen capture (the build
target). The **VOICE (live)** column is what the named speaker says on stage, timed to
land with the video. All three speak. 3:00 is a hard ceiling — cut any word that isn't
load-bearing.

### Beat 1 — Cold open + the honest-no thesis (0:00–0:35) · THINKER

- **VIDEO:** Title card ("The Steelman"), then the case dashboard; the damp-and-mould
  case at 12 Ardwick Court is selected and the case file opens.
- **VOICE (Thinker):**
  > "Half the people who face a legal problem can't get help — not because they don't
  > have a case, but because they can't afford to find out where they stand. Every legal
  > AI fills that gap by telling them they're right. We built the opposite. The most
  > useful thing a legal AI can do is tell you the truth — including when to stand down.
  > This is a damp-and-mould case: eight months, a sick child, fifteen ignored emails.
  > Watch it stay honest."

### Beat 2 — Grounded assessment + the Steelman punch (0:35–1:55) · ENGINEER

- **VIDEO:** The app renders the report. Overview verdict badge appears
  (**🟡 AMBER — arguable**) with reasons → References tab shows a statute footnoted to
  source → the **Steelman tab** opens with the hero chain expanded: the landlord's
  argument, then the signed-form quote **visibly highlighted and tied to its source
  document** with a ✅ grounded marker, then the honest reply.
- **VOICE (Engineer):**
  > "First, the honest verdict — amber, arguable, with reasons. Then it grounds every
  > point in current statute: section 11, the fitness act, the HHSRS — each footnoted to
  > the actual text, not a paraphrase.
  >
  > Then the part no other tool does. **The Steelman.** It argues the landlord's *best
  > case against the tenant*, using the tenant's own documents. Here's the punch: after
  > earlier works, the tenant signed a form. The agent pulls the exact line and quotes
  > it back — *'I confirm that the above works have been carried out to my
  > satisfaction.'* That's the landlord's whole opening defence, in the tenant's own
  > signature. And every quote on this screen is checked character-for-character against
  > the real file — if it isn't in the documents, it never reaches the screen."

### Beat 3 — The artefact + access-to-justice close (1:55–3:00) · CLOSER

- **VIDEO:** The report's recommendation → the **pre-action letter** rendering, sources
  footnoted, the **PDF-ready** badge → matched solicitor card. Soft close card at the end.
- **VOICE (Closer):**
  > "When the case is real, it doesn't stop at advice — it produces the document.
  > A pre-action letter a solicitor would sign, every claim footnoted to the law,
  > downloadable as a PDF, with the weak points already flagged. And we're three
  > engineers, not lawyers — that's exactly why it works this way. Every quote is matched
  > to the real file; every point of law comes from a closed library of actual statute;
  > anything it can't ground, it doesn't say.
  >
  > The honest 'no' is a feature Lawhive *wants* — fewer dead-end intakes, and when a
  > case should escalate, the solicitor gets a prepared file with the gaps mapped. This
  > isn't a sizzle reel: the app is running right now. Pick any case and check the
  > quotes yourself. Everyone has a right to know where they stand. The tool that tells
  > you the truth — including how you'll lose — is the one that finally gives people a
  > fair shot. That's access to justice. Thank you."

**Timing note:** ~300 words (~3:00 at a measured pace). Rehearse 10× to a stopwatch.
The video is the metronome — speakers sync to it, not vice versa.

---

## 5. Build contract — what the recorded video MUST show

The engineer's spec. Record once, clean, to exactly this. **The video must render
GROUNDED output** (real batch-runner report or `/demo` wired to the pre-cached real
JSON) — not the current `demo-data.ts` mock. See the reconcile note at the top.

- [ ] **Brand reads "The Steelman" everywhere on screen** (fix the "Hivelaw" footer/body
      before recording).
- [ ] **Case dashboard / picker** showing the damp-and-mould case (12 Ardwick Court),
      selected; the case file opens.
- [ ] **Overview verdict** renders a prospects badge (**🟡 AMBER**) with reasons and a
      recommendation (**escalate-to-solicitor**).
- [ ] **References tab** shows at least one statute footnoted to source (full text +
      how it applies).
- [ ] **The Steelman tab** opens with the hero chain expanded: the landlord's argument →
      the `source_quote` *"I confirm that the above works have been carried out to my
      satisfaction"* **visually highlighted and tied to its source document** with a ✅
      grounded indicator → the honest reply → the "contested, not won" note.
- [ ] **The pre-action letter** renders with footnoted sources and a **PDF-ready** state
      (the artefact beat).
- [ ] A **reveal cadence** between beats so the Steelman lands as its own moment, not a
      wall of text.
- [ ] Reads cleanly at projector resolution: large type, the quote legible from the back.
- [ ] Renders **instantly and deterministically** from the pre-cached real response
      (live API is the off-stage "run it fresh?" backup only).

---

## 6. Why we win (map to judging criteria)

- **Real problem, real complexity.** Consumer housing disrepair with the actual
  procedural traps — Pre-Action Protocol, burden of proof, HHSRS hazard classification,
  a signed-away defence. Not a toy. Timely, too: the Renters' Rights Act just landed.
- **A judge can interact with it / impossible to fake.** The agent argues against a real
  person using documents nobody scripted; the trust mechanic (verbatim quote matching) is
  demonstrable. The app is live — a judge can pick any case after the pitch and check
  every quote against the source. The recording is the timed pitch; the running app is
  the standing dare.
- **Technical substance.** Robust arbitrary-document ingestion (markdown + PDF text
  extraction) → a single structured completion (`json_schema`, adaptive thinking,
  prompt-cached corpus) → an anti-hallucination guard that flags ungrounded quotes and
  strips ungrounded citations. Stayed all-Anthropic on purpose (panel signal, zero
  night-before plumbing risk).
- **Access to justice — backed by numbers.** $1 trillion market, 5.1 billion people with
  unmet justice needs, 6.2M English renters hit by disrepair last year. The Steelman
  gives everyone the honest first assessment that used to require a solicitor, and the
  honest "no" turns dead-end intakes into prepared, warm escalations.

---

## 7. The close (the line to land on)

> "Everyone has a right to know where they stand. Every other tool tells people they're
> right. The tool that tells you the truth — including how you'll lose — is the one that
> finally gives people a fair shot."

---

## 8. The personal beat (optional — read the room)

> Drop this in if the room feels receptive. Works best in Beat 1 (Thinker, after the
> "half the people" line) or Beat 3 (Closer, before the close). Pick one spot, not both.
> If the energy is formal or time is tight, skip it — the pitch stands without it.

**Thinker version:**

> "My mum is one of them. She typed her legal problems into ChatGPT. It told her she was
> right. It missed every counter-argument that mattered."

**Closer version:**

> "One of us watched his mum type her legal problems into ChatGPT. It told her she was
> right. It missed every counter-argument that would have sunk her case."

---

## 9. GTM (one slide / one breath if asked)

1. **Lawhive partnership (lead with this)** — the honest intake/triage front door.
   Self-serve cases stay self-served; weak cases hear the truth; strong cases escalate
   with a prepared file. The value is *qualified* volume, not maximum volume. Not a
   competitor — a moat extension. Fewer dead-end intakes, lower cost-to-serve.
2. **Advocacy orgs** — Shelter, Citizens Advice, Generation Rent, ACORN. They have the
   audience and the trust; they don't have the engineering. Co-brand / white-label.
3. **Lettings agents / corporate landlords** — sell to the side with money. A clean,
   well-formatted pre-action letter is cheaper to handle than a confused, angry email.

---

## 10. Objection handling (Q&A prep)

- **"Isn't this just discouraging people from getting justice?"** The opposite. We
  validate the strongest case *first*, then show the gap so it can be closed. The path
  is to *winning*. The honest "no" only fires when pursuing would cost someone time and
  money they can't get back — and a wrong "no" routes to a human rather than quietly
  turning a real claim away.
- **"How do you stop it hallucinating quotes or law?"** Every quote attributed to the
  user's evidence is string-matched against their file; unmatched quotes are flagged or
  stripped. Legal citations come only from a closed, verbatim statute corpus we control
  (Renters' Rights Act 2025, Housing Act 2004 Part 1 / HHSRS, LTA 1985 ss.8–17, Homes
  (Fitness) Act 2018, the Pre-Action Protocol, Defective Premises Act 1972 s.4). A
  citation not in the corpus is stripped. Named case-law is deferred to v2 (LLMs
  hallucinate case citations).
- **"What's your architecture?"** One structured Anthropic completion per case
  (`json_schema` output, adaptive thinking, a prompt-cached statute corpus) — no
  orchestration framework. The case files fit whole in context. Document ingestion +
  the grounding guard are the engineering, not a tool loop. *(If you ship the four-tool
  version, update this answer and the landing page to match.)*
- **"Is this legal advice / are you a solicitor?"** No. It's an honest case-assessment
  assistant that gives information, not advice, and points to a solicitor when one is
  needed. The recommendation path makes that explicit.
- **"You're three engineers — how do you know the legal reasoning is sound?"** We
  designed it so soundness doesn't depend on us being lawyers. It works in evidence and
  procedure (burden of proof, what a judge needs to see, pre-action conduct) — far safer
  than free-reciting statute. Quotes are grounded in the user's file; citations come only
  from a closed corpus; anything ungrounded is stripped. We position as triage that routes
  to a real solicitor. We'd genuinely value a Lawhive lawyer pressure-testing the
  outputs — that's the v2 loop.
- **"What about non-housing cases?"** The agent runs on any case file; the corpus
  currently covers housing only, and non-housing cases say "no corpus provision applies"
  rather than inventing one. The demo features housing; the architecture generalises.
- **"Why not Gemini / Vertex given the sponsors?"** Deliberate. All-Anthropic keeps a
  single completion simple and adds zero plumbing risk the night before. We accept the
  small ding for a sharper core.

---

## 11. Production checklist (pre-stage)

- [ ] **Reconcile the three gaps at the top of this file** (architecture claim, brand,
      mock-vs-grounded) before recording.
- [ ] App renders the damp case from cache exactly per the §5 build contract.
- [ ] Record the clean master video (case pick → verdict → grounding → Steelman →
      letter), projector-legible.
- [ ] Lock voice-over script (§4); rehearse 10× to a stopwatch; 3:00 hard ceiling.
- [ ] Cue points marked so each speaker knows when the video advances.
- [ ] Fallback: the master video can stand alone (with voice-over) if anything fails.
- [ ] Confirm real slot length **and track** with organizers. If it's ~5 min, add a
      30-second weak-case "honest no" (RED) contrast before the close — see
      `docs/steelman-plan.md`. Rehearse the 3-min core either way.

---

## 12. Data sources (verify before quoting on stage)

| Claim | Figure | Source |
|---|---|---|
| Global legal services market | $1 trillion (2024) | Grand View Research / IMARC Global Legal Services Market Report 2025 |
| Global unmet justice needs | 5.1 billion people | World Justice Project, Measuring the Justice Gap (2019) |
| People who can't resolve legal problems | >50% globally | World Justice Project, Global Insights on Access to Justice |
| English private renters hit by disrepair last year | 6.2M (~3 in 4) | Shelter / YouGov, English private renters and disrepair (2025) |
| Of those, with damp & mould specifically | ~1 in 2 | Shelter / YouGov (2025) |
| Disrepair cases a day reaching Citizens Advice | 200+ | Citizens Advice, disrepair casework (2026) |
| Property Ombudsman complaints surge | +58% (Nov 2025–Feb 2026) | The Property Ombudsman, complaints data |
| Renters with problems who never complained | 47% (mostly fearing eviction) | Shelter, renters' experiences of reporting disrepair (2025) |
| Renters' Rights Act 2025 in force | 1 May 2026 (S.21 abolished) | legislation.gov.uk, Renters' Rights Act 2025 |
| PRS Landlord Ombudsman live | 2028 | gov.uk, Renters' Rights Act implementation |
| UK consumer law market value | £19bn (2024) | IRN / ResearchAndMarkets UK Legal Services Market Report 2025 |
| UK unmet legal needs per year | 6 million adults (England & Wales) | Legal Services Board, Legal Needs Survey 2024 |
| UK housing legal aid deserts | 44% of areas have no provider | Law Society, Feb 2024 |
