# Lawhive Hackathon — v1 Learning Sprint + Pitch Plan

**Hackathon date:** 30 May 2026 — Lawhive HQ, Hoxton, London
**Track:** B (Know Your Rights) — renters' rights, anchored on disrepair (damp & mould)
**Team:** Thinker + Engineer + Lawyer
**Sponsors / judges:** Anthropic, Google Cloud, Gemini, Lovable, GV, Balderton, Lawhive
**Prizes:** £5,000 first, £2,500 second, £1,000 third

---

## 0. The pitch (write this first, build to it)

The plan below was rebuilt after a sharp piece of feedback: the build plan came before the pitch. That's backwards. The pitch tells you what to build. This section is the answer to the five questions every judge will ask, and every engineering decision flows from it.

### 0.1 What the product is, in one sentence

A web app where a renter describes a disrepair problem in plain English, uploads photo evidence, and gets back a legally-grounded explanation of their rights plus sendable pre-action documents — and a clean handoff to a Lawhive solicitor when the case warrants it.

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
We become the intake-and-triage front door for renters within Lawhive's funnel. Self-servable cases stay self-served. Cases that need a solicitor escalate to Lawhive *with a fully prepared case file*. This 10x's Lawhive's intake throughput and lowers cost-to-serve per case. We're not competing with Lawhive — we're the moat extension.

**Route 2 — Distribution through advocacy orgs.**
Shelter, Citizens Advice, Generation Rent, ACORN, Renters' Reform Coalition. They have the audience and the trust; they don't have the engineering. Co-brand or white-label. Citizens Advice's 1,800+ disrepair conversations a month are all qualified leads who'd benefit from the tool.

**Route 3 — Lettings agents and corporate landlords (counterintuitive, defensible).**
Professional letting agents want disrepair claims handled cleanly and fast — a well-formatted pre-action letter is easier to respond to than a confused angry email. Sell to the side with money. Reduces their cost of handling claims, reduces escalation risk. Most defensible commercial path long-term.

Lead the GTM pitch with Route 1 (Lawhive's on the panel). Gesture at 2 and 3 (GV / Balderton care about whether these are real — the numbers above say yes).

### 0.5 What the demo shows

**Total length: 8 minutes. Tightly scripted.**

| Time | Beat | What's on screen |
|---|---|---|
| 0:00–0:45 | Cold open | "On 1 May this year, Section 21 was abolished. Renters got more rights than they've had in a generation. The system to exercise those rights wasn't built for them. Tonight we're showing what changes when a renter in a damp flat at 11pm has Lawhive in their pocket." |
| 0:45–1:30 | **Wow 1: ChatGPT foil** | Second screen: ask ChatGPT about a Section 21 notice. It confidently explains a law that no longer exists. Sets up: current AI cannot be trusted on this domain. |
| 1:30–4:30 | Live flow | Tenant persona "Sarah" describes the situation. Agent asks 2 clarifying questions. Sarah uploads 3 photos. Agent analyses, classifies the hazard, names the statutory basis. |
| 4:30–5:30 | **Wow 2: the artefacts** | Pre-action protocol letter renders on screen. Pre-filled environmental health complaint. Timeline of legal deadlines. *These do not exist anywhere else.* Citizens Advice gives advice; we produce a sendable letter. |
| 5:30–6:30 | **Wow 3: the spatial layer** | Load the 3D scan of Sarah's flat with defects pre-pinned. Rotate. Click a pin — photo + AI analysis appears. "Not a photo, evidence with spatial context. The landlord can't claim the damage isn't there." |
| 6:30–7:30 | The Lawhive handoff | Agent recognises case exceeds self-serve (vulnerable household member). Hands to a Lawhive solicitor with the case file pre-prepared. Cut to the solicitor's view of the same case file. *This is Route 1 GTM built into the demo.* |
| 7:30–8:00 | Close + TAM slide | "Three weeks of new law. One agent. Built in a day. 6.2M renters. £hundreds of millions of unmet legal need. This is what access to justice looks like." Sit down. |

### 0.6 How the demo actually runs (operational)

- Whole demo runs **locally** on the laptop, not over the internet.
- Flat photos and 3D scan are **pre-captured assets** in `/demo-assets`.
- Tenant inputs typed live, but **rehearsed** to the exact words. We know which clarifying questions the agent asks.
- Agent responses are **real, not pre-recorded** — but we've run this flow 30 times so timing and failure modes are known.
- **Failsafe 1:** pre-recorded video of full demo plays on the second screen with sound off, ready to cut to.
- **Failsafe 2:** the final case file is a static URL that loads instantly, so we can always end on the strongest beat.
- We do NOT take questions during the demo. We do NOT let a judge type something in. Both are where demos die.

### 0.7 The three wow moments, in order

1. **ChatGPT foil getting Section 21 wrong** — cheap, effective, establishes the problem with stale AI.
2. **The letter** — a real pre-action protocol letter, correctly cited, that the housing solicitors in the room would sign. Most AI demos generate fluffy advice; this generates correspondence.
3. **Spatial evidence pin opening to reveal AI-tagged damage** — the visceral one. Judges haven't seen 3D + AI vision + legal classification before. This is the Twitter moment.

Order matters: credibility (foil) → substance (letter) → awe (spatial). If you flip substance and awe, judges remember the awe but doubt the substance.

---

## 1. v1 goal

Get hands-on with every piece of the stack we'll touch on hack day, so we make zero infrastructure mistakes under time pressure.

**v1 is NOT** the polished product, the demo, or anything we show judges.
**v1 IS** a working scrappy end-to-end thing that proves we know how every component behaves, plus a lawyer-validated case file that proves the Route 1 GTM.

---

## 2. The stack

**Frontend:** Next.js + Tailwind on Vercel. Chat UI + document viewer.
**Backend:** Next.js API routes (Node) + Anthropic SDK. One repo, one deploy.
**LLM:**
- `claude-opus-4-7` for reasoning + letter drafting
- `claude-haiku-4-5-20251001` for classification + extraction
- Claude vision (Opus) for defect photo analysis

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
2. Claude agent with **3 tools**: `classify_hazard`, `lookup_statute`, `draft_letter`
3. User uploads up to 3 photos; each runs through Claude vision → structured defect record
4. Agent generates one pre-action protocol letter + one environmental health complaint
5. Both downloadable as PDF
6. Runs on localhost. No auth, no DB, no deploy.

**One disrepair sub-type only: damp and mould.** Other types get "not yet supported." Non-negotiable.

### Definition of done for v1

- [ ] Tenant can describe a damp/mould problem in chat
- [ ] Upload 2–3 photos, agent analyses them
- [ ] Agent classifies hazard with HHSRS category + reasoning
- [ ] Agent produces a pre-action protocol letter referencing statute
- [ ] Agent produces an environmental health complaint
- [ ] Both downloadable as PDF
- [ ] **Lawyer hands-on test completed; case file marked up**
- [ ] **Lawyer answered: "would you want to receive this case file as a Lawhive solicitor and would you pay for the warm lead?"** (Route 1 GTM validation)

---

## 4. Two-week sequence

### Week 1 — infrastructure familiarity

**Day 1 (2 hrs)**
- [ ] Scaffold Next.js + Tailwind, deploy hello-world to Vercel
- [ ] Wire `ANTHROPIC_API_KEY`, ship one Claude API call from a Next.js API route

**Day 2 (3 hrs)**
- [ ] Chat UI with streaming responses from Claude
- [ ] System prompt: "friendly assistant for tenants with disrepair issues"
- [ ] Outcome: streaming works, `messages` API understood

**Day 3 (3 hrs)**
- [ ] Photo upload + Claude vision
- [ ] Prompt: "Analyse this photo for residential property defects. Return JSON: `{defect_type, severity, estimated_area, visible_features, confidence}`"
- [ ] **Calibrate the prompt on 20 real defect photos.** This is the single most important pre-work.
- [ ] Outcome: multimodal messages + structured output understood

**Day 4 (3 hrs)**
- [ ] Tool use with the 3 tools. Stubs fine — `classify_hazard` returns hardcoded JSON.
- [ ] Outcome: tool-use loop understood. Spine of v2.

**Day 5 (2 hrs)**
- [ ] Assemble `/corpus` markdown files. Count tokens. Confirm fit.
- [ ] **Enable prompt caching on the corpus + system prompt + tool definitions.**
- [ ] Outcome: corpus is real, accessible, costed.

**Day 6 (4 hrs)**
- [ ] First real `classify_hazard`: user description + photo analysis + relevant corpus → HHSRS category + reasoning
- [ ] First real `draft_letter`: case file → structured pre-action letter
- [ ] Outcome: end of week 1, legal reasoning core works on one scenario

**Day 7 — rest OR practice hack**
- [ ] Optional: 4-hour throwaway practice hack with the team. Tests dynamics, not output.

### Week 2 — depth, lawyer validation, hack-day prep

**Day 8 (3 hrs)**
- [ ] Run system on 5 real disrepair scenarios. Log failures. List "weak spots" for v2.

**Day 9 (2 hrs) — Lawyer Session #1 (highest-stakes meeting of the prep period)**
- [ ] Sit a housing lawyer friend in front of v1 with **3 printed scenarios**
- [ ] Watch them use it. Don't talk.
- [ ] Print the letters. Get them red-penned.
- [ ] **Ask the Route 1 GTM validation question:** "Would you want this case file as a Lawhive solicitor, and would you pay for the warm lead?"
- [ ] Marked-up letter + notes = the v2 spec.

**Day 10 (3 hrs)**
- [ ] Apply lawyer feedback to prompts and letter template
- [ ] Re-run 5 scenarios. Verify improvement.

**Day 11 (2 hrs) — Lawyer Session #2 (different lawyer if possible)**
- [ ] Compare reactions. Disagreements reveal contested vs settled law. Settled gets baked in; contested becomes "agent flags judgment call, recommends solicitor."

**Day 12 (4 hrs) — RoomPlan smoke test (engineer)**
- [ ] Clone Apple WWDC '22 RoomPlan sample
- [ ] Scan a real room → USDZ → GLB → load in `<model-viewer>`
- [ ] Implement click-to-log-coordinates
- [ ] **Do NOT integrate into v1.** Smoke test only — confirms v2 pipeline is buildable.

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
You are NOT a solicitor. You give grounded, citation-backed information about a
tenant's rights and draft pre-action documents on their behalf. You escalate to
a human solicitor when the case warrants it.

Tools available:
- classify_hazard(description, evidence_summary): HHSRS category + reasoning
- lookup_statute(query): relevant sections from the corpus
- draft_letter(template_type, case_file): renders a letter or complaint

Reasoning loop:
1. Understand the situation. Ask only the questions that change the legal answer.
2. Analyse uploaded evidence (photos, messages).
3. Classify the hazard.
4. Look up the relevant statutory basis.
5. When you have enough information, draft the appropriate documents.
6. Recommend next steps including whether a solicitor is needed.

Hard rules:
- Never invent a statute. Every legal claim must come from a corpus citation.
- When confidence is low, say so. Don't bluff.
- Letters follow the pre-action protocol format exactly.
- Escalate to solicitor when: possession proceedings, vulnerable household,
  personal injury, claim value > £10,000.
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

- **Vision API accuracy on mould photos** — biggest unknown. Day 3 calibration buys 80% of v2's quality. Allocate extra time if needed.
- **Letter quality** — Day 9 lawyer test is make-or-break. If letter is far off, Day 10 = full template rewrite, not incremental tweaks.
- **RoomPlan smoke test (Day 12)** — if USDZ→GLB is messy, fall back to pre-prepared GLB on hack day. Don't let this block v1.
- **Team coordination** — engineer, lawyer, thinker have never built together. 30-min sync at end of each build day.
- **Dev API spend** — without caching, debugging the agent could burn $100+. With caching enabled day 1, expect $20–40 across two weeks.

---

## 8. Slides we need ready for hack day

1. Title slide + team
2. The problem (one stat: "6.2M renters experienced disrepair last year. The law changed three weeks ago. The tools didn't.")
3. The product (one screenshot of the chat + letter)
4. Live demo (8 min — see §0.5)
5. TAM + Renters' Rights effect numbers (see §0.2)
6. GTM — three routes, lead with Lawhive (see §0.4)
7. What we built today vs what's next
8. Team + thanks

Total slides outside the live demo: ~6. Total speaking time including demo: 10 minutes.