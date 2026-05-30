<p align="center">
  <img src="https://steelman-legal.vercel.app/favicon.ico" width="48" alt="Steelman" />
</p>

<h1 align="center">Steelman</h1>

<img width="1797" height="930" alt="image" src="https://github.com/user-attachments/assets/21ea754c-f0d8-4d88-8c7a-3de98ea8d618" />

<p align="center">
  <strong>Every legal AI tells you you're right. We tell you how you'll lose.</strong>
</p>

<p align="center">
  <a href="https://steelman-legal.vercel.app">Live Demo</a> &middot;
  <a href="#quick-start">Quick Start</a> &middot;
  <a href="#architecture">Architecture</a> &middot;
  <a href="#features">Features</a> &middot;
  <a href="./PITCH.md">Pitch Deck</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Claude-Opus_4-d97706?logo=anthropic" alt="Claude" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000?logo=vercel" alt="Vercel" />
</p>

---

## The Problem

Legal services is a **$1 trillion** global market. **5.1 billion people** worldwide have an unmet justice need. More than half of everyone facing a legal problem cannot get help. Every AI tool on the market widens that gap by agreeing with the user. Steelman closes it.

Steelman argues the **opponent's best case against you** — grounded in your own documents — so you know where you really stand before you spend time and money you can't get back.

Built in one day at the [Lawhive Hackathon](https://hackathon.lhv.tools/) (30 May 2026) by a 3-person engineering team.

---

## Quick Start

### Prerequisites

- Node.js 20+ (tested on 25.x)
- npm 10+

### Installation

```bash
git clone https://github.com/richard7ao/Hivelaw_hackathon.git
cd Hivelaw_hackathon
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | For live intake chat | Claude API key for real-time case analysis |
| `STEELMAN_MODEL` | No | Model override (default: `claude-opus-4-8`) |
| `STEELMAN_EFFORT` | No | Thinking effort: `low` / `medium` / `high` (default: `high`) |

The demo dashboard and pre-cached case reports work without an API key.

### Production Build

```bash
npm run build
```

### Batch Runner

Generate Case Reality Reports for all cases in `/cases`:

```bash
npm run cases
```

Reports are written to `/reports` as Markdown and HTML.

---

## Architecture

```
                    +------------------+
                    |   Landing Page   |
                    |   steelman.app/  |
                    +--------+---------+
                             |
                    +--------v---------+
                    |    Dashboard     |
                    |     /demo        |
                    +--------+---------+
                             |
              +--------------+--------------+
              |                             |
    +---------v----------+       +----------v---------+
    |    Intake Chat     |       |    Case Report     |
    |    /demo/chat      |       |  /demo/report/:id  |
    | (Anthropic API)    |       | (Pre-cached data)  |
    +---------+----------+       +----------+----------+
              |                             |
              +-----------------------------+
                             |
                    +--------v---------+
                    |  Submission Flow |
                    +------------------+
                    |  Send Letter     |
                    |  Escalate        |
                    |  Share Link      |
                    +------------------+
```

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 + Tailwind CSS 4 |
| AI | Anthropic SDK (`claude-opus-4-8`) |
| Output | Structured JSON (`json_schema`, adaptive thinking) |
| Corpus | Verbatim statute text from legislation.gov.uk |
| Deployment | Vercel (Fluid Compute) |
| Language | TypeScript 5.7 |

### Anti-Hallucination Guard (Two-Tier)

| Tier | Target | Behaviour |
|---|---|---|
| Soft-fail | Steelman quotes | String-matched against case file. Unmatched = flagged with warning |
| Hard-fail | Legal citations | String-matched against closed corpus. Unmatched = **stripped entirely** |

A wrong statute is worse than no statute. A fabricated quote inverts the credibility claim. Both are caught before they reach the screen.

---

## Features

### Landing Page (`/`)

- Hero: "Everyone has a right to good legal advice" + access-to-justice framing
- Problem stats: $1T market, 5.1B unmet needs, sourced and cited
- Three-act product explanation
- Foil comparison table (AI chatbot vs Steelman)
- Trust mechanic section with honest-no verdict card
- GTM routes (Lawhive, advocacy orgs, lettings agents)
- Clickable sponsor/partner logos

### Dashboard (`/demo`)

- Case list with status badges (complete / in-progress / new)
- Prospects badges (strong / arguable / weak)
- Real case data from Claude-generated reports
- Unique URLs per case (`/demo/report/case-07`)

### Case Report (`/demo/report/[caseId]`)

Four tabs:

| Tab | Contents |
|---|---|
| **Overview** | Verdict (top), highlighted report body, tabbed analysis (for/against/summary), key references, recommended action (bottom) |
| **Documents** | Auto-loaded case files, PDF/image viewer, file upload, extracted evidence |
| **References** | Sticky report panel with cross-highlighting, supporting + counterargument references, full statute text, legislation.gov.uk links |
| **The Steelman** | Chain-of-argument accordion: opponent argues → quotes your own document → honest reply → contested marker |

### Submission Flows

**Send pre-action letter:**
- Full email compose view with editable body
- Removable attachment chips (all case documents)
- Statutory basis footer
- Send confirmation with green tick

**Escalate to Lawhive:**
- Split layout: case summary (left) + recommended solicitors (right)
- Real Lawhive lawyer profiles with photos
- "Request consultation" → green tick confirmation
- "Share report with solicitor" → copies unique URL to clipboard

### PDF Download

- Generates a styled HTML document (case assessment, arguments, letter, statutory basis)
- Prints via hidden iframe — only the report content, not the page chrome

### Floating Chat

- Steelman-branded chat bubble
- File upload via paperclip icon
- Messages trigger report regeneration with 3D spinner

---

## Project Structure

```
src/
  app/
    page.tsx                    # Landing page
    layout.tsx                  # Root layout (Spectral + Hanken Grotesk)
    demo/
      page.tsx                  # Dashboard
      chat/page.tsx             # Intake chat
      report/
        page.tsx                # Case report (4 tabs)
        [caseId]/page.tsx       # Dynamic case routing
  components/
    Nav.tsx                     # Fixed nav with Steelman logo
    SteelmanLogo.tsx            # Shield + suited-agent SVG
    Spinner.tsx                 # 3D rotating logo loader
    Reveal.tsx                  # Scroll-triggered animations
    Sponsors.tsx                # Clickable sponsor/partner strip
    demo/
      EntryChatShell.tsx        # Live Anthropic-backed intake
  lib/
    demo-context.tsx            # Shared React context
    demo-data.ts                # Mock data, references, lawyers
    case-data.ts                # Parsed real case reports (01 + 07)
    intake/                     # Live intake engine
      anthropic.ts              # Claude API integration
      prompt.ts                 # Intake system prompt
      schema.ts                 # Structured output schema
      fallback.ts               # Local fallback engine
      types.ts                  # TypeScript types
scripts/
  run-cases.ts                  # Batch runner (npm run cases)
corpus/                         # Verbatim statute text
cases/                          # Case files (PDFs, images, text)
reports/                        # Generated Case Reality Reports
public/
  case-07/                      # Served case documents
  lawyers/                      # Solicitor profile photos
```

---

## Cases

| Case | Title | Prospects | Recommendation |
|---|---|---|---|
| Case 01 | Deposit dispute — Jamie vs P Sullivan | Strong | Self-serve |
| Case 07 | Damp & mould — Crystal vs Council | Arguable | Escalate to solicitor |

Both cases use real Claude-generated reports with verified quotes and grounded citations.

---

## Legal Corpus

Verbatim statute text from legislation.gov.uk (no paraphrase):

- Landlord and Tenant Act 1985, ss. 9A, 11
- Housing Act 2004, Part 1 (HHSRS) + ss. 213-214 (deposits)
- Homes (Fitness for Human Habitation) Act 2018
- Pre-Action Protocol for Housing Conditions Claims
- Defective Premises Act 1972, s. 4

---

## Chat Agent

You can watch the Chat agent do it magic via [this video link](https://www.loom.com/share/d26d05af649e4061b13f9a650824491f)!

## Deployment

Deployed on Vercel with GitHub auto-deploy on push to `main`.

```bash
# Manual deploy
vercel --prod

# Set custom alias
vercel alias set <deployment-url> steelman-legal.vercel.app
```

**Live:** [steelman-legal.vercel.app](https://steelman-legal.vercel.app)

---

## Team

Built at the Lawhive Hackathon, Hoxton, London — 30 May 2026.

Three engineers, no lawyer. The credibility is structural: every quote matched, every citation from a closed corpus, anything ungrounded stripped.

---

## Sponsors & Partners

[Lawhive](https://lawhive.co.uk) &middot; [GV](https://www.gv.com) &middot; [Balderton](https://www.balderton.com) &middot; [Anthropic](https://www.anthropic.com) &middot; [Google Cloud](https://cloud.google.com) &middot; [Gemini](https://gemini.google.com) &middot; [Lovable](https://lovable.dev)

---

## Disclaimer

Steelman is a legal-assessment assistant, not a solicitor. It gives information, not advice. Always consult a qualified legal professional for advice specific to your situation.

---

## License

Private. Built for the Lawhive Hackathon 2026.
