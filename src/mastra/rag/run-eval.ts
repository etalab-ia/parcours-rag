import "./load-env";
import { readFile, writeFile } from "node:fs/promises";
import { mastra } from "../index.js";
import { evalQuestionsPath, evalResultsPath } from "./paths";
import { formatEvidence, retrieve } from "./retrieve";

interface EvalQuestion {
  id: string;
  profile: string;
  question: string;
  expected_sources: string[];
  expected_citations_min: number;
  success_criteria: string;
}

interface EvalQuestionsFile {
  questions: EvalQuestion[];
}

interface Citation {
  source: string;
  page?: number;
}

interface EvalResult {
  id: string;
  profile: string;
  question: string;
  answer: string;
  retrieved: {
    score: number;
    source: string;
    page: number;
    chunk_index: number;
    text_preview: string;
  }[];
  sources_hit: string[];
  top_score: number;
  expected_sources_hit: boolean | null;
  citations: Citation[];
  expected_citations_min: number;
  success_criteria: string;
}

interface EvalRun {
  run_at: string;
  results: EvalResult[];
}

function extractCitations(answer: string): Citation[] {
  const regex = /\[source:\s*([^,\]]+)(?:,\s*p(\d+))?\]/gi;
  const citations: Citation[] = [];
  let match = regex.exec(answer);

  while (match) {
    citations.push({
      source: match[1].trim(),
      page: match[2] ? Number(match[2]) : undefined,
    });
    match = regex.exec(answer);
  }

  return citations;
}

async function answerWithAgent(question: string, evidence: string): Promise<string> {
  const agent = mastra.getAgent("chatAgent");
  const result = await agent.generate(`
Tu es un expert ANSSI. Réponds à la question en utilisant les preuves fournies.

PREUVES :
${evidence}

QUESTION : ${question}
`);

  return result.text;
}

async function main(): Promise<void> {
  const questionsFile = JSON.parse(await readFile(evalQuestionsPath, "utf-8")) as EvalQuestionsFile;

  const run: EvalRun = {
    run_at: new Date().toISOString(),
    results: [],
  };

  for (const question of questionsFile.questions) {
    console.log(`\n── ${question.id} (${question.profile}) ──`);
    console.log(`Q: ${question.question}`);

    const hits = await retrieve(question.question, 5);
    const evidence = formatEvidence(hits);
    const answer = await answerWithAgent(question.question, evidence);

    const sourcesHit = [...new Set(hits.map((hit) => hit.source))];
    const expectedSourcesHit =
      question.expected_sources.length === 0
        ? null
        : question.expected_sources.some((expected) => sourcesHit.includes(expected));

    run.results.push({
      id: question.id,
      profile: question.profile,
      question: question.question,
      answer,
      retrieved: hits.map((hit) => ({
        score: hit.score,
        source: hit.source,
        page: hit.page,
        chunk_index: hit.chunk_index,
        text_preview: hit.text.slice(0, 180).replace(/\s+/g, " "),
      })),
      sources_hit: sourcesHit,
      top_score: hits[0]?.score ?? 0,
      expected_sources_hit: expectedSourcesHit,
      citations: extractCitations(answer),
      expected_citations_min: question.expected_citations_min,
      success_criteria: question.success_criteria,
    });

    console.log(`A: ${answer.slice(0, 200)}${answer.length > 200 ? "..." : ""}`);
  }

  await writeFile(evalResultsPath, JSON.stringify(run, null, 2), "utf-8");
  console.log(`\n✅ Résultats d'évaluation écrits dans ${evalResultsPath}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`❌ rag:run-eval failed: ${message}`);
  process.exit(1);
});
