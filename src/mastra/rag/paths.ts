import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function isParcoursRagRoot(candidate: string): boolean {
  return (
    existsSync(resolve(candidate, "package.json")) &&
    existsSync(resolve(candidate, "src/mastra/index.ts"))
  );
}

function findParcoursRagRoot(startDir: string): string {
  const override = process.env.PARCOURS_RAG_ROOT?.trim();
  if (override) {
    const resolvedOverride = resolve(override);
    if (!isParcoursRagRoot(resolvedOverride)) {
      throw new Error(
        `PARCOURS_RAG_ROOT is invalid (${resolvedOverride}). Expected package.json + src/mastra/index.ts.`
      );
    }
    return resolvedOverride;
  }

  let currentDir = startDir;
  while (true) {
    if (isParcoursRagRoot(currentDir)) {
      return currentDir;
    }

    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }

    currentDir = parentDir;
  }

  throw new Error(
    `Unable to locate parcours-rag project root from ${startDir}. Set PARCOURS_RAG_ROOT explicitly if needed.`
  );
}

const moduleDir = dirname(fileURLToPath(import.meta.url));

export const projectRoot = findParcoursRagRoot(moduleDir);
export const dataDir = resolve(projectRoot, "data");
export const indexDbPath = resolve(dataDir, "index.db");
export const chunksPath = resolve(dataDir, "chunks.json");
export const evalQuestionsPath = resolve(dataDir, "eval-questions.json");
export const evalResultsPath = resolve(dataDir, "eval-results.json");
export const evalFindingsPath = resolve(projectRoot, "eval-findings.md");
