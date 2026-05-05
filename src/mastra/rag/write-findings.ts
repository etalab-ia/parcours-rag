import { readFile, writeFile } from "node:fs/promises";
import { evalFindingsPath, evalResultsPath } from "./paths";

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
  citations: { source: string; page?: number }[];
}

interface EvalRun {
  run_at: string;
  results: EvalResult[];
}

function formatSources(result: EvalResult): string {
  if (!result.sources_hit.length) {
    return "Aucune source récupérée.";
  }

  return result.sources_hit.join(", ");
}

function formatCitations(result: EvalResult): string {
  if (!result.citations.length) {
    return "Aucune citation détectée automatiquement.";
  }

  return result.citations
    .map((citation) =>
      citation.page
        ? `[source: ${citation.source}, p${citation.page}]`
        : `[source: ${citation.source}]`
    )
    .join(", ");
}

function formatQuestionSection(result: EvalResult, index: number): string {
  const answerPreview = result.answer.trim() || "(réponse vide)";

  return `### Q${index + 1} — ${result.id} (${result.profile})

- **Question** : ${result.question}
- **Fidélité** : _à compléter (ancré / partiel / halluciné)_
- **Complétude** : _à compléter (oui / partielle / non)_
- **Traçabilité** : _à compléter (exacte / approximative / fausse)_
- **Top score retrieval** : ${result.top_score.toFixed(3)}
- **Sources récupérées** : ${formatSources(result)}
- **Citations détectées** : ${formatCitations(result)}
- **Réponse générée** :

> ${answerPreview.replace(/\n+/g, "\n> ")}
`;
}

async function main(): Promise<void> {
  const run = JSON.parse(await readFile(evalResultsPath, "utf-8")) as EvalRun;
  const content = `# Évaluation Module 3 — Findings

_Généré automatiquement le ${run.run_at} à partir de data/eval-results.json._

## Résultats par question

${run.results.map((result, index) => formatQuestionSection(result, index)).join("\n")}

## Failles observées

- **Type** : _à compléter_
  - **Exemple concret** : _question + extrait de réponse_
  - **Hypothèse de cause** : _retrieval / chunking / prompt / autre_

- **Type** : _à compléter_
  - **Exemple concret** : _question + extrait de réponse_
  - **Hypothèse de cause** : _retrieval / chunking / prompt / autre_

- **Type** : _à compléter_
  - **Exemple concret** : _question + extrait de réponse_
  - **Hypothèse de cause** : _retrieval / chunking / prompt / autre_
`;

  await writeFile(evalFindingsPath, content, "utf-8");
  console.log(`✅ Fichier généré: ${evalFindingsPath}`);
}

main().catch((error: unknown) => {
  const isMissingResults =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "ENOENT";

  const message = isMissingResults
    ? `Missing ${evalResultsPath}. Run 'pnpm run rag:run-eval' first.`
    : error instanceof Error
      ? error.message
      : String(error);
  console.error(`❌ rag:write-findings failed: ${message}`);
  process.exit(1);
});
