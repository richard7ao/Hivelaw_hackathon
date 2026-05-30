# Steeleman

Legal case assessment demo for the Lawhive hackathon (30 May 2026).

## Quick start

```bash
git clone https://github.com/richard7ao/Steeleman_hackathon.git

npm install
```

Next.js, React, and Tailwind need to be installed (they're not in package.json yet):

```bash
npm install next react react-dom tailwindcss @tailwindcss/postcss
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

| URL | What it is |
|-----|-----------|
| `/` | Landing page (pitch deck scroll) |
| `/demo` | Dashboard — case list with status badges |
| `/demo/chat` | Entry chat — describe your legal issue |
| `/demo/research` | Research results — selectable statute provisions |
| `/demo/report` | File upload + highlighted case report |
| `/demo/analysis` | Final analysis — for/counter, decision fork, submit |

All demo screens use mock data. No API key needed to run the frontend.

## Batch runner (optional)

Runs real cases through Claude and generates Case Reality Reports.

```bash
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm run cases
```

Reports are written to `/reports`.

## Stack

- Next.js + React + Tailwind CSS
- Anthropic SDK (for batch runner)
- TypeScript
