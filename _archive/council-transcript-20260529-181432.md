# LLM Council Transcript — Lawhive Hackathon Plan

**Generated:** 2026-05-29 18:14
**Counciled:** `brief.md` + `problem-tracks.pdf` (official Lawhive problem pack)
**Method:** 5 advisors (independent) → anonymised peer review → chairman synthesis

---

## The Original Question

`/llm-council @brief.md` — with the official `problem-tracks.pdf` added as context. Pressure-test the team's hackathon plan against what the judges said they want. Is it a winner? Where is it weak, wrong, or risky? What should change before hack day?

---

## The Framed Question (sent to all 5 advisors)

> **The decision:** A 3-person team (a "thinker," an engineer, and a lawyer) has written a detailed plan to win the Lawhive Hackathon (London, 30 May 2026 — a single-day AI-native legal build competition). They have ~2 weeks to prepare. Pressure-test it.
>
> **At stake:** Two weeks of prep for three people who've never built together; £5,000 first prize; presenting in front of judges/sponsors — Anthropic, Google Cloud, Gemini, Lovable, GV, Balderton, and Lawhive itself.
>
> **PART 1 — What the judges said they want (official problem pack).** Lawhive is "an AI-native legal operating system — a fully online firm." Verbatim: *"We're not judging on polish. We're looking for a real problem clearly understood, a working prototype, a clear argument for why your approach moves the needle on access to justice, and the potential to go further."* The four criteria: (1) a real problem clearly understood; (2) a working prototype — *"something we can actually interact with, however rough"*; (3) a point of view on access to justice; (4) potential to go further — *"what would this look like with six more months?"*
>
> Five tracks (pick one). The team chose **Track B — Know Your Rights**: *"What if finding out your legal rights was as easy as texting a friend?"* Lawhive's lawyers say the #1 friction is consumers carry *"a wildly distorted picture of what pursuing a claim actually looks like"* — *"the first conversation isn't legal analysis, it's recalibration."* Their question to sit with: *"If the most useful thing an agent could do is talk someone out of pursuing the wrong claim, what does success look like?"* (Other tracks: C — Case In A Box / intake + structured handoff; D — The Negotiator / pre-action letters, where a non-compliant Letter Before Action is *"a wound that surfaces months later"*; E — Paperwork Crusher.) **Provided on the day:** a GCP environment + synthetic case scenarios *with documents* (tenancy agreements, email chains, court forms), including a *messy* housing-disrepair case.
>
> **PART 2 — The team's plan.** Track B, anchored on damp & mould only. Product: a web app where a renter describes disrepair in plain English, uploads photos, and gets a rights explanation + a pre-action protocol letter + an environmental-health complaint (both PDF) + a handoff to a Lawhive solicitor. Hook: the Renters' Rights Act 2025 took effect 1 May 2026 (29 days before hack day; Section 21 abolished); they'll demo vanilla ChatGPT citing Section 21 as still valid as a "foil." Market slide: 6.2M renters × £500–£3,000 × 10–20% = hundreds of millions. **Demo (8 min, fully scripted, runs locally):** cold open → Wow 1: ChatGPT foil → live flow ("Sarah" describes damp, 2 clarifying Qs, 3 photos, HHSRS classification, statute named) → Wow 2: renders the letter + complaint → Wow 3: 3D scan of the flat with pre-pinned defects, click pin → photo + AI analysis → Lawhive handoff (cut to solicitor's view) → TAM slide. **They will NOT take questions and will NOT let a judge type input.** Failsafes: pre-recorded video + static case-file URL. **Build:** Next.js + Tailwind + Anthropic SDK (Opus reasoning, Haiku classification, Claude vision); 3 tools; real statutory corpus with prompt caching; 3D (RoomPlan → USDZ → GLB → model-viewer) is v2, only smoke-tested. **GTM:** (1) be Lawhive's intake front door (lead with this), (2) advocacy orgs, (3) letting agents.

---

## Anonymisation Map (revealed)

Responses were randomised before peer review to remove positional bias:

| Letter | Advisor |
|---|---|
| A | The Expansionist |
| B | The Executor |
| C | The Contrarian |
| D | The First Principles Thinker |
| E | The Outsider |

---

## Round 1 — The Five Advisors

### The Contrarian

The Renters' Rights Act 2025 is your single point of failure, and you've built the demo around it. You're betting £5k and two weeks on a statute that came into force 29 days before hack day — with no caselaw, possibly incomplete commencement regulations, and details your housing-lawyer friend may not have nailed. If a Lawhive solicitor in the room knows the Act better than you (they will), your "ChatGPT cites Section 21" foil flips: the moment your agent misstates one provision of a month-old Act, you're the stale one. High-wire act, no net.

Now the criteria. Read criterion 2 again: "something we can actually interact with." You've explicitly decided judges will NOT type anything and will NOT ask questions during the demo. You've optimized directly against the one thing they named. A fully-scripted, no-touch, "runs locally" reel is a pitch, not a prototype — and these judges (Anthropic, GV, Balderton) sit through scripted demos for a living. The 3D RoomPlan scan is the tell: it's the flashiest thing in the deck, it's explicitly NOT in v1, and it screams "polish" at the one panel that opened by saying they don't judge polish. Cut it.

The track question is a trap you're walking past. Track B's own prompt says success may be "talking someone out of pursuing the wrong claim." Your entire flow assumes Sarah has a winner and rushes her to a Letter Before Action and a solicitor handoff. You've built the opposite of what they asked — a claim-maximizer, not a recalibrator. That's not a weak answer to the brief; it's an answer to a different brief.

GTM: leading with "be Lawhive's front door" to a panel that includes Lawhive is either brilliant or reads as building their roadmap for them — and it implies your moat is their distribution. The TAM slide (6.2M × £3k) is the kind of hand-wave that makes Balderton stop listening.

Fix list: let a judge type one live query. Make recalibration the hero — show a near-miss case the agent honestly downgrades. Drop the 3D. Hedge every RRA claim with a visible source. Win on substance, not stagecraft.

### The First Principles Thinker

First Principles take. Most of this analysis won't matter, because the plan answers a question the brief didn't ask.

Strip Track B to its core. The judges told you the #1 friction is recalibration — people carry "a wildly distorted picture." Their literal sit-with question: "If the most useful thing an agent could do is talk someone out of pursuing the wrong claim, what does success look like?" That is the problem. The job is *calibration*: making someone with a weak case stand down, and someone with a strong case proceed with accurate expectations.

Now look at what the plan actually builds. It builds an *escalation engine*. Every demo beat points one direction: classify hazard → name statute → render letter → 3D evidence → handoff to solicitor. Sarah always wins. The plan has no path for "your damp is condensation from drying laundry, you have no claim, here's how to fix it yourself for £40." It cannot demonstrate the one capability the judges explicitly said they care most about. They will notice. Someone on that panel wrote that question on purpose.

The brief reads like a *triage* problem; the team built a *conversion funnel*. The "messy housing case where self-help has derailed" in the materials is a tell — they want to see you handle the person who shouldn't have started, not manufacture another claimant.

So reframe before reskinning. The product is a **prospects assessment that can say no**. Success = the right people stop, the right people proceed calibrated. Demo two cases: a strong one (Sarah) AND a weak/borderline one the agent talks down with dignity. That weak case IS Wow 1 — not the ChatGPT foil, which proves a competitor is wrong, not that *you* are right.

Two more first-principles cuts. (1) "We won't take questions, won't let judges type" — for a "working prototype we can interact with," refusing interaction reads as hiding. The product's whole value is the conversation; script the happy path, but let one judge type. (2) The 3D scan and the TAM-in-hundreds-of-millions are answering "is this impressive / is this venture-scale" — not "does this move access to justice." Cut the 3D; redirect that energy into the "say no" path. Build the thing that's allowed to be irrelevant.

### The Expansionist

The team is sitting on three assets they're treating as garnish. They're the actual prize.

**The 3D scan is your moat, not your v2.** Every team will demo a chatbot that cites the right statute. Nobody else loads a navigable 3D model of the actual flat with hazards pre-pinned, click-to-evidence. That is the image the judges describe to each other afterward. Burying it as "smoke-tested, not in v1" is the single biggest unforced error here. Spatial evidence is a genuinely new primitive for access-to-justice — disrepair, dilapidations, boundary disputes, personal injury, even crime scenes. Pull it forward. Make it the spine of Wow 3 and rehearse it until it's bulletproof.

**The stale-data foil is a wedge into a category, not a gag.** "Vanilla ChatGPT confidently gives illegal advice the day the law changes" isn't a one-flat joke — it's the argument that general models are *actively dangerous* in regulated domains, and that a law-current, jurisdiction-pinned agent is a defensible product. Anthropic and Lawhive both want exactly this story. Name it: "legal models go stale silently, and in law, stale is malpractice." That reframes the whole product from "renter helper" to "the correctness layer for AI law."

**The talk-them-out-of-it brief is the moonshot they skipped.** Lawhive's own sharpest question — success as talking someone *out* of a bad claim — is the highest-status thing a legal agent can do, and it's adjacent to their whole funnel. A confidence-calibrated "your case is weak, here's why, here's the £200 you'd waste" verdict is the demo moment that makes Lawhive see an *acquisition*, not a hackathon toy.

Bigger frame for the close: don't end on TAM. End on "this is Lawhive's intake brain for every case type — disrepair is just the wedge." Six months isn't a bigger app; it's the front door to the entire firm.

### The Outsider

The "foil" is your single best idea and your single biggest unexamined assumption. You're betting the demo's opening on ChatGPT confidently citing a dead law. But you're presenting to Anthropic, who make a competitor to ChatGPT, plus Google/Gemini. "Look how dumb the other AI is" might read as a cheap shot to the exact people scoring you — and worse, it invites the obvious question you've refused to take: "does YOUR system know the new law, or did you just hardcode it?" If a renter asks Sarah's question on 30 May, your tool only looks smart because someone typed the right answer in two weeks ago. That's not AI being trustworthy; that's you being recently updated. The judges will see this instantly.

What confuses me as an outsider: the whole thing hinges on a law that changed 29 days ago, but nothing explains how your product STAYS right when the next law changes. That's the actual hard problem and it's invisible here.

Jargon that means nothing to me: "pre-action protocol letter," "Section 21," "environmental-health complaint," "housing disrepair." You use these like everyone knows them. The judges might — but the renter texting "my flat has mould, am I allowed to be angry about this" does not. If your product speaks in this language, you've recreated the wall you claim to tear down.

The thing that genuinely doesn't add up: you refuse to let a judge type anything in. You're entering a "working prototype" contest where the brief literally says "something we can actually interact with." Refusing interaction isn't a failsafe — it's a confession that it breaks. That choice alone could lose it.

Also: the judges asked what success looks like when the right answer is "don't pursue this claim." Your demo only ever says yes, escalate, here's a letter. You answered a different question than the one they asked.

The 3D flat scan is a magic trick at a job interview. Impressive, irrelevant, and it eats the time you should spend proving the hard part works.

### The Executor

The build is achievable. The plan's biggest execution flaw is that it spends two weeks de-risking the wrong things and almost nothing on the thing that actually breaks.

Critical path on hack day, in order: data ingestion of the provided synthetic case → classify → draft → render PDF → display. That's the spine. Everything else is garnish. Notice what the plan front-loads: vision prompt calibration ("most important pre-work") and a RoomPlan 3D scan. Both are off the critical path. The 3D scan is pure demo theater with zero bearing on the judging criteria, and it's the single most likely thing to eat your afternoon.

The hidden time-sink: PDF rendering. "Renders a pre-action letter as PDF" sounds trivial and never is — fonts, page breaks, headless Chrome on serverless, cold starts. Build that Day 1, not Day 6. If your letter renders end-to-end on Monday, you've de-risked 80% of the demo.

The thing that breaks at 4pm: they ignore the provided case documents. Judges hand you a messy housing case WITH a tenancy agreement and email chain, then watch a demo hardcoded around "Sarah." If the day's case doesn't match your script, you're either re-shooting the fallback video at 4pm or demoing fiction. Build the ingestion path for arbitrary provided documents — that IS criterion 2.

The interactivity contradiction is the real risk. "Working prototype we can interact with" vs. "judges may NOT type input." You're optimizing against the rubric. You don't need open input — you need ONE judge-supplied case to flow through live.

Monday morning, in this order:
1. Next.js route → Claude call → render a real PDF letter. End to end. Today.
2. Paste in one synthetic case, classify, draft from it.
3. Wire vision as an add-on, not the spine.

Cut RoomPlan entirely. Cut Lawyer Session #2. Move both freed days onto ingesting the day's real case file. That's the fastest path to a prototype that survives contact with the judges.

---

## Round 2 — Peer Review (5 reviewers, anonymised inputs)

**Reviewer 1** — Strongest: **D (First Principles)** — names the load-bearing flaw (triage/calibration problem vs conversion funnel built) and ties every demo beat to that diagnosis; goes past critique to a concrete fix (weak case talked down with dignity as Wow 1). Biggest blind spot: **A (Expansionist)** — makes the 3D scan "the spine/moat," contradicting "we're not judging on polish" + the interactivity demand. Missed by all: nobody challenged the **3-person / single-day** resourcing; the all-Anthropic stack vs the provided **GCP** environment was never reconciled.

**Reviewer 2** — Strongest: **D** — nails the conversion-funnel-vs-recalibration thesis, converts it to a two-case demo fix, correctly demotes the ChatGPT foil, cuts TAM/3D on the right grounds. Biggest blind spot: **A** — doubles down on 3D as "moat," optimizing for the afterparty anecdote. Missed by all: **the provided GCP environment + synthetic case documents are graded inputs**, and the all-Anthropic stack is a tell; none mention running the messy housing case's actual documents live.

**Reviewer 3** — Strongest: **D** — most precise on "conversion funnel" vs "triage problem"; fuses recalibration + interactivity + TAM into one coherent reframe. Biggest blind spot: **A** — mistakes spatial spectacle for an access-to-justice signal. Missed by all: nobody used the provided GCP + documents as a scoring signal; **all-Anthropic on Google-provided GCP, before Google/Gemini judges**, is an unflagged mismatch; an 8-min scripted demo likely overruns the slot.

**Reviewer 4** — Strongest: **D** — most precisely diagnoses "answered a different question," ties fixes to the stated criteria, demo-ready prescription. Biggest blind spot: **A** — 3D-as-moat inverts the brief. Missed by all: handed a GCP environment, chose all-Anthropic with Google/Gemini judging — **platform snub / missed credibility signal**; and **recalibration ("you have no claim") directly cannibalises Lawhive's intake revenue** — the "no" demo may delight judges yet undercut the GTM pitched to Lawhive itself.

**Reviewer 5** — Strongest: **D** — isolates the load-bearing error and gives the highest-leverage fix (two cases, weak one talked down "with dignity" as Wow 1). Biggest blind spot: **A** — optimizes for "impressive," the axis judges deprioritized. Missed by all: the judges *provided* synthetic case documents expecting ingestion — a crowd-favourite move is **letting a judge pick from the provided scenarios live**, sidestepping the "won't let judges type" risk with vetted inputs; also unmentioned — the third teammate's role during a scripted run, and the 8-min demo vs the real time budget.

**Peer-review tallies:** Strongest = First Principles (5/5). Biggest blind spot = Expansionist's "3D = moat" (5/5). Unanimous missed item = the GCP/Gemini platform snub (5/5).

---

## Chairman's Verdict

### Headline

As designed, the plan is **beautifully executed but aimed at the wrong target** — it would lose to a rougher build that actually answers the brief. The plan is a polished *claim-accelerator* that always says "yes, here's your letter." Lawhive's Track B explicitly asks for the opposite: **recalibration** — an agent whose most valuable act may be telling someone "you don't have a case." The team built a conversion funnel; the judges asked for triage. Fix that one inversion and most other problems dissolve. Re-aimed, the plan has the strongest raw material in the room and can win.

### Where the Council Agrees (high-confidence)

1. **The "no judge interaction" rule is the clearest mistake.** 4/5 advisors, independently. Criterion 2 is literally "a working prototype — something we can actually interact with." Refusing input "isn't a failsafe — it's a confession that it breaks."
2. **The product answers the wrong question.** It only ever says *yes, escalate*. It cannot demonstrate the "talk someone out of a weak claim" capability the panel explicitly cares most about.
3. **De-emphasise the 3D scan.** 4/5 say cut it from the spine: polish at a "we don't judge polish" panel, off the critical path, most likely to eat hack day.
4. **Drop the hundreds-of-millions TAM close.** It answers "is this venture-scale," not "does this move access to justice."
5. **The ChatGPT/Section-21 foil is double-edged.** Strong hook, but invites "does *your* system actually know the law, or did you hardcode it?" — and you must be bulletproof on a 29-day-old Act in front of housing solicitors.

### Where the Council Clashes

1. **The 3D scan — moat or distraction?** The Expansionist alone argues it's the unforgettable image and a new access-to-justice primitive; make it the spine. Everyone else (and all 5 reviewers) says cut it. Both capture a truth: hackathons are won on what judges remember, but this panel disclaimed polish and demanded interactivity. *Resolution: the unforgettable moment should be the agent saying "no" with dignity — not the scan. Keep 3D only as a ≤20-second "here's where this goes" coda, if already bulletproof.*
2. **Leading GTM with "be Lawhive's front door" — brilliant or naive?** Either it speaks straight to the funnel of the firm on the panel, or it reads as building their roadmap with their distribution as your only moat. Deeper tension (from review): recalibration cannibalises Lawhive's lead volume. *Resolution: frame "saying no" as a feature Lawhive wants — filtering non-cases lowers cost-to-serve — not a bug that kills leads.*

### Blind Spots the Council Caught (in peer review)

- **The GCP / Gemini platform snub** — judges *provide* GCP and Google/Gemini are on the panel, yet the stack is all-Anthropic and the demo is local-only. (Anthropic also judges, so Claude isn't wrong — but ignoring the provided infra entirely is the risk.)
- **Use the provided case documents live** — let a judge *pick* a supplied synthetic scenario and run it. Vetted input + genuine interactivity + proof you understood the real problem. The clean fix to the interactivity contradiction.
- **Recalibration vs. revenue** — reconcile the "say no" hero demo with the warm-lead GTM.
- **Resourcing reality** — 3 people / one day; 8-min demo likely overruns; third teammate undefined in a scripted run.

### The Recommendation

Re-aim the same craft at the real target. Keep the strong assets (real statutory corpus, protocol-compliant letter, lawyer red-pen validation, "why now" timing) but subordinate all of it to one thesis: **an agent that tells you the truth, even when the truth is "you don't have a case."**

- Demo **two cases live on the judges' own provided documents** — one strong (escalates with a prepared file), one weak/borderline (the agent honestly talks it down). Make the **"no"** the hero beat.
- Let **one judge pick which provided case to run.** That single change converts "scripted reel" → "working prototype" under the actual rubric.
- **Cut the 3D scan from the spine** (optional short coda only). **Reframe the foil** from a gag into the category argument: "general models go stale silently — in law, stale is malpractice."
- **Reconcile the stack with the provided GCP/Gemini infra** enough to not look like you ignored it. **Replace the TAM close** with the access-to-justice + "intake brain for every case type" frame.

**Is it a winner?** Not as currently designed — it fights the rubric. Re-aimed as above: yes. "The agent that's honest enough to turn you away" is exactly the access-to-justice story that wins *this* panel.

### The One Thing to Do First

**Rewrite the demo script around two cases — and make the agent's honest "no" the centrepiece.** Before another line of code, script the strong case *and* a weak case the agent talks down with dignity, both runnable on the provided case files. This is the keystone: once the hero moment is "the agent tells the truth," the 3D scan drops, the build points at triage instead of letter-generation, the foil demotes itself, and the GTM reframes automatically.
