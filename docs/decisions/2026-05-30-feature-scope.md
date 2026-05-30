# Decision: Demo feature scope (2026-05-30, demo day)

**Status:** APPROVED · **Mode:** hackathon scope-triage · **Owner:** Shumeng
**Context:** v1 core working (UI + Case Reality Report + Case 07 from cache), hours to
spare before the demo. Question: which of three candidate features to add.

## The lens

Every candidate is judged against the two assets that win this demo:

1. **Protect the hero beat** — the agent quoting Crystal's own signed
   *"I confirm that the above works have been carried out to my satisfaction"* form
   back at her. A fourth act competes with the one knife-twist in 3 minutes.
2. **Strengthen (never invert) the trust mechanic** — "the agent can't claim what it
   can't ground." For a lawyerless team, anything unmatchable to the file or corpus is
   a live landmine in front of a Lawhive judge.

## Decisions

| Feature | Verdict | Rationale |
|---|---|---|
| **3 — verdict-conditional Next Steps** | **IN (core)** | On-thesis, nearly free; polish on existing `recommendation` + evidence-gap checklist. Sharpens the access-to-justice close. |
| **1 — past similar cases** | **CUT this build** | Not a hallucination risk (the 6 `cases/reference/` PDFs are real/verified). Cut because it's a separate beat competing with the hero, and live-summarizing 143KB judgments can misstate a real holding with no lawyer to catch it. Stretch-only: cached, hand-written headnote summaries, verdict-panel only, never the spine — best as the closing "pick any case" dare or a 5-min slot. |
| **2 — numeric estimator (£/time/gains)** | **CUT** | Ungroundable — nothing in the file or corpus to string-match. The exact optimistic-quote behavior `brief.md` was scrapped for; one challenged number inverts the trust close live. Keep only qualitative procedural ranges in Act 3 prose ("typically several months to over a year; often no-win-no-fee"). |

## Feature 3 spec (what to build)

Render the existing `recommendation` as a verdict-branched **Next Steps** block, driven
by `prospects` + `recommendation`; the evidence-gap checklist feeds all three branches.

- **strong / self-serve** — "You can likely take the next step yourself." One concrete
  action + template/link.
- **arguable / escalate-to-solicitor** — "Take this to a Lawhive solicitor *with your
  prepared file*." List exactly what to hand over (report + evidence-gap checklist +
  named documents). **This is GTM Route 1 and the access-to-justice close, made literal.**
- **weak / reconsider-pursuing** — the honest no: why pursuing now costs more than it
  returns, and the one piece of evidence that would change that.

Case 07 (arguable → escalate) renders the middle branch: formal complaint → Housing
Ombudsman → independent damp survey → Pre-Action Protocol letter → escalate with file.

## Build order (hours-to-spare)

1. Implement Feature 3 verdict-branched Next Steps; verify on the Case 07 cache.
2. Lock + rehearse the 3-min spine unchanged (Feature 3 lives in Act 3, not a new act).
3. Feature 1 only if core is fully locked AND time remains — cached/verified panel for
   the closing dare, out of the spine.
4. Leave Feature 2 cut; confirm Act 3 prose keeps qualitative ranges only.

## Legal-correctness flags (no lawyer on team)

- Feature 2's ungroundable numbers were the primary legal-exposure risk — cutting removes it.
- Feature 3 stays in evidence/procedure (the safe, domain-general zone). Frame as "what
  a judge needs to see" and "your options," never "you will win/lose."
