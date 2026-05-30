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
 * v1 is deliberately dumb and sequential-ish (small concurrency pool). No DB,
 * no framework. Comments > cleverness — this is throwaway scaffolding.
 */

import Anthropic from "@anthropic-ai/sdk";
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { existsSync, readFileSync, readdirSync } from "node:fs";
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

const client = new Anthropic();

// ---------------------------------------------------------------------------
// The three-act prompt (the keystone — same text the lawyer validates).
// Kept here so the lawyer's hand-run and this script test the SAME artifact.
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are an honest case-assessment assistant for a person in England with a
consumer legal dispute. You are NOT their solicitor. Your job is to show them
the truth about their case — including how the other side will attack it —
before they spend time and money they can't get back.

You will be given the full text of a case file (the client's account plus a
description of their documents). Work ONLY from what is in the file. Never
invent facts, statutes, or quotes.

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

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  await mkdir(REPORTS_DIR, { recursive: true });

  const files = (await readdir(CASES_DIR))
    .filter((f) => f.endsWith(".md"))
    .sort();

  if (files.length === 0) {
    console.error(`No .md case files found in ${CASES_DIR}`);
    process.exit(1);
  }

  console.log(
    `Running ${files.length} cases through ${MODEL} (effort=${EFFORT}, concurrency=${CONCURRENCY})…\n`,
  );

  const results: { file: string; ok: boolean; verifiedAll: boolean; prospects?: string; recommendation?: string }[] = [];

  // Simple concurrency pool — process `files` CONCURRENCY at a time.
  let cursor = 0;
  async function worker() {
    while (cursor < files.length) {
      const file = files[cursor++];
      const res = await runOne(file).catch((err) => {
        console.error(`✗ ${file} — ${err?.message ?? err}`);
        return { ok: false, verifiedAll: false };
      });
      results.push({ file, ...res } as any);
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

async function runOne(file: string) {
  const caseText = await readFile(path.join(CASES_DIR, file), "utf8");
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
        content: `Here is the full case file. Produce the Case Reality assessment.\n\n${caseText}`,
      },
    ],
  } as any);

  // output_config.format guarantees the first text block is valid JSON.
  const textBlock = response.content.find((b: any) => b.type === "text") as any;
  if (!textBlock) throw new Error("no text block in response");
  const report = JSON.parse(textBlock.text) as CaseReport;

  // --- Guard 1: steelman quotes. Soft-fail — verify against the CASE FILE,
  // flag (⚠) any that aren't found, but keep them so the lawyer can review. ---
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
  console.log(
    `${verifiedAll ? "✓" : "⚠"} ${file} — ${report.prospects} / ${report.recommendation}` +
      ` · ${citeCount} grounded citation(s)${strippedCitations ? `, ${strippedCitations} stripped` : ""}` +
      ` (${secs}s, in ${usage.input_tokens ?? "?"} / out ${usage.output_tokens ?? "?"}` +
      `${usage.cache_read_input_tokens ? `, cache-read ${usage.cache_read_input_tokens}` : ""})`,
  );
  if (!verifiedAll) {
    for (const v of verified.filter((x) => !x.verified)) {
      console.log(`    ⚠ UNVERIFIED steelman quote: "${truncate(v.source_quote, 80)}"`);
    }
  }

  await writeReport(file, report, verified);
  return {
    ok: true,
    verifiedAll,
    prospects: report.prospects,
    recommendation: report.recommendation,
  };
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
  file: string,
  r: CaseReport,
  verified: (SteelmanPoint & { verified: boolean })[],
) {
  const base = file.replace(/\.md$/, "");
  const lines: string[] = [];
  lines.push(`# Case Reality Report — ${base}`);
  lines.push("");
  lines.push(`**Prospects:** ${badge(r.prospects)} — ${r.prospects_reason}`);
  lines.push("");
  lines.push(`**Recommendation:** \`${r.recommendation}\` — ${r.recommendation_detail}`);
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

async function writeIndex(
  results: { file: string; ok: boolean; verifiedAll: boolean; prospects?: string; recommendation?: string }[],
) {
  const lines: string[] = [];
  lines.push("# Steelman — case run index");
  lines.push("");
  lines.push("| Case | Status | Prospects | Recommendation |");
  lines.push("|---|---|---|---|");
  for (const r of results.sort((a, b) => a.file.localeCompare(b.file))) {
    const status = !r.ok ? "❌ failed" : r.verifiedAll ? "✅ clean" : "⚠ quote issue";
    lines.push(
      `| [${r.file}](./${r.file.replace(/\.md$/, "")}.report.md) | ${status} | ${r.prospects ?? "-"} | ${r.recommendation ?? "-"} |`,
    );
  }
  lines.push("");
  lines.push("Legend: ✅ all steelman quotes verified verbatim · ⚠ a quote wasn't found in the file (review before featuring) · ❌ the run errored.");
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
