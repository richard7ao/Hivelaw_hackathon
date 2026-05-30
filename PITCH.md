# PITCH.md — The Steelman

> **Source of truth for the pitch.** The app is built *around this document*, not the
> other way round. If the app and this file disagree, this file wins for what the
> demo must show; `docs/steelman-plan.md` (APPROVED) wins for build scope.
>
> **Format (locked):** 3:00 hard ceiling. Delivered as a **pre-recorded screen-capture
> video** of the app running Case 07, with **all three teammates voicing over it live
> on stage.** The video removes every live-failure mode (network, API latency, rate
> limits, mis-clicks). The live voices carry the close, and the live app is the proof:
> the recording isn't a sizzle reel — judges can pick any case afterwards and check
> the quotes against the documents themselves. Rehearse to a stopwatch; record a clean
> master video as the artifact the voice-over is timed against.
>
> **We are three engineers — not lawyers.** Nobody on stage claims to be one. Our
> credibility is structural, not personal: every quote is matched against the user's
> real file, every legal point comes from a closed statute corpus, and anything we
> can't ground we don't say. That's the honest version, and in a room of real lawyers
> it's the only safe one.

---

## 1. Elevator pitch (one line)

**Every legal AI tells you you're right. We built the one that tells you how you'll lose — because that's the one that actually protects you.**

---

## 2. Paragraph pitch (~30 seconds)

Almost every consumer-legal AI validates the user. None of them show you how you'll
lose. The Steelman is the legal agent that argues the *opponent's* best case against
you, grounded in your own documents. You paste your case file; it gives you your
strongest position, then role-plays how the other side attacks — quoting your own
evidence back at you as a weapon — then hands you a **Case Reality Report**: your
prospects, an actionable evidence-gap checklist, and an honest recommendation
(handle it yourself, escalate to a Lawhive solicitor *with a prepared file*, or
reconsider pursuing). It turns the panel's own hardest insight — that the most
valuable thing an agent can do is sometimes talk someone out of a claim — into a
visceral, impossible-to-fake moment. The honest "no" is a feature Lawhive wants:
fewer dead-end intakes, lower cost-to-serve, and warm escalations that arrive with
their evidence already mapped.

---

## 3. Full pitch

### 3.1 The category argument (why we exist)

The gap between what you believe happened and what a judge needs to *see* is the
single biggest source of friction at the start of any legal matter. Every tool on
the market widens that gap by agreeing with you. The Steelman closes it. We don't
discourage people — we arm them. Better to take the other side's hardest punch from
us, in private, than from a judge when it's too late to fix.

### 3.2 The product in three acts

1. **Best case** — your single strongest position, in plain English. Validate first.
2. **The Steelman** — the 2–4 strongest arguments the *other side* will make, each
   grounded in a **verbatim quote from your own documents.** This is the hero: the
   agent quoting your own evidence back at you.
3. **The verdict** — the Case Reality Report: prospects (strong / arguable / weak),
   an **evidence-gap checklist** (the hero artifact), and a recommendation.

**Trust mechanic (say this out loud in the demo):** every quote is string-matched
character-for-character against the user's real documents. If a quote isn't in the
file, it never reaches the screen. The whole credibility claim is "it quotes your
own evidence," so a fabricated quote is the one thing we will not allow.

### 3.3 The featured case

**Case 07 — Crystal Bello, 38, single mother, South London.** Eight months of damp
and black mould in a council flat, spreading across three rooms, a child with a
persistent cough, a GP letter, 15 ignored emails. The killer beat: when the
contractor's dehumidifier was installed, Crystal signed a form. The agent finds and
quotes the exact line — **"I confirm that the above works have been carried out to
my satisfaction"** — and explains it's now the council's defence, in her own
signature. (Verbatim source: `cases/case_07_Problem_Statement.md`, document 06,
`contractor_works_form.pdf`.)

---

## 4. The 3:00 demo — video storyboard + live voice-over script

**How to read this:** the **VIDEO** column is what the recorded screen capture shows
(the engineer's build-and-record target). The **VOICE (live)** column is what the
named speaker says on stage, timed to land with the video. All three speak. 3:00 is a
hard ceiling — cut any word that isn't load-bearing.

### Beat 1 — Cold open + category (0:00–0:35) · THINKER

- **VIDEO:** Title card ("The Steelman"), then the case picker with validated cases;
  Crystal / Case 07 is selected and her case file opens.
- **VOICE (Thinker):**
  > "Every legal AI you've ever used tells you you're right. We built the one that
  > tells you how you'll lose — because that's the one that actually protects you.
  > Lawhive's own lawyers told us the most valuable thing an agent can do is sometimes
  > talk someone out of a claim. So we built it. This is Crystal. Eight months of
  > damp and black mould in her council flat, a sick child, fifteen ignored emails.
  > Watch what our agent does with her case."

### Beat 2 — The three acts, the hero punch (0:35–1:55) · ENGINEER

- **VIDEO:** App runs Case 07. Act 1 (best case) renders → Act 2 (Steelman) renders
  with the signed-form quote visibly highlighted and tied to its source document with
  a ✅ "grounded" marker → Act 3 (Case Reality Report) renders: prospects badge,
  recommendation, evidence-gap checklist.
- **VOICE (Engineer):**
  > "It works in three acts. **Act one — her strongest case.** Validate first:
  > penetrating damp, the council on notice for eight months, a repair that failed
  > within a month. Strong story.
  >
  > Then the part no other tool does. **Act two — the Steelman.** The agent now
  > argues the council's *best case against her*, using her own documents. Here's the
  > punch: when the contractor finished, Crystal signed a form. The agent pulls the
  > exact line and quotes it back — *'I confirm that the above works have been carried
  > out to my satisfaction.'* That's the council's whole defence, in her own
  > signature. And every quote on this screen is checked character-for-character
  > against her real file — if it isn't in the documents, it never reaches the screen.
  >
  > **Act three — the Case Reality Report.** Prospects, a recommendation, and the
  > hero: an evidence-gap checklist. Get an independent damp survey. Get a stronger GP
  > letter. Send a pre-action protocol letter. The exact moves that turn a losing
  > position into a winning one."

### Beat 3 — The trust mechanic + access-to-justice close (1:55–3:00) · CLOSER

- **VIDEO:** Holds on the Case Reality Report / evidence-gap checklist; soft close card
  at the very end.
- **VOICE (Closer):**
  > "We're three engineers — we're not lawyers, and that's exactly why we built it this
  > way. The agent can't make a claim it can't back up. Every quote you just saw is
  > matched character-for-character against Crystal's real documents. Every point about
  > the law comes from a closed library of actual statute text — and if it can't find a
  > basis there, it says so instead of guessing.
  >
  > This is recalibration, and the honest 'no' is a feature Lawhive *wants*. Fewer
  > dead-end intakes. And when a case should escalate, the solicitor doesn't get a
  > panicked email — they get a prepared file with the gaps already mapped.
  >
  > And this isn't a sizzle reel — the app is running right now. Pick any case and
  > watch it argue against you. Every other tool tells people they're right. The tool
  > that tells you how you'll lose is the one that finally gives people a fair shot.
  > That's access to justice. Thank you."

**Timing note:** the script above is ~320 words (~3:00 at a measured pace). Rehearse
10× to a stopwatch. The video is the metronome — speakers sync to it, not vice versa.

---

## 5. Build contract — what the recorded video MUST show

This is the engineer's spec. The video is recorded once, clean; build to exactly this.

- [ ] **Case picker** showing only validated (hand-checked) cases, Case 07 (Crystal) selected.
- [ ] **Act 1 best_case** renders in plain English (penetrating damp / failed repair / on notice).
- [ ] **Act 2 opponent_steelman** renders 2–4 arguments. The signed-form argument is
      present and its `source_quote` — *"I confirm that the above works have been
      carried out to my satisfaction"* — is **visually highlighted and tied to its
      source document** (`contractor_works_form.pdf`) with a ✅ grounded indicator.
- [ ] **Act 3 Case Reality Report** renders: prospects badge (`🟡 arguable`),
      recommendation (`escalate-to-solicitor`), and the **evidence-gap checklist** as
      the visual focal point.
- [ ] Renders **from the pre-cached real response** so it's instant and deterministic
      (live API is the off-stage "run it fresh?" backup only).
- [ ] A reveal cadence between acts so the Steelman lands as its own beat, not a wall
      of text appearing at once.
- [ ] Reads cleanly at projector resolution: large type, the quote legible from the back.

The matching real output already exists in `reports/case_07_Problem_Statement.report.md`
— the UI renders that JSON; it does not invent anything.

---

## 6. Why we win (map to judging criteria)

- **Real problem, real complexity.** Consumer housing disrepair against a council,
  with the actual procedural traps (Pre-Action Protocol, burden of proof, a
  signed-away defence). Not a toy.
- **A judge can interact with it / impossible to fake.** The agent argues against a
  real person using documents nobody scripted; the trust mechanic (verbatim quote
  matching) is demonstrable. The app is live — a judge can pick any case after the
  pitch and check every quote against the source documents themselves. The recording
  is the timed pitch; the running app is the standing dare.
- **Technical substance.** Robust arbitrary-document ingestion + a single structured
  completion + an anti-hallucination guard that strips ungrounded quotes. Stayed
  all-Anthropic on purpose (panel signal, zero night-before plumbing risk).
- **Access to justice.** The wedge: the only tool that tells you how you'll lose is
  the one that actually protects you. The honest "no" lowers cost-to-serve and turns
  dead-end intakes into prepared, warm escalations.

---

## 7. The close (the line to land on)

> "Every other tool tells people they're right. The tool that tells you how you'll
> lose is the one that finally gives people a fair shot."

---

## 8. GTM (one slide / one breath if asked)

1. **Lawhive partnership** — the honest intake/triage front door. Self-serve cases
   stay self-served; escalations arrive with a prepared file. Not a competitor — a
   moat extension. Fewer dead-end intakes, lower cost-to-serve.
2. **Advocacy orgs** — Shelter, Citizens Advice, Generation Rent, ACORN. Audience +
   trust; co-brand / white-label.
3. **Lettings agents / corporate landlords** — a clean pre-action posture is cheaper
   to handle than an angry email.

---

## 9. Objection handling (Q&A prep)

- **"Isn't this just discouraging people from getting justice?"** The opposite. We
  validate the strongest case *first*, then show the gap so it can be closed. The
  evidence-gap checklist is a path to *winning*, not a reason to quit. The honest "no"
  only fires when pursuing would cost someone time and money they can't get back.
- **"How do you stop it hallucinating quotes or law?"** Every steelman quote is
  string-matched against the user's file; unmatched quotes are flagged or stripped.
  Legal citations come only from a closed, verbatim statute corpus we control (Housing
  Act 2004 ss.213–215, LTA 1985 s.11, Homes (Fitness) Act 2018, the Pre-Action
  Protocol). A citation not found in the corpus is stripped — a wrong statute is worse
  than no statute. Named case-law is deferred to v2 (LLMs hallucinate case citations).
- **"Is this legal advice / are you a solicitor?"** No. It's an honest
  case-assessment assistant that shows the truth and points to a solicitor when one is
  needed. The recommendation path makes that explicit.
- **"You're three engineers — how do you know the legal reasoning is sound?"** We
  designed the system so soundness doesn't depend on us being lawyers. It works in
  evidence and procedure (burden of proof, what a judge needs to see, pre-action
  conduct) — domain-general and far safer than free-reciting statute. Quotes are
  grounded in the user's file; citations come only from a closed, verbatim corpus;
  anything ungrounded is stripped. We position as triage and recalibration that routes
  to a real solicitor, not as a substitute for one. We'd genuinely value a Lawhive
  lawyer pressure-testing the outputs — that's the v2 loop.
- **"What about non-housing cases?"** The agent runs on any case file; the statute
  corpus currently covers housing only, and non-housing cases say "no corpus provision
  applies" rather than inventing one. The demo features housing; the architecture
  generalises.
- **"Why not Gemini / Vertex given the sponsors?"** Deliberate. All-Anthropic keeps a
  single completion simple and adds zero plumbing risk the night before. We accept the
  small ding for a sharper core.

---

## 10. Production checklist (pre-stage)

- [ ] App renders Case 07 from cache exactly per the §5 build contract.
- [ ] Record the clean master video (case pick → 3 acts → report), projector-legible.
- [ ] Lock voice-over script (§4); rehearse 10× to a stopwatch; 3:00 hard ceiling.
- [ ] Cue points marked so each speaker knows when the video advances.
- [ ] Fallback: the master video can stand alone (with voice-over) if anything fails.
- [ ] Confirm real slot length with organizers. If it's 5 min, add the 30-second
      weak-case "honest no" contrast (Thinker narrates) before the lawyer's close —
      see `docs/steelman-plan.md` §"If the slot is actually ~5 min". Rehearse the
      3-min core either way.
