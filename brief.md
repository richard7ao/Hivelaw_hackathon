# Lawhive Hackathon — v1 Learning Sprint + Pitch Plan

**Hackathon date:** 30 May 2026 — Lawhive HQ, Hoxton, London
**Track:** B (Know Your Rights) — renters' rights, anchored on disrepair (damp & mould)
**Team:** Thinker + Engineer + Lawyer
**Sponsors / judges:** Anthropic, Google Cloud, Gemini, Lovable, GV, Balderton, Lawhive
**Prizes:** £5,000 first, £2,500 second, £1,000 third

---

## 0. The pitch (write this first, build to it)

The plan below was rebuilt after a sharp piece of feedback: the build plan came before the pitch. That's backwards. The pitch tells you what to build. This section is the answer to the five questions every judge will ask, and every engineering decision flows from it.

> **Revised again after an LLM-council review against the official problem pack (`problem-tracks.pdf`).** The load-bearing change: this is no longer a claim-accelerator that always says "yes, here's your letter." It is an agent that gives an **honest prospects assessment — including telling a renter when they *don't* have a case** — demonstrated live on the judges' own provided cases. Lawhive's Track B says the first conversation "isn't legal analysis, it's recalibration," and asks point-blank what success looks like when the right answer is "don't pursue this." We answer that on stage. Every fix below traces to that. (Full reasoning: `council-report-*.html`.)

### 0.1 What the product is, in one sentence

A web app where a renter describes a disrepair problem in plain English, shares the evidence they already have (photos, their tenancy agreement, the email chain with the landlord), and gets back an **honest, legally-grounded prospects assessment** — what their rights actually are, whether they have a real claim *or not*, and what to do next. When the case is strong it produces sendable, protocol-compliant pre-action documents and a clean handoff to a Lawhive solicitor. When it isn't, it says so plainly and saves them the wasted time and cost. The most valuable thing it can do is sometimes tell you to stand down.

### 0.2 How big is the problem space

The numbers are real and they answer the TAM question on their own.

- **6.2 million private renters in England experienced disrepair in the last year** — three in four. Half had damp and mould specifically. (Shelter / YouGov)
- **Shelter's online disrepair pages are hit every 18 seconds.**
- **Citizens Advice supports 200+ people a day** on disrepair, no-fault evictions and rent hikes. March 2026 alone: 1,829 disrepair cases, up from 1,666 the year before.
- **The Property Ombudsman saw a 58% surge in complaints** Nov 2025 – Feb 2026 — they call it the "Renters' Rights effect."
- **Half of complaints to landlords go unresolved.** Most who escalate go to council environmental health — exactly the pathway our agent generates.
- **47% of renters with property issues had not made a complaint**, mostly out of fear of eviction. Section 21 was abolished on 1 May 2026 — that fear collapses, but the tools to act haven't caught up.
- **The new Private Rented Sector Landlord Ombudsman doesn't go live until 2028.** Two-year window where renters have new rights but no new infrastructure.

TAM math for the slide: 6.2M × £500–£3,000 average claim value × realistic 10–20% who would act if armed with the right tool = multi-hundred-million-pound underserved market.

### 0.3 Why now

- **Renters' Rights Act 2025 came into force on 1 May 2026** — 29 days before hack day. Section 21 evictions abolished. Fixed-term ASTs gone. Rent in advance capped. New pet-request rights. New rent-increase challenge route via First-Tier Tribunal.
- **Every existing tenant-rights guide is partially out of date.** The corpora most LLMs were trained on don't reflect post-1 May reality. Vanilla ChatGPT will confidently cite Section 21 as if it still exists. This is our foil.
- **Awareness has spiked but tools haven't shipped.** The "Renters' Rights effect" is real demand looking for product.

### 0.4 Go-to-market — because this is 2C, this section matters most

The honest answer: pure D2C acquisition for a one-off legal need is brutal. Renters don't search for "AI disrepair agent" until they have a problem, and at that moment they go to Citizens Advice, Shelter or Google. So GTM is three layered routes, pitched in this order:

**Route 1 — Lawhive partnership (lead with this, the obvious one).**
We become the intake-and-triage front door for renters within Lawhive's funnel. Here's the part that's easy to get wrong and that a sharp judge *will* probe: the value to Lawhive is **not maximum lead volume — it's *qualified* volume.** An agent that honestly filters out the non-cases and the not-yet-cases lowers Lawhive's cost-to-serve *more* than one that funnels everyone through. Self-servable cases stay self-served. Weak cases are told the truth and never become wasted solicitor time. Strong cases escalate *with a fully prepared case file, weak points already flagged*. We raise intake throughput **and** raise the average quality of what reaches a solicitor. We're not competing with Lawhive — we're the moat extension. (This pre-empts the obvious objection: "doesn't an agent that talks people out of claims cannibalise your leads?" No — it kills the leads you *lose money on* and sharpens the ones you don't.)

**Route 2 — Distribution through advocacy orgs.**
Shelter, Citizens Advice, Generation Rent, ACORN, Renters' Reform Coalition. They have the audience and the trust; they don't have the engineering. Co-brand or white-label. Citizens Advice's 1,800+ disrepair conversations a month are all people who'd benefit from honest triage — including the many who are better served by "here's why this isn't a claim, and here's the faster fix."

**Route 3 — Lettings agents and corporate landlords (counterintuitive, defensible).**
Professional letting agents want disrepair claims handled cleanly and fast — a well-formatted pre-action letter is easier to respond to than a confused angry email. Sell to the side with money. Reduces their cost of handling claims, reduces escalation risk. Most defensible commercial path long-term.

Lead the GTM pitch with Route 1 (Lawhive's on the panel). Gesture at 2 and 3 (GV / Balderton care about whether these are real — the numbers above say yes).

### 0.5 What the demo shows

**The thesis the demo must prove:** this is an agent that tells you the truth about your situation — *even when the truth is "you don't have a case."* Lawhive's own Track B brief says the first conversation isn't legal analysis, it's **recalibration**, and asks point-blank: "if the most useful thing an agent could do is talk someone out of pursuing the wrong claim, what does success look like?" We answer that on stage. The demo runs **two real cases from the provided scenario set** — one the agent honestly turns away, one it prepares and escalates — not a single hand-picked winner.

**Time: fit the actual slot.** Confirm the real per-team pitch time on the day — *assume it may be 5 minutes, not 8* — and rehearse both a 5-minute cut (drops the coda, trims the cold open) and the 8-minute cut below.

| Time | Beat | What's on screen |
|---|---|---|
| 0:00–0:40 | Cold open | "On 1 May this year, Section 21 was abolished. Renters got more rights than they've had in a generation. The system to exercise those rights wasn't built for them — and neither was the AI they'll reach for first." |
| 0:40–1:20 | **Wow 1: the honest "no"** | The hero moment, first. Run a *weak/borderline* provided case live. The agent does **not** manufacture a claim — it explains, with citations, why this isn't actionable (or why the prospects are poor), what the cheaper/faster non-legal step is, and when to come back. "The most useful thing this agent just did was stop someone wasting a year and a filing fee. That's access to justice too." |
| 1:20–2:00 | **The stale-AI point (reframed foil)** | Briefly, side-by-side: vanilla ChatGPT confidently cites Section 21 as live law. Not a cheap gag — the *category* argument: general models go stale silently, and in a regulated domain stale is malpractice. Ours is pinned to current statute and **shows its source on every legal claim.** |
| 2:00–4:30 | **Live flow — let a judge choose** | Invite a judge to pick which provided *strong* case to run. The agent ingests that case's actual documents (tenancy agreement, email chain, photos), asks only the questions that change the legal answer, runs a prospects assessment, classifies the hazard (HHSRS), names the statutory basis — citation visible. This is the "working prototype we can actually interact with" the rubric demands. |
| 4:30–5:30 | **Wow 2: the artefacts** | Pre-action protocol letter renders on screen, **every legal claim footnoted to a corpus source.** Pre-filled environmental-health complaint. Timeline of legal deadlines. *Citizens Advice gives advice; we produce a protocol-compliant, sendable letter.* |
| 5:30–6:30 | The Lawhive handoff | Agent recognises the case exceeds self-serve (e.g. vulnerable household member) and hands to a Lawhive solicitor *with the case file pre-prepared and the weak points flagged.* Cut to the solicitor's view of the same case file. This is Route 1 GTM built into the demo — and note what the solicitor receives: only the cases worth their time. |
| 6:30–7:10 | Coda (optional) | *Only if rock-solid:* ≤20 seconds on the 3D spatial layer — "and here's where this goes: evidence with spatial context." A glimpse of the roadmap, not a pillar. Cut entirely under time pressure. |
| 7:10–8:00 | Close (not a TAM slide) | "An agent that knows today's law, tells you the truth about your case, and prepares it properly when it's real. Disrepair is the wedge — this is Lawhive's honest intake brain for every kind of consumer legal problem. *That's* what access to justice looks like." Sit down. |

### 0.6 How the demo actually runs (operational)

- **The demo is interactive by design.** The rubric explicitly rewards "a working prototype we can actually interact with," so refusing all interaction is optimising *against* the judges. The controlled way to honour it: let a judge **choose which provided case to run** from a short list. Vetted inputs, genuine interactivity, no open text box where a demo dies.
- **Run against the provided synthetic cases and their documents**, not a single hard-coded "Sarah." Build the document-ingestion path so *any* of the day's cases can flow through. If the agent only works on one rehearsed script, it isn't a prototype — it's a video.
- **Reconcile the stack with what's provided.** The day's GCP environment and tooling are part of the brief, and Google/Gemini are on the panel. Deploy into the provided GCP environment (not just localhost) and have a crisp "right model for each job" answer — Claude for legal reasoning/drafting (Anthropic is judging, and it's strongest here), with at least one task routed through Gemini — so it never reads as ignoring the host's infrastructure.
- Agent responses are **real, not pre-recorded** — rehearse *both* cases ~30 times so timing and failure modes are known.
- **Failsafe 1:** pre-recorded video of the full flow, ready to cut to.
- **Failsafe 2:** the final case file is a static URL that loads instantly, so we can always end on a strong beat.
- We still don't take freeform Q&A *mid-demo* — but we *do* hand the judge a controlled choice, and we're ready for hard questions after.

### 0.7 The wow moments, in order

1. **The honest "no"** — the agent talks a weak case down, with citations and dignity. This is the moment that answers Lawhive's actual brief and that no one else in the room will show. Lead with it.
2. **Stale-AI as a category argument** — ChatGPT citing dead law, reframed: in regulated domains an out-of-date model is *dangerous*, and ours shows its source on every claim. Establishes why this has to exist.
3. **The letter** — a real, protocol-compliant pre-action letter, every claim footnoted, that the housing solicitors in the room would sign. Most AI demos generate fluffy advice; this generates correspondence.

Order matters: integrity (the "no") → credibility (current-law + sourced) → substance (the letter). The 3D spatial layer is a **roadmap coda, not a wow moment** — if it isn't bulletproof, it doesn't appear. A flashy scan at a panel that opened with "we're not judging on polish" costs more than it earns.

---

## 1. v1 goal

Get hands-on with every piece of the stack we'll touch on hack day, so we make zero infrastructure mistakes under time pressure.

**v1 is NOT** the polished product, the demo, or anything we show judges.
**v1 IS** a working scrappy end-to-end thing that proves we know how every component behaves, plus a lawyer-validated case file *and* a lawyer-validated "this isn't a claim" recalibration — the two together prove the Route 1 GTM (qualified escalation **and** honest filtering).

---

## 2. The stack

**Frontend:** Next.js + Tailwind on Vercel. Chat UI + document viewer.
**Backend:** Next.js API routes (Node) + Anthropic SDK. One repo, one deploy.
**LLM:**
- `claude-opus-4-7` for reasoning + letter drafting
- `claude-haiku-4-5-20251001` for classification + extraction
- Claude vision (Opus) for defect photo analysis

**Hack-day infrastructure (do not ignore):** Lawhive provides a GCP environment and tooling on the day, and Google/Gemini are on the panel. Plan to deploy into the provided GCP environment rather than only localhost, and make the model choice **deliberate and defensible**: Claude for legal reasoning + drafting (Anthropic is also judging, and it's strongest here), with at least one task — e.g. document extraction/OCR or photo analysis — routed through **Gemini** so the build visibly uses what the host gave us. "We used your environment and picked the right model for each job" beats "we ignored your stack." (For the prep sprint, localhost is fine; the GCP deploy is a hack-day task.)

**Legal corpus:** flat files in `/corpus`, loaded into context directly with **prompt caching enabled from day 1** (cached input cost drops from $5/MTok to $0.50/MTok — critical for dev budget).
- Renters' Rights Act 2025 (relevant sections)
- Landlord and Tenant Act 1985 ss.8–17
- Homes (Fitness for Human Habitation) Act 2018
- Housing Act 2004 Part 1 (HHSRS)
- Pre-Action Protocol for Housing Conditions Claims
- Defective Premises Act 1972 s.4

**Document output:** Markdown → rendered HTML preview + downloadable PDF.
**3D / spatial (v2 only, smoke-tested in v1):** Apple RoomPlan sample → USDZ → `usdzconvert` → GLB → `<model-viewer>` in web app.

---

## 3. Hard scope for v1

Build only this:

1. Single-page web app with chat interface
2. Claude agent with **4 tools**: `assess_prospects`, `classify_hazard`, `lookup_statute`, `draft_letter`. `assess_prospects` is the one that can return **"this is not (yet) an actionable claim"** with reasons — it is the heart of the product, not an afterthought.
3. **Document + photo ingestion.** User can paste/upload the evidence they already have — tenancy agreement, the landlord email chain, and up to 3 photos. Photos run through vision → structured defect record; documents are parsed for the facts that change the legal answer (start of tenancy, what was reported and when, the landlord's response). Build this against the **provided synthetic case files** so any of them can flow through, not just one script.
4. Agent produces, *when the case warrants it*, one pre-action protocol letter + one environmental-health complaint — **every legal claim footnoted to a corpus source.** When the case does *not* warrant it, the agent says so and explains the cheaper/faster non-legal step.
5. Both documents downloadable as PDF. **Build the PDF render path first (Day 1), not last** — it's the deceptively hard bit (fonts, page breaks, headless render).
6. Runs on localhost for the prep sprint. (Hack day: deploy into the provided GCP environment — see §2.)

**One disrepair sub-type only: damp and mould.** Other types get an honest "not yet supported." Non-negotiable for the *build*. (Note: of the 10 provided cases only one — Case 07 — is disrepair, and it's a **council** tenancy, so the Section 21 / Renters' Rights "why now" hook doesn't map cleanly onto it. Whether to widen scope, and which two cases to demo, is the subject of a dedicated council review — see `council-report` for cases.)

### Definition of done for v1

- [ ] Tenant can describe a damp/mould problem in chat
- [ ] Agent ingests at least one **provided case file** (documents + photos), not just a hand-typed script
- [ ] Upload 2–3 photos, agent analyses them
- [ ] Agent classifies hazard with HHSRS category + reasoning
- [ ] **Agent correctly recalibrates a weak/borderline case — tells the tenant, with reasons and citations, that it is *not* an actionable claim (or that prospects are poor), and what to do instead.** *This is the make-or-break capability.*
- [ ] Agent produces a pre-action protocol letter referencing statute, **with visible source citations**
- [ ] Agent produces an environmental health complaint
- [ ] Both downloadable as PDF
- [ ] **Lawyer hands-on test completed; case file marked up**
- [ ] **Lawyer answered both:** (a) "would you want to receive this case file as a Lawhive solicitor?" and (b) "does an agent that honestly filters out weak cases *help or hurt* you commercially?" (Route 1 GTM validation, incl. the recalibration-vs-leads tension)

---

## 4. Two-week sequence

### Week 1 — infrastructure familiarity

**Day 1 (3 hrs)**
- [ ] Scaffold Next.js + Tailwind, deploy hello-world to Vercel
- [ ] Wire `ANTHROPIC_API_KEY`, ship one Claude API call from a Next.js API route
- [ ] **Render a real PDF end-to-end today** (Claude text → Markdown → styled PDF download). This is the deceptively hard bit — fonts, page breaks, headless render. De-risk it first, not on Day 6.

**Day 2 (3 hrs)**
- [ ] Chat UI with streaming responses from Claude
- [ ] System prompt: "friendly assistant for tenants with disrepair issues"
- [ ] Outcome: streaming works, `messages` API understood

**Day 3 (3 hrs)**
- [ ] **Ingest a provided case file** (the synthetic disrepair scenario's documents — tenancy agreement, email chain — plus photos). Parse out the facts that change the legal answer.
- [ ] Photo upload + Claude vision. Prompt: "Analyse this photo for residential property defects. Return JSON: `{defect_type, severity, estimated_area, visible_features, confidence}`"
- [ ] Calibrate the vision prompt on real defect photos — but treat vision as an **add-on, not the spine.** The spine is documents-in → prospects verdict → letter-out.
- [ ] Outcome: multimodal messages + document ingestion + structured output understood

**Day 4 (3 hrs)**
- [ ] Tool use with the 4 tools (`assess_prospects`, `classify_hazard`, `lookup_statute`, `draft_letter`). Stubs fine to start.
- [ ] Outcome: tool-use loop understood. Spine of v2.

**Day 5 (2 hrs)**
- [ ] Assemble `/corpus` markdown files. Count tokens. Confirm fit.
- [ ] **Enable prompt caching on the corpus + system prompt + tool definitions.**
- [ ] Outcome: corpus is real, accessible, costed.

**Day 6 (4 hrs)**
- [ ] First real `assess_prospects`: case facts + evidence + corpus → traffic-light verdict (red/amber/green) with reasons. **Make it able to return RED** — test it on a deliberately weak scenario.
- [ ] First real `classify_hazard`: user description + photo analysis + relevant corpus → HHSRS category + reasoning
- [ ] First real `draft_letter`: case file → protocol-compliant pre-action letter, every claim footnoted to the corpus
- [ ] Outcome: end of week 1, legal reasoning core works on one **strong AND one weak** scenario

**Day 7 — rest OR practice hack**
- [ ] Optional: 4-hour throwaway practice hack with the team. Tests dynamics, not output.

### Week 2 — depth, lawyer validation, hack-day prep

**Day 8 (3 hrs)**
- [ ] Run system on 5 scenarios — **at least 2 of them weak/borderline.** Verify it correctly says "not a claim" / "poor prospects" and doesn't manufacture one. Log failures. List "weak spots" for v2.

**Day 9 (2 hrs) — Lawyer Session #1 (highest-stakes meeting of the prep period)**
- [ ] Sit a housing lawyer friend in front of v1 with **3 printed scenarios**
- [ ] Watch them use it. Don't talk.
- [ ] Print the letters. Get them red-penned.
- [ ] **Ask the Route 1 GTM validation questions:** (a) "Would you want this case file as a Lawhive solicitor?" and (b) "Does an agent that honestly filters out weak cases *help or hurt* Lawhive commercially?" (resolve the recalibration-vs-leads tension with a real lawyer)
- [ ] **Pressure-test the "no":** give the lawyer a weak/borderline case and check the agent's refusal is *correct* — a wrong "no" (turning away a real claim) is the worst failure mode.
- [ ] Marked-up letter + notes = the v2 spec.

**Day 10 (3 hrs)**
- [ ] Apply lawyer feedback to prompts and letter template
- [ ] Re-run 5 scenarios. Verify improvement.

**Day 11 (2 hrs) — Lawyer Session #2 (different lawyer if possible)**
- [ ] Compare reactions. Disagreements reveal contested vs settled law. Settled gets baked in; contested becomes "agent flags judgment call, recommends solicitor."

**Day 12 (OPTIONAL — only if the core is solid and rehearsed) — RoomPlan smoke test (engineer)**
- [ ] The 3D layer is a roadmap coda, not a pillar (see §0.7). Spend time here **only** if the two-case flow, PDF output, and the recalibration path are all bulletproof. If anything core is shaky, skip this entirely and rehearse instead.
- [ ] If proceeding: clone Apple WWDC '22 RoomPlan sample; scan a real room → USDZ → GLB → load in `<model-viewer>`; click-to-log-coordinates.
- [ ] **Do NOT integrate into the core flow.** Smoke test only — confirms the v2 pipeline exists for the ≤20s coda.

**Day 13 — assemble hack-day plan**
- [ ] Hour-by-hour plan for 30 May
- [ ] Pre-prepare "demo flat" scan asset (real flat, planted defects, clean scan)
- [ ] Draft demo script v2 (refined from §0.5)
- [ ] Record fallback demo video

**Day 14 — rest**
- [ ] Eat well, sleep early, arrive sharp.

---

## 5. Agent architecture (v1)

System prompt skeleton (refine with lawyer on Day 9):

```
You are a legal assistant for tenants in England dealing with housing disrepair.
You are NOT a solicitor. Your job is to give an honest, grounded, citation-backed
picture of a tenant's situation — including, when it is true, that they do NOT
have an actionable claim, or that their prospects are poor. You draft pre-action
documents only when the case warrants them, and you escalate to a human solicitor
when it warrants that. Your most valuable output is sometimes "don't pursue this —
here's why, and here's the faster fix." Recalibration over encouragement.

Tools available:
- assess_prospects(case_facts, evidence_summary): a prospects verdict — a traffic
    light (RED / AMBER / GREEN), the reasons, and what would change it.
    RED = not an actionable claim; AMBER = needs a missing fact or better evidence;
    GREEN = a real claim worth acting on.
- classify_hazard(description, evidence_summary): HHSRS category + reasoning
- lookup_statute(query): relevant sections from the corpus
- draft_letter(template_type, case_file): renders a letter or complaint

Reasoning loop:
1. Understand the situation. Ask only the questions that change the legal answer.
2. Analyse all evidence provided — photos, the tenancy agreement, the email chain.
3. Run assess_prospects FIRST. If RED: explain plainly, give the practical
   non-legal next step, and STOP — do not draft a claim letter.
4. If AMBER: name exactly what's missing and how to get it.
5. If GREEN: classify the hazard, look up the statutory basis, draft the documents.
6. Recommend next steps, including whether a solicitor is needed.

Hard rules:
- Never invent a statute. Every legal claim must cite a corpus source, and that
  citation must be VISIBLE to the user — no hidden reasoning.
- Use CURRENT law only. Section 21 was abolished (Renters' Rights Act 2025, in
  force 1 May 2026). Flag explicitly where the law is new and largely untested.
- Speak plain English. Explain any legal term the first time you use it; assume
  the user has never heard "pre-action protocol" or "HHSRS."
- When confidence is low, say so. Don't bluff. A wrong "you have a claim" is bad;
  a wrong "you don't" is worse — when unsure, route to a human, don't turn away.
- Letters follow the pre-action protocol format EXACTLY. A non-compliant Letter
  Before Action looks fine on the day and becomes a problem months later.
- Escalate to solicitor when: possession proceedings, vulnerable household,
  personal injury, claim value > £10,000, or genuine legal ambiguity.
```

Tool schemas in `/agent/tools.ts`. Use Anthropic's tool-use API as documented; no orchestration framework.

---

## 6. What I want from Claude (working norms for the build)

When running this plan in Claude Code or a project chat:

1. **One task at a time.** Each day's task is the unit.
2. **Ask before scope-expanding.** Surface, don't silently expand.
3. **Be honest about what doesn't work.** Better to redesign on day 2 than discover on day 9.
4. **Optimise for me learning the stack, not for code elegance.** v1 is throwaway. Comments > DRY.
5. **Flag every assumption on legal correctness.** Mark them so the lawyer can spot-check.
6. **Keep the corpus real.** Pull actual statute text from legislation.gov.uk. Don't paraphrase. Judges and lawyers will notice.

---

## 7. Risks tracked

- **Recalibration accuracy** — the "say no" verdict is now the hero of the demo, so a *wrong* "no" (telling someone with a real claim to stand down) is the worst failure mode. Test `assess_prospects` hard on borderline cases with the lawyer. A wrong "yes" is bad; a wrong "no" is worse.
- **Pre-action protocol compliance** — a non-compliant Letter Before Action looks fine on the day and becomes "a wound that surfaces months later." Getting the protocol exactly right is a primary Day 9/11 lawyer check, not a nicety.
- **Letter quality** — Day 9 lawyer test is make-or-break. If letter is far off, Day 10 = full template rewrite, not incremental tweaks.
- **Document ingestion robustness** — the demo runs on the *provided* case files chosen live by a judge. If ingestion only works on one rehearsed script, the interactivity claim collapses. Test against several provided scenarios.
- **Stack / infra mismatch** — building all-Anthropic + localhost when the host provides a GCP environment and Gemini is on the panel reads as ignoring the brief. Deploy on GCP; route at least one task to Gemini; have a crisp "right model for each job" answer (see §2, §0.6).
- **Vision API accuracy on mould photos** — a real unknown, but vision is now an *add-on*, not the spine. Calibrate it; don't let it block the core.
- **RoomPlan coda (optional)** — if USDZ→GLB is messy, drop the coda entirely. It must never block the core flow.
- **Team coordination** — engineer, lawyer, thinker have never built together. 30-min sync at end of each build day. Define each person's role *during the live demo* (driver, narrator, failsafe operator) — don't leave the third person idle.
- **Demo time budget** — confirm the actual per-team slot; rehearse a 5-min cut and an 8-min cut. Overrunning is an easy, avoidable loss.
- **Dev API spend** — with prompt caching enabled day 1, expect $20–40 across two weeks (without caching, $100+).

---

## 8. Slides we need ready for hack day

1. Title slide + team
2. The problem (one line: "6.2M renters experienced disrepair last year. The law changed weeks ago. The tools didn't — and the AI they'll reach for is confidently wrong.")
3. The product (one screenshot of the chat + a sourced letter — *and* the honest "no")
4. Live demo (fit the actual slot — see §0.5; have 5-min and 8-min cuts ready)
5. Why it moves access to justice (the honest-triage point) — *lead with this*, with TAM + Renters' Rights-effect numbers as support, not as the headline (see §0.2)
6. GTM — three routes, lead with Lawhive; address the "doesn't 'no' kill your leads?" question head-on (see §0.4)
7. What we built today vs what's next (the 3D spatial layer lives here, as roadmap)
8. Team + thanks

Total slides outside the live demo: ~6. Keep total speaking time inside the actual per-team slot.