/**
 * The Steelman — batch runner.
 *
 * Reads every case in /cases, sends it through Claude with the three-act
 * "Case Reality" prompt, and writes a readable report per case into /reports
 * plus a combined index. This is the artifact the lawyer red-pens: it tells
 * you which cases produce a sound steelman and which to cut from the live demo.
 *
 * Run:  ANTHROPIC_API_KEY=sk-ant-... npm run cases
 * (or put the key in a .env file in the repo root — see .env.example)
 *
 * --- Document ingestion (NEW) -------------------------------------------------
 * Cases are now BUNDLES, not lone markdown files. A bundle is a directory that
 * contains a `*_Problem_Statement.md` plus the client's supporting documents.
 * We currently have full document sets for rental case 01 and 07. For each
 * bundle we:
 *   - read the problem statement (the client's account), AND
 *   - extract the TEXT from every sibling .pdf via the `pdftotext` CLI, and
 *     append it (clearly delimited) to the case text we send to Claude.
 * Images (the deposit-scheme screenshots, the mould photos) are NOT ingested —
 * v1 is text-only (no vision) — but they're listed in the report manifest, and
 * the problem statement's "Documents Provided" table already describes them.
 *
 * Why this matters for the demo: the killer steelman quote ("I confirm that the
 * above works have been carried out to my satisfaction") lives in case 07's
 * contractor_works_form.pdf, NOT in the problem statement. Ingesting the PDF
 * text is what lets the agent quote her own signed form back at her — and what
 * lets the anti-hallucination guard verify that quote verbatim.
 *
 * v1 is deliberately dumb and sequential-ish (small concurrency pool). No DB,
 * no framework. Comments > cleverness — this is throwaway scaffolding.
 */

import Anthropic from "@anthropic-ai/sdk";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const MODEL = process.env.STEELMAN_MODEL ?? "claude-opus-4-8";
const EFFORT = process.env.STEELMAN_EFFORT ?? "high"; // low|medium|high|xhigh|max
const CONCURRENCY = Number(process.env.STEELMAN_CONCURRENCY ?? "3");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const CASES_DIR = path.join(REPO_ROOT, "cases");
const REPORTS_DIR = path.join(REPO_ROOT, "reports");
const CORPUS_DIR = path.join(REPO_ROOT, "corpus");

// Load the legal corpus (real statute text, verbatim from legislation.gov.uk).
// Concatenated into one blob: it's injected into the prompt AND is the text every
// legal-citation quote is string-matched against. If a citation quote isn't in
// here, it gets STRIPPED (a wrong statute is worse than no statute).
const CORPUS_TEXT = loadCorpus(CORPUS_DIR);

// Tiny .env loader so you don't need a dependency or to export the key by hand.
loadDotEnv(path.join(REPO_ROOT, ".env"));

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(
    "Missing ANTHROPIC_API_KEY. Put it in a .env file (see .env.example) or export it, then re-run.",
  );
  process.exit(1);
}

// Document ingestion leans on the `pdftotext` CLI (poppler). Probe for it up
// front so we can warn loudly rather than silently shipping document-less cases.
const HAVE_PDFTOTEXT = checkPdftotext();

const client = new Anthropic();

// ---------------------------------------------------------------------------
// The three-act prompt (the keystone — same text the lawyer validates).
// Kept here so the lawyer's hand-run and this script test the SAME artifact.
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are an honest case-assessment assistant for a person in England with a
consumer legal dispute. You are NOT their solicitor. Your job is to show them
the truth about their case — including how the other side will attack it —
before they spend time and money they can't get back.

You will be given the full text of a case file: the client's account, PLUS the
extracted text of their supporting documents (each delimited by a "SUPPORTING
DOCUMENT:" header). Work ONLY from what is in the file. Never invent facts,
statutes, or quotes. When you quote for a steelman point, you may quote from
EITHER the client's account OR any supporting document — both are part of the
case file the opponent can weaponise.

Produce, via the provided tool/output format:

1. best_case: the client's single strongest position, in plain English (2-4 sentences).
2. opponent_steelman: an array of the 2-4 strongest arguments the OTHER SIDE will
   make. Each item has "argument" (plain English) and "source_quote" — text that
   appears VERBATIM in the case file (quote the client's own document/account that
   the opponent will weaponise). If you cannot ground an argument in a verbatim
   quote from the file, do not include it.
3. evidence_gaps: an array of concrete, actionable things the client should get or
   do to close each weakness (e.g. "Obtain an independent damp survey").
4. prospects: one of "strong" | "arguable" | "weak", plus prospects_reason (one sentence).
5. recommendation: one of "self-serve" | "escalate-to-solicitor" | "reconsider-pursuing",
   plus recommendation_detail covering the realistic cost / time / effort the client faces.
6. legal_basis: an array of statutory grounding for the case. Each item has
   "citation" (e.g. "Housing Act 2004, s.214(4)") and "source_quote" — text that
   appears VERBATIM in the LEGAL CORPUS below (NOT the case file). Cite ONLY from
   the corpus. If no corpus provision applies (e.g. a non-housing case), return an
   empty array — do NOT cite a statute from memory. A wrong statute is worse than
   none. Individual opponent_steelman items may also carry an optional "legal_basis"
   array of the same shape where a specific statutory point grounds that argument.

Ground every legal point in evidence and procedure (burden of proof, what a judge
needs to see, limitation periods, pre-action conduct). Where the corpus directly
supports a point, cite it via legal_basis with a verbatim quote. When unsure, say so.

==================== LEGAL CORPUS (cite ONLY from this) ====================
${CORPUS_TEXT}
==================== END LEGAL CORPUS ====================`;

// Structured-output schema. output_config.format guarantees the first text
// block is valid JSON matching this shape — no fragile parsing.
const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    best_case: { type: "string" },
    opponent_steelman: {
      type: "array",
      items: {
        type: "object",
        properties: {
          argument: { type: "string" },
          source_quote: { type: "string" },
          legal_basis: {
            type: "array",
            items: {
              type: "object",
              properties: {
                citation: { type: "string" },
                source_quote: { type: "string" },
              },
              required: ["citation", "source_quote"],
              additionalProperties: false,
            },
          },
        },
        required: ["argument", "source_quote", "legal_basis"],
        additionalProperties: false,
      },
    },
    evidence_gaps: { type: "array", items: { type: "string" } },
    prospects: { type: "string", enum: ["strong", "arguable", "weak"] },
    prospects_reason: { type: "string" },
    recommendation: {
      type: "string",
      enum: ["self-serve", "escalate-to-solicitor", "reconsider-pursuing"],
    },
    recommendation_detail: { type: "string" },
    legal_basis: {
      type: "array",
      items: {
        type: "object",
        properties: {
          citation: { type: "string" },
          source_quote: { type: "string" },
        },
        required: ["citation", "source_quote"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "best_case",
    "opponent_steelman",
    "evidence_gaps",
    "prospects",
    "prospects_reason",
    "recommendation",
    "recommendation_detail",
    "legal_basis",
  ],
  additionalProperties: false,
} as const;

type LegalBasis = { citation: string; source_quote: string };
type SteelmanPoint = {
  argument: string;
  source_quote: string;
  legal_basis: LegalBasis[];
};
type CaseReport = {
  best_case: string;
  opponent_steelman: SteelmanPoint[];
  evidence_gaps: string[];
  prospects: "strong" | "arguable" | "weak";
  prospects_reason: string;
  recommendation: "self-serve" | "escalate-to-solicitor" | "reconsider-pursuing";
  recommendation_detail: string;
  legal_basis: LegalBasis[];
};

// One document inside a case bundle.
type DocInfo = {
  name: string;
  kind: "pdf" | "image" | "image-folder" | "other";
  included: boolean; // did its text make it into the case file we sent Claude?
  chars?: number; // extracted-text length (pdf)
  count?: number; // image count (image-folder)
};

// A case bundle: the client's account plus its supporting documents.
type Bundle = {
  id: string; // e.g. "rental-01" (derived from the folder path under cases/)
  title: string; // first # heading in the problem statement
  dir: string;
  caseText: string; // problem statement + every ingested PDF's text
  docs: DocInfo[];
};

type BundleResult = {
  id: string;
  title: string;
  ok: boolean;
  verifiedAll: boolean;
  prospects?: string;
  recommendation?: string;
  docCount?: number;
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  await mkdir(REPORTS_DIR, { recursive: true });

  const problemFiles = findProblemStatements(CASES_DIR);
  if (problemFiles.length === 0) {
    console.error(
      `No *_Problem_Statement.md files found under ${CASES_DIR}. ` +
        `Each case is a folder containing a problem statement + its documents.`,
    );
    process.exit(1);
  }

  const bundles = problemFiles.map(loadBundle);

  console.log(
    `Running ${bundles.length} case bundle(s) through ${MODEL} ` +
      `(effort=${EFFORT}, concurrency=${CONCURRENCY})…\n`,
  );
  for (const b of bundles) {
    const pdfs = b.docs.filter((d) => d.kind === "pdf" && d.included);
    const skipped = b.docs.filter((d) => !d.included);
    console.log(
      `  • ${b.id}: ${pdfs.length} PDF(s) ingested` +
        (skipped.length ? `, ${skipped.length} non-text item(s) noted (images)` : ""),
    );
  }
  console.log("");

  const results: BundleResult[] = [];

  // Simple concurrency pool — process `bundles` CONCURRENCY at a time.
  let cursor = 0;
  async function worker() {
    while (cursor < bundles.length) {
      const bundle = bundles[cursor++];
      const res = await runOne(bundle).catch((err) => {
        console.error(`✗ ${bundle.id} — ${err?.message ?? err}`);
        return { id: bundle.id, title: bundle.title, ok: false, verifiedAll: false };
      });
      results.push(res as BundleResult);
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, CONCURRENCY) }, worker));

  await writeIndex(results);

  const good = results.filter((r) => r.ok && r.verifiedAll).length;
  const quoteIssues = results.filter((r) => r.ok && !r.verifiedAll).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(
    `\nDone. ${good} clean, ${quoteIssues} with unverified quotes (review!), ${failed} failed.`,
  );
  console.log(`Reports in: ${path.relative(process.cwd(), REPORTS_DIR)}/`);
}

async function runOne(bundle: Bundle): Promise<BundleResult> {
  const caseText = bundle.caseText;
  const started = Date.now();

  const response = await client.messages.create({
    model: MODEL,
    // adaptive thinking spends tokens too, so give headroom for thinking + the
    // JSON output. 16000 stays under the non-streaming timeout threshold.
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    // effort lives inside output_config (per the API). Cast keeps tsx happy
    // regardless of the installed SDK's exact typing.
    output_config: {
      effort: EFFORT,
      format: { type: "json_schema", schema: OUTPUT_SCHEMA },
    },
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        // Cache the system prompt (prompt + injected corpus). Whether it actually
        // caches depends on clearing Opus's ~4096-token minimum prefix — the
        // current corpus (~2-3k tokens) may still be just under it, in which case
        // this is a harmless no-op. Check usage.cache_read_input_tokens: if it's
        // 0 across cases, the prefix is too short to cache (fine). As the corpus
        // grows past the minimum, every case after the first reads it at ~0.1x.
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Here is the full case file (the client's account plus the extracted text of their supporting documents). Produce the Case Reality assessment.\n\n${caseText}`,
      },
    ],
  } as any);

  // output_config.format guarantees the first text block is valid JSON.
  const textBlock = response.content.find((b: any) => b.type === "text") as any;
  if (!textBlock) throw new Error("no text block in response");
  const report = JSON.parse(textBlock.text) as CaseReport;

  // --- Guard 1: steelman quotes. Soft-fail — verify against the CASE FILE
  // (problem statement + ingested document text), flag (⚠) any that aren't
  // found, but keep them so the lawyer can review. ---
  const verified = report.opponent_steelman.map((p) => ({
    ...p,
    verified: quoteAppears(p.source_quote, caseText),
  }));
  const verifiedAll = verified.every((v) => v.verified);

  // --- Guard 2: legal citations. HARD-fail — verify against the CORPUS, and
  // STRIP any citation whose quote isn't found verbatim. A wrong statute in
  // front of lawyers is worse than no statute. Count what we stripped. ---
  let strippedCitations = 0;
  const keepGroundedCitations = (basis: LegalBasis[]): LegalBasis[] =>
    (basis ?? []).filter((b) => {
      const ok = quoteAppears(b.source_quote, CORPUS_TEXT);
      if (!ok) {
        strippedCitations++;
        console.log(`    ✂ STRIPPED ungrounded citation: ${b.citation} — "${truncate(b.source_quote, 60)}"`);
      }
      return ok;
    });
  report.legal_basis = keepGroundedCitations(report.legal_basis);
  for (const v of verified) v.legal_basis = keepGroundedCitations(v.legal_basis);

  const usage = response.usage ?? ({} as any);
  const secs = ((Date.now() - started) / 1000).toFixed(1);
  const citeCount =
    report.legal_basis.length +
    verified.reduce((n, v) => n + v.legal_basis.length, 0);
  const ingested = bundle.docs.filter((d) => d.included).length;
  console.log(
    `${verifiedAll ? "✓" : "⚠"} ${bundle.id} — ${report.prospects} / ${report.recommendation}` +
      ` · ${ingested} doc(s), ${citeCount} grounded citation(s)${strippedCitations ? `, ${strippedCitations} stripped` : ""}` +
      ` (${secs}s, in ${usage.input_tokens ?? "?"} / out ${usage.output_tokens ?? "?"}` +
      `${usage.cache_read_input_tokens ? `, cache-read ${usage.cache_read_input_tokens}` : ""})`,
  );
  if (!verifiedAll) {
    for (const v of verified.filter((x) => !x.verified)) {
      console.log(`    ⚠ UNVERIFIED steelman quote: "${truncate(v.source_quote, 80)}"`);
    }
  }

  await writeReport(bundle, report, verified);
  await writeHtmlReport(bundle, report, verified);
  return {
    id: bundle.id,
    title: bundle.title,
    ok: true,
    verifiedAll,
    prospects: report.prospects,
    recommendation: report.recommendation,
    docCount: ingested,
  };
}

// ---------------------------------------------------------------------------
// Case-bundle discovery + document ingestion
// ---------------------------------------------------------------------------

/** Recursively find every `*_Problem_Statement.md` under `root`. Each one
 *  anchors a case bundle (its folder holds the supporting documents). */
function findProblemStatements(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (/problem_statement\.md$/i.test(ent.name)) out.push(full);
    }
  };
  walk(root);
  return out.sort();
}

/** Load a bundle: read the problem statement, extract text from every sibling
 *  PDF, and concatenate it all into the case text we send Claude. Images are
 *  recorded in the manifest but not ingested (v1 is text-only). */
function loadBundle(problemPath: string): Bundle {
  const dir = path.dirname(problemPath);
  const relDir = path.relative(CASES_DIR, dir);
  const id = relDir ? relDir.split(path.sep).join("-") : path.basename(dir);
  const problemMd = readFileSync(problemPath, "utf8");
  const title = (problemMd.match(/^#\s+(.+)$/m)?.[1] ?? id).trim();

  const docs: DocInfo[] = [];
  const parts: string[] = [problemMd.trim()];

  // Scan the bundle directory's immediate entries. PDFs → extract + append.
  // Image files / image folders → note in the manifest, don't ingest.
  for (const ent of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      const imgs = readdirSync(full).filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f));
      if (imgs.length) {
        docs.push({ name: ent.name + "/", kind: "image-folder", count: imgs.length, included: false });
      }
      continue;
    }
    if (ent.name === path.basename(problemPath) || ent.name.endsWith(".md")) continue;
    if (/\.pdf$/i.test(ent.name)) {
      const text = extractPdfText(full);
      docs.push({ name: ent.name, kind: "pdf", chars: text.length, included: true });
      parts.push(`${docHeader(ent.name)}\n${text.trim()}`);
    } else if (/\.(png|jpe?g|webp|gif)$/i.test(ent.name)) {
      docs.push({ name: ent.name, kind: "image", included: false });
    } else {
      docs.push({ name: ent.name, kind: "other", included: false });
    }
  }

  return { id, title, dir, caseText: parts.join("\n\n"), docs };
}

/** Extract text from a PDF via the poppler `pdftotext` CLI. */
function extractPdfText(pdfPath: string): string {
  if (!HAVE_PDFTOTEXT) {
    return `(pdftotext not installed — text of ${path.basename(pdfPath)} not extracted)`;
  }
  try {
    return execFileSync("pdftotext", ["-q", "-enc", "UTF-8", pdfPath, "-"], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch (err: any) {
    console.warn(`    ⚠ pdftotext failed on ${path.basename(pdfPath)} — ${err?.message ?? err}`);
    return `(could not extract text from ${path.basename(pdfPath)})`;
  }
}

function docHeader(name: string): string {
  const bar = "=".repeat(60);
  return `${bar}\nSUPPORTING DOCUMENT: ${name}\n${bar}`;
}

// ---------------------------------------------------------------------------
// Quote verification + reports
// ---------------------------------------------------------------------------

/** Normalise whitespace/quotes/case so verbatim-ish quotes still match. */
function norm(s: string): string {
  return s
    .replace(/[‘’‛′]/g, "'") // curly single quotes → '
    .replace(/[“”″]/g, '"') // curly double quotes → "
    .replace(/[–—]/g, "-") // en/em dash → -
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function quoteAppears(quote: string, caseText: string): boolean {
  const q = norm(quote);
  if (q.length < 4) return false; // too short to be a meaningful grounding
  return norm(caseText).includes(q);
}

async function writeReport(
  bundle: Bundle,
  r: CaseReport,
  verified: (SteelmanPoint & { verified: boolean })[],
) {
  const base = bundle.id;
  const lines: string[] = [];
  lines.push(`# Case Reality Report — ${bundle.title}`);
  lines.push("");
  lines.push(`**Prospects:** ${badge(r.prospects)} — ${r.prospects_reason}`);
  lines.push("");
  lines.push(`**Recommendation:** \`${r.recommendation}\` — ${r.recommendation_detail}`);
  lines.push("");
  lines.push(`**Documents ingested:** ${docManifestLine(bundle)}`);
  lines.push("");
  lines.push("## Act 1 — Your strongest case");
  lines.push("");
  lines.push(r.best_case);
  lines.push("");
  lines.push("## Act 2 — The Steelman (how the other side comes at you)");
  lines.push("");
  for (const v of verified) {
    lines.push(`- **${v.argument}**`);
    lines.push(
      `  - ${v.verified ? "✅ grounded" : "❌ UNVERIFIED — quote not found verbatim in the file"}: “${v.source_quote}”`,
    );
    for (const lb of v.legal_basis ?? []) {
      lines.push(`  - ⚖️ ${lb.citation}: “${lb.source_quote}”`);
    }
  }
  lines.push("");
  lines.push("## Act 3 — Evidence gaps to close (your checklist)");
  lines.push("");
  for (const g of r.evidence_gaps) lines.push(`- [ ] ${g}`);
  lines.push("");
  if (r.legal_basis.length > 0) {
    lines.push("## Legal basis (verified against the corpus — ungrounded citations stripped)");
    lines.push("");
    for (const lb of r.legal_basis) {
      lines.push(`- **${lb.citation}** — “${lb.source_quote}”`);
    }
    lines.push("");
  } else {
    lines.push("_No corpus provision applies to this case (the corpus currently covers housing only)._");
    lines.push("");
  }
  lines.push("---");
  lines.push("");
  lines.push("### Lawyer red-pen (fill in tonight)");
  lines.push("");
  lines.push("| Steelman point | Legally sound? (Y/N) | Corrected wording |");
  lines.push("|---|---|---|");
  for (const v of verified) lines.push(`| ${truncate(v.argument, 60)} |  |  |`);
  lines.push("");
  lines.push(`_Feature this case in the demo?_  ☐ strong→escalate  ☐ messy→gap  ☐ weak→honest-no  ☐ cut`);
  lines.push("");

  await writeFile(path.join(REPORTS_DIR, `${base}.report.md`), lines.join("\n"), "utf8");
}

// ---------------------------------------------------------------------------
// HTML report (the demo-facing Case Reality Report viewer)
// ---------------------------------------------------------------------------

async function writeHtmlReport(
  bundle: Bundle,
  r: CaseReport,
  verified: (SteelmanPoint & { verified: boolean })[],
) {
  const html = buildHtml(bundle, r, verified);
  await writeFile(path.join(REPORTS_DIR, `${bundle.id}.report.html`), html, "utf8");
}

function buildHtml(
  bundle: Bundle,
  r: CaseReport,
  verified: (SteelmanPoint & { verified: boolean })[],
): string {
  const prospectClass =
    r.prospects === "strong" ? "strong" : r.prospects === "arguable" ? "arguable" : "weak";

  const steelmanCards = verified
    .map((v) => {
      const legal = (v.legal_basis ?? [])
        .map(
          (lb) =>
            `<div class="legal"><span class="cite">⚖️ ${esc(lb.citation)}</span> <span class="lq">“${esc(lb.source_quote)}”</span></div>`,
        )
        .join("");
      const status = v.verified
        ? `<span class="badge ok">✓ grounded verbatim in the file</span>`
        : `<span class="badge bad">⚠ quote not found verbatim — review</span>`;
      return `
      <div class="card ${v.verified ? "" : "unverified"}">
        <p class="arg">${esc(v.argument)}</p>
        <blockquote class="quote">“${esc(v.source_quote)}”</blockquote>
        ${status}
        ${legal}
      </div>`;
    })
    .join("");

  const gaps = r.evidence_gaps
    .map((g) => `<li><label><input type="checkbox"> ${esc(g)}</label></li>`)
    .join("");

  const legalBasis =
    r.legal_basis.length > 0
      ? `<ul class="legal-list">${r.legal_basis
          .map(
            (lb) =>
              `<li><span class="cite">${esc(lb.citation)}</span> <span class="lq">“${esc(lb.source_quote)}”</span></li>`,
          )
          .join("")}</ul>`
      : `<p class="muted">No corpus provision applies to this case (the corpus currently covers housing only).</p>`;

  const docRows = bundle.docs
    .map((d) => {
      const status = d.included
        ? `<span class="doctag in">text ingested</span>`
        : d.kind === "image" || d.kind === "image-folder"
          ? `<span class="doctag img">image — not ingested (v1 text-only)</span>`
          : `<span class="doctag skip">not ingested</span>`;
      const detail =
        d.kind === "pdf" && d.chars != null
          ? `${d.chars.toLocaleString()} chars`
          : d.kind === "image-folder" && d.count != null
            ? `${d.count} image(s)`
            : "";
      return `<tr><td class="docname">${esc(d.name)}</td><td>${status}</td><td class="muted">${detail}</td></tr>`;
    })
    .join("");

  const nextSteps =
    r.recommendation === "self-serve"
      ? "You can likely handle this yourself — the report below is your roadmap."
      : r.recommendation === "escalate-to-solicitor"
        ? "Escalate to a Lawhive solicitor — and hand them this prepared file."
        : "Reconsider pursuing this as it stands — here's an honest read of why.";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Case Reality Report — ${esc(bundle.title)}</title>
<style>
  :root {
    --ink: #1a1a2e; --muted: #6b7280; --line: #e5e7eb; --bg: #f7f7fb;
    --strong: #16a34a; --arguable: #d97706; --weak: #dc2626; --accent: #4338ca;
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink);
    font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  .wrap { max-width: 820px; margin: 0 auto; padding: 40px 24px 80px; }
  header.head { border-bottom: 2px solid var(--ink); padding-bottom: 20px; margin-bottom: 28px; }
  .kicker { text-transform: uppercase; letter-spacing: .12em; font-size: 12px; color: var(--accent); font-weight: 700; }
  h1 { font-size: 28px; margin: 6px 0 16px; line-height: 1.25; }
  .verdict { display: flex; flex-wrap: wrap; gap: 10px 16px; align-items: center; }
  .pill { display: inline-block; padding: 4px 12px; border-radius: 999px; font-weight: 700; font-size: 14px; color: #fff; }
  .pill.strong { background: var(--strong); } .pill.arguable { background: var(--arguable); } .pill.weak { background: var(--weak); }
  .reason { color: var(--muted); font-size: 15px; }
  .nextsteps { margin-top: 16px; padding: 14px 16px; background: #eef2ff; border-left: 4px solid var(--accent); border-radius: 6px; }
  .nextsteps b { color: var(--accent); }
  section { margin-top: 36px; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: .1em; color: var(--accent); border-bottom: 1px solid var(--line); padding-bottom: 8px; }
  .act-num { color: var(--muted); font-weight: 400; }
  .best { font-size: 17px; }
  .card { background: #fff; border: 1px solid var(--line); border-left: 4px solid var(--weak); border-radius: 8px; padding: 16px 18px; margin: 14px 0; box-shadow: 0 1px 2px rgba(0,0,0,.04); }
  .card.unverified { border-left-color: #9ca3af; background: #fafafa; }
  .arg { font-weight: 600; margin: 0 0 10px; }
  blockquote.quote { margin: 0 0 10px; padding: 10px 14px; background: #fef2f2; border-radius: 6px; font-style: italic; color: #7f1d1d; }
  .badge { display: inline-block; font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
  .badge.ok { background: #dcfce7; color: #166534; } .badge.bad { background: #fee2e2; color: #991b1b; }
  .legal { margin-top: 8px; font-size: 13px; }
  .legal .cite, .legal-list .cite { font-weight: 700; color: var(--accent); }
  .legal .lq, .legal-list .lq { color: var(--muted); }
  ul.gaps { list-style: none; padding: 0; } ul.gaps li { padding: 6px 0; }
  ul.gaps input { margin-right: 8px; transform: translateY(1px); }
  ul.legal-list { padding-left: 0; list-style: none; } ul.legal-list li { padding: 8px 0; border-bottom: 1px dashed var(--line); }
  table.docs { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 12px; }
  table.docs td { padding: 8px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
  .docname { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; }
  .doctag { font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
  .doctag.in { background: #dcfce7; color: #166534; } .doctag.img { background: #fef3c7; color: #92400e; } .doctag.skip { background: #f3f4f6; color: #6b7280; }
  .muted { color: var(--muted); }
  footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid var(--line); font-size: 12px; color: var(--muted); }
</style>
</head>
<body>
<div class="wrap">
  <header class="head">
    <div class="kicker">Case Reality Report</div>
    <h1>${esc(bundle.title)}</h1>
    <div class="verdict">
      <span class="pill ${prospectClass}">${esc(r.prospects.toUpperCase())}</span>
      <span class="reason">${esc(r.prospects_reason)}</span>
    </div>
    <div class="nextsteps">
      <b>Next step:</b> ${esc(nextSteps)}<br>
      <span class="muted">${esc(r.recommendation_detail)}</span>
    </div>
  </header>

  <section>
    <h2><span class="act-num">Act 1</span> — Your strongest case</h2>
    <p class="best">${esc(r.best_case)}</p>
  </section>

  <section>
    <h2><span class="act-num">Act 2</span> — The Steelman: how the other side comes at you</h2>
    ${steelmanCards}
  </section>

  <section>
    <h2><span class="act-num">Act 3</span> — Evidence gaps to close (your checklist)</h2>
    <ul class="gaps">${gaps}</ul>
  </section>

  <section>
    <h2>Legal basis <span class="muted" style="text-transform:none;letter-spacing:0;font-weight:400">— verified verbatim against the corpus; ungrounded citations stripped</span></h2>
    ${legalBasis}
  </section>

  <section>
    <h2>Documents on file</h2>
    <table class="docs"><tbody>${docRows}</tbody></table>
  </section>

  <footer>
    Generated by The Steelman — an honest case-assessment assistant, not a solicitor.
    Every quote above is string-matched verbatim against this client's own file; legal
    citations are matched against a closed statutory corpus and stripped if unverified.
  </footer>
</div>
</body>
</html>`;
}

async function writeIndex(results: BundleResult[]) {
  const lines: string[] = [];
  lines.push("# Steelman — case run index");
  lines.push("");
  lines.push("| Case | Status | Docs | Prospects | Recommendation |");
  lines.push("|---|---|---|---|---|");
  for (const r of results.sort((a, b) => a.id.localeCompare(b.id))) {
    const status = !r.ok ? "❌ failed" : r.verifiedAll ? "✅ clean" : "⚠ quote issue";
    lines.push(
      `| [${r.id}](./${r.id}.report.html) | ${status} | ${r.docCount ?? "-"} | ${r.prospects ?? "-"} | ${r.recommendation ?? "-"} |`,
    );
  }
  lines.push("");
  lines.push(
    "Legend: ✅ all steelman quotes verified verbatim · ⚠ a quote wasn't found in the file (review before featuring) · ❌ the run errored. " +
      "Each case links to its HTML Case Reality Report; a `.report.md` is also written alongside for red-pen.",
  );
  await writeFile(path.join(REPORTS_DIR, "INDEX.md"), lines.join("\n"), "utf8");
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function badge(p: string) {
  return p === "strong" ? "🟢 strong" : p === "arguable" ? "🟡 arguable" : "🔴 weak";
}
function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function docManifestLine(bundle: Bundle): string {
  const pdfs = bundle.docs.filter((d) => d.kind === "pdf" && d.included).map((d) => d.name);
  const images = bundle.docs
    .filter((d) => d.kind === "image" || d.kind === "image-folder")
    .reduce((n, d) => n + (d.count ?? 1), 0);
  const parts: string[] = [];
  parts.push(pdfs.length ? `${pdfs.length} PDF(s) (${pdfs.join(", ")})` : "no PDFs");
  if (images) parts.push(`${images} image(s) noted but not ingested (v1 is text-only)`);
  return parts.join("; ");
}
function checkPdftotext(): boolean {
  try {
    execFileSync("pdftotext", ["-v"], { stdio: "ignore" });
    return true;
  } catch {
    console.warn(
      "⚠ `pdftotext` not found on PATH. PDF documents will NOT be ingested — " +
        "install poppler (`brew install poppler`) to include them. Continuing with " +
        "problem-statement text only.",
    );
    return false;
  }
}
function loadCorpus(dir: string): string {
  // Concatenate every corpus/*.md into one blob. This is both injected into the
  // prompt and the haystack that legal-citation quotes are matched against.
  if (!existsSync(dir)) {
    console.warn(`No corpus/ dir at ${dir} — legal grounding disabled this run.`);
    return "(no legal corpus loaded)";
  }
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort();
  return files.map((f) => readFileSync(path.join(dir, f), "utf8")).join("\n\n");
}
function loadDotEnv(file: string) {
  if (!existsSync(file)) return;
  for (const raw of readFileSync(file, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = val;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
