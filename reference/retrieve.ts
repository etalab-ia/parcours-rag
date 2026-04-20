/**
 * Reference retrieval — used by run-eval.
 *
 * `retrieve(query, k)` embeds the query via Albert and returns the top-k
 * nearest chunks from the LibSQL index built by build-index.ts.
 *
 * Deliberately simple: no reranking, no score threshold, no query rewriting.
 * These are Module 4 topics.
 */

import "dotenv/config";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { LibSQLVector } from "@mastra/libsql";

const __dirname = dirname(fileURLToPath(import.meta.url));
const INDEX_DB_PATH = resolve(__dirname, "../data/reference-index.db");
const INDEX_NAME = "anssi_essentiels";

export interface RetrievedChunk {
  id: string;
  score: number;
  text: string;
  source: string;
  page: number;
  guide_nom: string;
  url: string;
}

async function embedQuery(query: string): Promise<number[]> {
  const baseUrl = process.env.ALBERT_BASE_URL ?? "https://albert.api.etalab.gouv.fr/v1";
  const res = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.ALBERT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openweight-embeddings",
      input: query,
    }),
  });
  if (!res.ok) {
    throw new Error(`Albert embeddings HTTP ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as { data: { embedding: number[] }[] };
  return json.data[0].embedding;
}

export async function retrieve(query: string, k = 5): Promise<RetrievedChunk[]> {
  const vector = new LibSQLVector({
    id: "reference",
    url: `file:${INDEX_DB_PATH}`,
  });
  const queryVector = await embedQuery(query);
  const results = await vector.query({
    indexName: INDEX_NAME,
    queryVector,
    topK: k,
  });
  return results.map((r) => ({
    id: r.id,
    score: r.score,
    text: (r.metadata?.text as string | undefined) ?? "",
    source: (r.metadata?.source as string | undefined) ?? "",
    page: (r.metadata?.page as number | undefined) ?? 0,
    guide_nom: (r.metadata?.guide_nom as string | undefined) ?? "",
    url: (r.metadata?.url as string | undefined) ?? "",
  }));
}

// CLI smoke test: `tsx reference/retrieve.ts "ma question"`
if (import.meta.url === `file://${process.argv[1]}`) {
  const query = process.argv.slice(2).join(" ");
  if (!query) {
    console.error('Usage: tsx reference/retrieve.ts "<question>"');
    process.exit(1);
  }
  retrieve(query, 5).then((results) => {
    console.log(`\nQuery: ${query}\n`);
    for (const r of results) {
      console.log(`[score=${r.score.toFixed(3)}] ${r.source} p${r.page}`);
      console.log(`  ${r.text.slice(0, 200).replace(/\s+/g, " ")}...`);
      console.log();
    }
  });
}
