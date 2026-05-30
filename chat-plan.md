# Entry Chat Plan

## Goal

Turn the current `/demo` stub into an adaptive intake chat that:

- lets a normal user describe their problem in plain English
- asks only the follow-up questions needed to reach a reliable assessment
- supports file upload from the start, but asks for documents explicitly when they matter
- shows dynamic progress toward final evaluation
- hands a structured payload to the later report-generation flow

## Repo Context

- `src/app/demo/page.tsx` is currently a placeholder shell for the live agent.
- The repo already has a strong visual system in `src/app/globals.css` plus shared chrome in `src/components/Nav.tsx` and `src/components/Sponsors.tsx`.
- `docs/steelman-plan.md`, `PITCH.md`, and `CLAUDE.md` all center the product on a three-act output:
  1. best case
  2. opponent steelman
  3. verdict / evidence-gap checklist / recommendation
- The repo posture is still `honest case-assessment assistant`, not solicitor. The intake flow should stay on the information / triage side of the line.
- Report rendering is already a separate concern, so this plan leaves clean scaffolding for that handoff instead of trying to own the final report UI.

## Design Constraint

Use the existing design, not a parallel scaffold.

- Keep `/demo` as the single entry point for the live product flow.
- Reuse the current typography, color tokens, spacing, borders, and card language from `globals.css`.
- Reuse the existing top nav and sponsor strip instead of inventing a separate app shell.
- Treat the current demo page as an evolution of the same product surface, not a brand-new mini app.
- Prefer a few focused components inside the existing page over lots of new routes or isolated scaffold pages.

## Cases Layer

Use `cases/` as the internal case-data layer that teaches the intake flow what good evidence looks like.

### What exists already

- `cases/rental/01/case_01_Problem_Statement.md`
- `cases/rental/07/case_07_Problem_Statement.md`
- attached PDFs, screenshots, and photos under each case folder

These case folders already contain the exact structure the intake agent needs to reason about:

- client problem in plain English
- normalized key facts
- document inventory
- examples of what supporting evidence actually looks like for each matter type

### How to use the cases layer

- Build a normalized manifest from `cases/**/*.md`.
- Use that manifest as an internal reference set for:
  - case-type pattern recognition
  - likely missing-fact prompts
  - likely useful file requests
  - recommended readiness thresholds
  - demo-mode seeded conversations
- Do not treat `cases/` as legal authority.
- Do treat `cases/` as the product's examples layer for what a complete matter bundle looks like.

### Why this matters

The chat should not ask for random documents. It should ask for the kinds of evidence the repo's own case bundles show are decision-changing:

- tenancy agreement
- bank statement or payment proof
- email chain
- signed form
- inspection report
- GP letter
- screenshots from scheme or service portals
- photos showing progression over time

## Anthropic Multimodal Architecture

Anthropic should be the intake engine for both chat reasoning and multimodal evidence review.

### Input strategy

- plain text from the composer
- parsed text for `md`, `txt`, and other straightforward text files
- native PDF `document` blocks for uploaded PDFs
- native `image` blocks for screenshots, photos, and scans

### Turn strategy

- Use the Anthropic Messages API for each intake turn.
- Use the Anthropic Files API for uploaded PDFs and images that need to persist across turns.
- Reference uploaded files by `file_id` instead of resending base64 payloads every time.
- Maintain a local session-level case record so later turns send structured context, not just raw chat history.

### Cases plus multimodal

- The user's own files are always the primary evidence.
- The `cases/` layer helps the agent know what to ask for next.
- The housing `corpus/` remains the legal grounding layer.

This gives three distinct layers:

1. `cases/` = example intake and evidence patterns
2. uploaded user files = actual case evidence
3. `corpus/` = legal grounding for supported domains

## Product Shape

The user experience should feel like a guided intake, not a generic chatbot.

1. The user lands on the entry chat and sees one strong prompt:
   - "Tell us what happened, what outcome you want, and upload anything important."
2. The AI reads the first message and decides between three paths:
   - enough info to evaluate now
   - enough to identify the case, but missing key facts
   - enough to identify missing evidence and ask for files
3. The UI keeps upload available at all times, but only turns it into a prominent ask when the AI can explain why a document would materially improve the result.
4. Once readiness is high enough, the flow switches into final evaluation and hands off to report generation.

## Core UX Flow

### 1. Entry chat

- Replace the disabled demo console with a real chat shell.
- Use a large first composer with attachment support by default.
- Keep the first-turn copy plain-English and non-legal.
- Show a lightweight progress bar immediately so the user understands this is moving toward an outcome, not endless conversation.

### 2. Clarification loop

- Ask 1 to 2 sharp follow-up questions at a time, never a giant questionnaire.
- Questions should target missing facts that change the analysis, such as:
  - what happened
  - who the other side is
  - timeline / dates
  - what evidence exists
  - what the user wants to achieve
  - what has already been sent, signed, or admitted
- If the first message is already rich enough, skip this loop entirely.

### 3. File request moments

- Upload is always available in the composer.
- The AI should explicitly ask for files only when it has a concrete reason, for example:
  - the user mentions a tenancy agreement, contract, letter, decision, email chain, invoice, or form
  - the likely winning or losing point depends on wording inside a document
  - the user describes a timeline but the strongest evidence will be in written correspondence
  - escalation would be materially stronger with supporting documents attached
- When the AI asks for files, the UI should explain what to upload and why.

### 4. Final evaluation

- Once the intake is sufficiently complete, move the session into a visible `final evaluation` state.
- Freeze the progress bar at a near-complete state while analysis runs.
- The user can still add more context, but the UI should make it clear the agent has enough to produce the first full assessment.

### 5. Report handoff

- After evaluation, hand a structured object to the report layer.
- The report UI itself can remain scaffolded for now.
- The handoff should support:
  - best-case argument
  - counter-argument / steelman
  - evidence gaps
  - prospects / recommendation
  - downstream actions like Lawhive escalation or submission preview later

## Dynamic Progress Model

The progress bar should not be a fixed stepper. It should reflect how complete the intake really is.

### Proposed readiness dimensions

Score intake completeness across these buckets:

- problem summary
- parties / opponent
- timeline / dates
- desired outcome
- existing evidence
- missing evidence
- prior actions already taken
- risk / urgency / deadlines

### Proposed behavior

- The backend returns a `readinessScore` from `0` to `100`.
- The backend also returns `currentStage`, for example:
  - `understanding-problem`
  - `clarifying-facts`
  - `collecting-evidence`
  - `ready-for-evaluation`
  - `final-evaluation`
  - `report-handoff`
- The UI progress bar uses both:
  - percentage fill from `readinessScore`
  - stage label from `currentStage`
- If the first user message covers enough ground, the score can jump straight to `ready-for-evaluation` and skip most of the intake loop.

### Important rule

The progress model should reward sufficiency, not conversation length. More messages should not mean more progress by default.

## AI Behavior Contract

The intake model should return structured decisions, not freeform chat alone.

### It should decide

- what it already knows
- what is still missing
- whether missing info is factual or documentary
- whether it is ready for final evaluation
- what single next question is highest value
- whether to surface a document request card

### It should avoid

- generic filler questions
- asking for every possible document up front
- long legal explanations before it understands the facts
- pretending certainty when the evidence is thin

### Good question pattern

- one direct question
- one sentence of why it matters
- optional upload request if a document would answer it faster than more chat

## File Upload UX

### Always available

- Keep an attachment button in the composer from the first screen.
- Support the core file types the team expects to work with first.
- Show uploaded files inline in the conversation state so the user knows they are part of the case record.
- On upload, classify each file into one of:
  - `text-source`
  - `pdf-document`
  - `image-evidence`
  - `unknown-needs-review`

### Prominent when explicitly requested

- On larger screens, show a right-side evidence panel only when the AI asks for documents.
- On smaller screens, show the request inline as a full-width card above the composer.
- Each request should say:
  - what file would help
  - why it matters
  - whether the user can continue without it

### Example prompts

- "If you have the tenancy agreement, upload it. The exact repair and notice wording may change the assessment."
- "If the landlord replied by email, the email chain is more useful than a summary because the dates and wording matter."
- "If you signed anything after the repair visit, upload that form. A signed acknowledgment may become the other side's strongest argument."

## Suggested Implementation Shape

### Route

- Keep `/demo` as the entry point and replace the placeholder content there.
- Do not add new top-level pages for intake, upload, or progress.

### Client-side pieces

- `src/app/demo/page.tsx`
  - top-level shell for the intake chat experience
- `src/components/chat/EntryChatShell.tsx`
  - owns local session state and high-level layout
- `src/components/chat/ProgressBar.tsx`
  - dynamic readiness display
- `src/components/chat/MessageThread.tsx`
  - user / assistant message rendering
- `src/components/chat/Composer.tsx`
  - text input plus attachments
- `src/components/chat/EvidenceRequestPanel.tsx`
  - bigger-screen document request surface
- `src/components/chat/ReadinessBanner.tsx`
  - "we have enough to evaluate" transition state
- `src/components/chat/ReportHandoffCard.tsx`
  - placeholder entry into the colleague-owned report flow

These should inherit the existing demo page's tone and layout language. If some of them collapse naturally into one file during implementation, keep them combined.

### Server-side pieces

- `src/app/api/intake/route.ts`
  - one conversational turn in, one structured intake decision out
- `src/lib/intake/prompt.ts`
  - system prompt for intake behavior
- `src/lib/intake/schema.ts`
  - zod or typed contract for the intake response
- `src/lib/intake/progress.ts`
  - readiness scoring helpers
- `src/lib/intake/files.ts`
  - file classification plus Anthropic file-reference helpers
- `src/lib/cases/manifest.ts`
  - normalized case metadata derived from `cases/**/*.md`
- `src/lib/report/types.ts`
  - shared types for the later report-generation payload

### Suggested build support

- add a small manifest builder script if needed, but keep it simple
- derive a structured object from each `case_*_Problem_Statement.md` file:
  - title
  - case type
  - claimant summary
  - key facts
  - expected evidence types
  - document inventory

## Suggested Intake Response Contract

```ts
type IntakeTurnResult = {
  currentStage:
    | "understanding-problem"
    | "clarifying-facts"
    | "collecting-evidence"
    | "ready-for-evaluation"
    | "final-evaluation"
    | "report-handoff";
  readinessScore: number;
  caseSummary: string;
  knownFacts: string[];
  missingFacts: string[];
  followUpQuestions: Array<{
    question: string;
    reason: string;
  }>;
  fileRequests: Array<{
    title: string;
    reason: string;
    optional: boolean;
  }>;
  canEvaluateNow: boolean;
  evaluationPayload?: {
    bestCaseInput: string;
    steelmanInput: string;
    evidenceContext: string[];
  };
  reportScaffold?: {
    bestCase?: string;
    counterArgument?: string[];
    evidenceGaps?: string[];
    recommendation?: string;
  };
};
```

## Report Scaffolding

The colleague-owned report flow should receive a stable input object instead of depending on raw chat history.

### Minimum handoff payload

- normalized case summary
- extracted timeline
- uploaded-file inventory
- file references and their classified type
- key evidence quotes or placeholders for them
- best-case draft input
- steelman draft input
- evidence gaps
- prospects recommendation

This keeps the entry chat independent from however the final report gets rendered.

## Desktop vs Mobile

### Mobile

- single-column chat
- progress bar pinned near the top
- file requests inline in the thread
- report handoff as a bottom sheet or stacked card

### Desktop

- two-column layout once the chat has enough context
- left: thread and composer
- right: progress, missing-info summary, evidence request panel, report handoff status
- when the AI wants files, this right rail becomes the prominent upload target

## Recommended Build Order

1. Parse `cases/**/*.md` into a lightweight manifest so the intake flow has an internal examples layer.
2. Replace `/demo` stub with a real client-side chat shell that keeps the existing design language.
3. Add the structured Anthropic intake API contract and readiness scoring.
4. Add file upload plumbing, Anthropic file handling, and the explicit evidence-request UI.
5. Add the `ready for evaluation` transition and `final evaluation` loading state.
6. Add report handoff scaffolding and placeholder render contract for your colleague.

## Out of Scope For This Slice

- full report rendering
- Lawhive API submission
- court submission flow
- production-grade document parsing for every format
- full legal grounding / quote verification pipeline inside the intake layer

Those can plug in after the entry chat and evaluation contract are stable.

## Definition Of Good

- A user can paste a long first message and jump straight to evaluation if it is enough.
- A user with sparse info gets concise, high-value follow-up questions.
- Upload is available from the first screen but only becomes a big call-to-action when evidence is actually needed.
- The progress bar reflects sufficiency, not message count.
- The final output cleanly feeds best case, steelman, and report generation without coupling the chat UI to the report UI.
- The intake flow looks like the existing Steeleman product, not a bolted-on prototype with unrelated scaffolding.
- The AI's document requests feel grounded in the evidence patterns already present in `cases/`.
