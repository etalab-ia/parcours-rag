/**
 * Run the 5 eval questions through retrieve + generate, serialize results.
 *
 * Output: data/eval-results.json — used to write observed-behavior.md manually.
 */

import "dotenv/config";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generate } from "./generate";
import { retrieve } from "./retrieve";

const __dirname = dirname(fileURLToPath(import.meta.url));
const QUESTIONS_PATH = resolve(__dirname, "../data/eval-questions.json");
const RESULTS_PATH = resolve(__dirname, "../data/eval-results.json");

interface EvalQuestion {
  id: string;
  profile: string;
  question: string;
  expected_sources: string[];
  gold_answer: string;
  expected_citations_min: number;
  success_criteria: string;
}

interface EvalRun {
  run_at: string;
  results: {
    id: string;
    profile: string;
    question: string;
    retrieved: {
      score: number;
      source: string;
      page: number;
      text_preview: string;
    }[];
    answer: string;
    sources_hit: string[]; // unique filenames retrieved
    top_score: number; // score of the best-matching chunk
    // For non-piège questions: true iff at least one expected source appears in top-k.
    // For piège questions (expected_sources = []): null — the top-k always returns 5
    // results, so a boolean "did we hit nothing" is impossible. Quality is judged by
    // top_score (below ~0.55 = weak match, consistent with "out-of-corpus") AND by
    // qualitative review of the generated answer (did the LLM refuse or hallucinate?).
    expected_sources_hit: boolean | null;
  }[];
}

// Empirical threshold from observed-behavior.md §3: scores below ~0.55 tend to
// correspond to tangential or no-corpus-match. Used only as an advisory signal
// for piège questions; final judgement is qualitative.
const WEAK_MATCH_THRESHOLD = 0.55;

async function main() {
  if (!process.env.ALBERT_API_KEY) {
    console.error("ALBERT_API_KEY not set");
    process.exit(1);
  }

  const file = JSON.parse(await readFile(QUESTIONS_PATH, "utf-8")) as {
    questions: EvalQuestion[];
  };

  const run: EvalRun = {
    run_at: new Date().toISOString(),
    results: [],
  };

  for (const q of file.questions) {
    console.log(`\n── ${q.id} (${q.profile}) ──`);
    console.log(`Q: ${q.question}`);
    const retrieved = await retrieve(q.question, 5);
    const sourcesHit = [...new Set(retrieved.map((r) => r.source))];
    const topScore = retrieved[0]?.score ?? 0;
    // Piège questions have no expected sources — we can't judge hit/miss by
    // source overlap. Flag as null; the top_score + manual answer review drive
    // the evaluation.
    const expectedHit: boolean | null =
      q.expected_sources.length === 0
        ? null
        : q.expected_sources.some((src) => sourcesHit.includes(src));
    const { answer } = await generate(q.question, retrieved);
    console.log(`A: ${answer.slice(0, 300)}${answer.length > 300 ? "..." : ""}`);
    if (q.expected_sources.length === 0) {
      const warn =
        topScore < WEAK_MATCH_THRESHOLD
          ? "top score below weak-match threshold (expected for piège)"
          : "top score above weak-match threshold — retrieval pretended to know";
      console.log(`   [piège] ${warn} (top=${topScore.toFixed(3)})`);
    }
    run.results.push({
      id: q.id,
      profile: q.profile,
      question: q.question,
      retrieved: retrieved.map((r) => ({
        score: r.score,
        source: r.source,
        page: r.page,
        text_preview: r.text.slice(0, 150).replace(/\s+/g, " "),
      })),
      answer,
      sources_hit: sourcesHit,
      top_score: topScore,
      expected_sources_hit: expectedHit,
    });
  }

  await writeFile(RESULTS_PATH, JSON.stringify(run, null, 2), "utf-8");
  console.log(`\nWrote ${RESULTS_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
