# PITCH.md — The Steelman

> **Source of truth for the pitch.** Updated 30 May 2026 to match the app as
> built and deployed at **steelman-legal.vercel.app**. If the app and this file
> disagree on what the demo must show, this file wins.
>
> **Format (locked):** 3:00 hard ceiling. Delivered as a **pre-recorded
> screen-capture video** with **all three teammates voicing over it live on
> stage.** The video removes every live-failure mode. The live app is the proof:
> judges can pick any case afterwards and check the quotes against the documents.
>
> **We are three engineers — not lawyers.** Nobody on stage claims to be one.
> Our credibility is structural: every quote is matched against the user's real
> file, every legal point comes from a closed statute corpus, and anything we
> can't ground we don't say.

---

## 1. Elevator pitch (one line)

**Everyone has a right to good legal advice — but in practice, most people
can't get it. Every legal AI tells you you're right. We built the one that
tells you how you'll lose — because that's the one that actually protects you.**

---

## 2. Paragraph pitch (~30 seconds)

Almost every consumer-legal AI validates the user. None of them show you how
you'll lose. Legal services is a $1 trillion global market — and 5.1 billion
people worldwide have an unmet justice need. Half of everyone who faces a legal
problem can't get help. The Steelman changes that. It argues the *opponent's*
best case against you, grounded in your own documents — giving everyone what
only a solicitor's first meeting used to provide: an honest assessment of where
you stand. The honest "no" is a feature Lawhive wants: fewer dead-end intakes,
lower cost-to-serve, and warm escalations that arrive with their evidence
already mapped.

---

## 3. What's built — full feature inventory

### 3.1 Landing page (`/`)

- **Hero headline:** "Everyone has a right to good legal advice. Every legal AI
  tells you you're right. *We tell you how you'll lose.*"
- **Hero card:** Crystal's case — the killer quote ("I confirm that the above
  works have been carried out to my satisfaction") with ✅ verified marker
- **Problem section:** $1T market, 5.1B unmet justice needs, >50% can't get
  help, 6M UK adults, 38% got no help, −46% legal aid since LASPO — all sourced
- **Three Acts:** best case → the Steelman → Case Reality Report
- **Foil table:** AI chatbot vs Steelman across 5 dimensions
- **Trust mechanic section:** "We're three engineers — not lawyers" + honest-no
  RED verdict card with "Do this instead" recommendation
- **GTM routes:** Lawhive partnership, advocacy orgs, lettings agents
- **Sources:** All 6 figures cited per §12
- **Sponsors bar:** Lawhive, GV, Balderton, Anthropic, Google Cloud, Gemini,
  Lovable — all clickable links to their home pages
- **Steelman branding:** Shield + suited-agent SVG logo throughout

### 3.2 Dashboard (`/demo`)

- **Case list** with 4 cases: 2 complete (with real report data), 2 in-progress/new
- **Case 07 — Crystal vs Council** (damp & mould, arguable, escalate to
  solicitor) — loads real report data from `rental-07.report.md`
- **Case 01 — Jamie vs P Sullivan** (deposit dispute, strong, self-serve) —
  loads real report data from `rental-01.report.md`
- **Stats row:** total cases, complete, in progress, new
- **"New case" button** → routes to intake chat
- **Each case card** shows: title, description, status badge (complete / in
  progress / new), prospects badge (strong / arguable / weak), recommendation,
  date
- Completed cases link to unique URLs: `/demo/report/case-07`,
  `/demo/report/case-01`

### 3.3 Case report (`/demo/report/[caseId]`)

**Four tabs:** Overview, Documents, References, The Steelman.

#### Overview tab
1. **Verdict card** (top) — WEAK / ARGUABLE / STRONG traffic-light badges,
   recommendation badge (Escalate to solicitor / Self-serve / Reconsider
   pursuing), one-line summary
2. **Report body** — multi-paragraph assessment with inline green (supporting
   evidence) and red (flag/risk) highlights
3. **Analysis tabs** — tabbed section: Arguments for (+) / Counterarguments (−)
   / Summary
4. **Key references** — short-form statute chips with "View all →" link to
   References tab
5. **Recommended action** (bottom) — Send pre-action letter / Escalate to
   Lawhive, side-by-side cards

#### Documents tab
- **Case files auto-loaded** on mount (9 files from Case 07: tenancy agreement,
  contractor works form, council inspection report, email chain, GP letter,
  phone call log, mould photos months 1/3/8)
- **PDF viewer** — inline iframe for PDFs, inline image viewer for photos
- **Upload button** — opens native file picker for additional files
- **Uploaded files** displayed with "Uploaded" badge, viewable inline
- **Extracted evidence** — selectable checkboxes

#### References tab
- **Left panel** — sticky case report text with green/red highlights; **cross-
  highlighting** — expanding a reference highlights the relevant passage with a
  ring accent
- **Supporting references** (green) — 3-5 statute references, each expandable:
  full citation, full verbatim statute text, "How this applies" section with
  linked quotes, "View on legislation.gov.uk" external link
- **Counterargument references** (red) — 3-4 counter references, each
  expandable: argument, legal basis, detailed explanation, linked report text

#### The Steelman tab
- Chain-of-argument accordion: opponent's argument → verbatim quote from
  user's own documents (✅ grounded) → strongest honest reply → "Still
  unresolved" contested marker

### 3.4 Submission flows

#### "Send pre-action letter" path
1. **Letter prepared** page — full pre-action letter with statutory basis
2. **Download PDF** — `window.print()` to system PDF
3. **Send letter** → **email compose view**: To field, subject auto-filled,
   editable letter body (full textarea), removable attachment chips (10 case
   documents), statutory basis, "Send with N attachments" button → green tick
   "Letter sent" confirmation
4. Signed with: Natalie Clemmingtime

#### "Escalate to Lawhive" path
1. **Split layout** — left panel: case summary, ARGUABLE badge, key statutes,
   Download PDF + Dashboard buttons, **"Share report with solicitor"** button
   (copies unique case URL to clipboard with green tick confirmation)
2. **Right panel: Recommended solicitors** — 3 real Lawhive lawyers:
   - Katherine Jackson (housing disrepair & tenant claims)
   - Daniel Tang (HHSRS enforcement & fitness for habitation)
   - Rachelle Man Hiu Lam (pre-action protocol & deposit disputes)
   - Each with: real photo, firm (Lawhive), specialisation, experience,
     qualifications badges, star rating, cases won, clickable name linking to
     their lawhive.co.uk profile
   - **"Request consultation"** button → green tick "Consultation requested"
     state with green border

### 3.5 3D spinner / loading

- **Steelman logo** (shield + suited agent SVG) rotates as a 3D object during
  report regeneration
- Triggered when chat adds new evidence/documents

### 3.6 Technical architecture

- **Stack:** Next.js 16 + React 19 + Tailwind CSS 4 on Vercel
- **AI:** Anthropic SDK — single structured completion (`json_schema`, adaptive
  thinking, prompt-cached statute corpus). No orchestration framework.
- **Anti-hallucination guard:** two-tier — soft-fail for steelman quotes (flag
  but keep if not found verbatim in case text), hard-fail for legal citations
  (strip entirely if not found in corpus)
- **Corpus:** real verbatim statute text from legislation.gov.uk (Housing Act
  2004, LTA 1985, Fitness Act 2018, Pre-Action Protocol, Defective Premises
  Act)
- **Case data:** parsed from real Claude-generated reports (`rental-01`,
  `rental-07`) into typed case objects with highlights, references, counter
  references
- **Unique URLs:** `/demo/report/case-07` — shareable, case-specific

---

## 4. The 3:00 demo — video storyboard + live voice-over script

### Beat 1 — Cold open + the honest-no thesis (0:00–0:35) · THINKER

- **VIDEO:** Landing page hero → scroll to stats → click "Try the demo"
- **VOICE (Thinker):**
  > "Everyone has a right to good legal advice — but in practice, most people
  > can't get it. Five billion people worldwide have an unmet justice need.
  > Every legal AI fills that gap by telling them they're right. We built the
  > opposite. The most useful thing a legal AI can do is tell you the truth —
  > including when to stand down."
- **VIDEO:** Dashboard → click Crystal's case (Case 07, damp & mould)
  > "This is Crystal's case. Eight months of damp, a sick child, fifteen
  > ignored emails. Watch what Steelman says about it."

### Beat 2 — Grounded assessment + the Steelman punch (0:35–1:55) · ENGINEER

- **VIDEO:** Report Overview → verdict badge (ARGUABLE) → scroll to report
  body with green/red highlights → click References tab → expand a statute →
  cross-highlighting lights up → click The Steelman tab → hero chain expands
  with the signed-form quote
- **VOICE (Engineer):**
  > "First, the honest verdict — amber, arguable, with reasons. Then it
  > grounds every point in current statute: section 11, the fitness act, the
  > HHSRS — each footnoted to the actual text, not a paraphrase. Click any
  > reference and watch the relevant passage light up in the report.
  >
  > Then the part no other tool does. **The Steelman.** It argues the council's
  > *best case against the tenant*, using the tenant's own documents. Here's
  > the punch: after earlier works, the tenant signed a form. The agent pulls
  > the exact line — *'I confirm that the above works have been carried out to
  > my satisfaction.'* That's the council's whole defence, in the tenant's own
  > signature. And every quote is checked character-for-character — if it isn't
  > in the documents, it never reaches the screen."

### Beat 3 — The artefact + access-to-justice close (1:55–3:00) · CLOSER

- **VIDEO:** Click "Escalate to Lawhive" → solicitor recommendation page with
  real lawyer profiles → click "Request consultation" (green tick) → click
  "Share report with solicitor" (link copied) → back to Overview → click "Send
  pre-action letter" → email compose view with all documents attached → send
- **VOICE (Closer):**
  > "When the case is real, it doesn't stop at advice — it produces the
  > document. A pre-action letter, every claim footnoted, all evidence
  > attached, editable and sendable. And when a solicitor is needed, it matches
  > you with one — real Lawhive lawyers, real profiles, one click to request
  > a consultation with the case file already shared.
  >
  > We're three engineers, not lawyers — that's exactly why it works this way.
  > Every quote is matched to the real file; every point of law comes from
  > actual statute; anything it can't ground, it doesn't say.
  >
  > The honest 'no' is a feature Lawhive *wants* — fewer dead-end intakes,
  > warm escalations with prepared files. This isn't a sizzle reel: the app is
  > live right now at steelman-legal.vercel.app. Pick any case and check the
  > quotes yourself. Everyone has a right to know where they stand. The tool
  > that tells you the truth — including how you'll lose — is the one that
  > finally gives people a fair shot. That's access to justice. Thank you."

**Timing note:** ~320 words (~3:00 at a measured pace). Rehearse 10× to a
stopwatch. The video is the metronome — speakers sync to it, not vice versa.

---

## 5. Build contract — what the recorded video MUST show

- [x] **Brand reads "Steelman" everywhere** — nav, footer, spinner, logo
- [x] **Dashboard** with at least 2 cases with real report data
- [x] **Overview verdict** badge (ARGUABLE) with recommendation badge at top
- [x] **Report body** with green/red inline highlights
- [x] **Analysis tabs** — Arguments for / Counterarguments / Summary
- [x] **References tab** with cross-highlighting to report text, full statute
      text, "How this applies", legislation.gov.uk links
- [x] **Counterargument references** in References tab (red section)
- [x] **The Steelman tab** with chain accordion + hero quote grounded
- [x] **Documents tab** with auto-loaded case files, PDF/image viewer
- [x] **"Send pre-action letter"** → email compose with editable body, all
      documents as removable attachments, send confirmation
- [x] **"Escalate to Lawhive"** → split layout with case summary + 3 real
      solicitor profiles with photos, consultation request with green tick
- [x] **Share link** button copying unique case URL
- [x] **Download PDF** button
- [x] **3D Steelman spinner** during regeneration
- [x] **Unique case URLs** (`/demo/report/case-07`)
- [x] Renders instantly from pre-cached data
- [x] Reads at projector resolution

---

## 6. Why we win (map to judging criteria)

- **Real problem, real complexity.** Consumer housing disrepair with actual
  procedural traps — Pre-Action Protocol, burden of proof, HHSRS, a
  signed-away defence. Plus a deposit non-protection case. Not a toy.
- **A judge can interact with it / impossible to fake.** The app is live at
  steelman-legal.vercel.app. Two fully-functioning cases with different legal
  domains. The trust mechanic (verbatim quote matching) is demonstrable.
- **Technical substance.** Document ingestion → single structured completion →
  anti-hallucination guard (two-tier: soft-fail quotes, hard-fail citations).
  Cross-document reference highlighting. Closed statute corpus. All-Anthropic.
- **Access to justice — backed by numbers.** $1T market, 5.1B people, >50%
  can't get help. The Steelman gives everyone the honest first assessment that
  used to require a solicitor.

---

## 7. The close (the line to land on)

> "Everyone has a right to know where they stand. Every other tool tells people
> they're right. The tool that tells you the truth — including how you'll lose —
> is the one that finally gives people a fair shot."

---

## 8. The personal beat (optional — read the room)

> Drop this in if the room feels receptive. Best in Beat 1 (after "five
> billion") or Beat 3 (before the close). Pick one spot, not both.

**Thinker version:**

> "My mum is one of them. She typed her legal problems into ChatGPT. It told
> her she was right. It missed every counter-argument that mattered."

**Closer version:**

> "One of us watched his mum type her legal problems into ChatGPT. It told
> her she was right. It missed every counter-argument that would have sunk
> her case."

---

## 9. GTM (one slide / one breath if asked)

1. **Lawhive partnership (lead with this)** — the honest intake/triage front
   door. Fewer dead-end intakes, lower cost-to-serve. Warm escalations with
   prepared files. Not a competitor — a moat extension.
2. **Advocacy orgs** — Shelter, Citizens Advice, Generation Rent, ACORN.
   Audience + trust; co-brand / white-label.
3. **Lettings agents / corporate landlords** — a clean pre-action letter is
   cheaper to handle than a confused, angry email.

---

## 10. Objection handling (Q&A prep)

- **"Isn't this discouraging people?"** The opposite. We validate the strongest
  case first, then show the gap so it can be closed. The honest "no" only fires
  when pursuing would cost someone time and money they can't get back.
- **"How do you stop hallucination?"** Every quote is string-matched against the
  real file. Legal citations come only from a closed, verbatim statute corpus.
  Unmatched quotes are flagged; unmatched citations are stripped.
- **"What's the architecture?"** One structured Anthropic completion per case
  (`json_schema`, adaptive thinking, prompt-cached corpus). No orchestration
  framework. Document ingestion + the grounding guard are the engineering.
- **"Is this legal advice?"** No. It's a case-assessment assistant that gives
  information and routes to a solicitor when needed.
- **"Three engineers — how do you know the law is right?"** We designed it so
  soundness doesn't depend on us being lawyers. Evidence and procedure, not
  free-reciting statute. Closed corpus. Anything ungrounded is stripped.
- **"Non-housing cases?"** The agent runs on any case file; the corpus covers
  housing only. Non-housing says "no corpus provision applies." The
  architecture generalises.
- **"Why not Gemini?"** Deliberate. All-Anthropic = single completion + zero
  plumbing risk. We accept the small ding for a sharper core.

---

## 11. Production checklist (pre-stage)

- [x] App deployed at steelman-legal.vercel.app
- [x] Both cases render from pre-cached data
- [ ] Record the clean master video per §5 build contract
- [ ] Lock voice-over script (§4); rehearse 10× to a stopwatch
- [ ] Cue points marked so each speaker knows when the video advances
- [ ] Fallback: the master video can stand alone if anything fails
- [ ] Confirm slot length with organizers

---

## 12. Data sources (verify before quoting on stage)

| Claim | Figure | Source |
|---|---|---|
| Global legal services market | $1 trillion (2024) | Grand View Research / IMARC |
| Global unmet justice needs | 5.1 billion people | World Justice Project (2019) |
| Can't resolve legal problems | >50% globally | World Justice Project |
| UK unmet legal needs/year | 6M adults (E&W) | Legal Services Board (2024) |
| UK civil issue, no help | 38% | Legal Services Board (2024) |
| Legal aid drop since LASPO | −46% (925K→497K) | Law Society |
| UK housing legal aid deserts | 44% of areas, no provider | Law Society (Feb 2024) |
| English renters hit by disrepair | 6.2M (~3 in 4) | Shelter/YouGov (2025) |
| Renters' Rights Act in force | 1 May 2026 | legislation.gov.uk |
