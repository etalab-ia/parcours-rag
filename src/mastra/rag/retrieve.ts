import "./load-env";
import { LibSQLVector } from "@mastra/libsql";
import { getAlbertBaseUrl, requireAlbertApiKey } from "./albert";
import { indexDbPath } from "./paths";

const vectorStore = new LibSQLVector({
  url: `file:${indexDbPath}`,
  id: "anssi-essentiels-store",
});

export interface RetrievedChunk {
  id: string;
  score: number;
  text: string;
  source: string;
  page: number;
  chunk_index: number;
  guide_id: string;
  guide_nom: string;
  url: string;
}

async function embedQuery(query: string): Promise<number[]> {
  const response = await fetch(`${getAlbertBaseUrl()}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireAlbertApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openweight-embeddings",
      input: [query],
    }),
  });

  if (!response.ok) {
    throw new Error(`Albert API error (${response.status}): ${await response.text()}`);
  }

  const payload = (await response.json()) as { data?: { embedding: number[] }[] };
  if (!payload.data?.[0]?.embedding) {
    throw new Error(`Unexpected Albert embedding response: ${JSON.stringify(payload)}`);
  }

  return payload.data[0].embedding;
}

export async function retrieve(query: string, topK = 5): Promise<RetrievedChunk[]> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    throw new Error("Query is empty. Please provide a non-empty retrieval query.");
  }

  const queryVector = await embedQuery(normalizedQuery);

  const hits = await vectorStore.query({
    indexName: "anssi_essentiels",
    queryVector,
    topK,
  });

  return hits.map((hit) => ({
    id: hit.id,
    score: hit.score,
    text: (hit.metadata?.text as string | undefined) ?? "",
    source: (hit.metadata?.source as string | undefined) ?? "",
    page: (hit.metadata?.page as number | undefined) ?? 0,
    chunk_index: (hit.metadata?.chunk_index as number | undefined) ?? -1,
    guide_id: (hit.metadata?.guide_id as string | undefined) ?? "",
    guide_nom: (hit.metadata?.guide_nom as string | undefined) ?? "",
    url: (hit.metadata?.url as string | undefined) ?? "",
  }));
}

export function formatEvidence(chunks: RetrievedChunk[]): string {
  return chunks
    .map(
      (chunk) => `[Source: ${chunk.source}${chunk.page ? `, p.${chunk.page}` : ""}] ${chunk.text}`
    )
    .join("\n\n---\n\n");
}
