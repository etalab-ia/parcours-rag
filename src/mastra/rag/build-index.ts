import "./load-env";
import { readFile } from "node:fs/promises";
import { LibSQLVector } from "@mastra/libsql";
import { getAlbertBaseUrl, requireAlbertApiKey } from "./albert";
import { chunksPath, indexDbPath } from "./paths";

interface Chunk {
  text: string;
  source: string;
  page: number;
  chunk_index: number;
  guide_id: string;
  guide_nom: string;
  url: string;
}

async function main() {
  const BATCH_SIZE = 16;
  const apiKey = requireAlbertApiKey();

  console.log("📖 Chargement des chunks...");
  const chunks = JSON.parse(await readFile(chunksPath, "utf-8")) as Chunk[];
  console.log(`✅ ${chunks.length} chunks chargés.`);

  const vectorStore = new LibSQLVector({
    url: `file:${indexDbPath}`,
    id: "anssi-essentiels-store",
  });

  await vectorStore.createIndex({
    indexName: "anssi_essentiels",
    dimension: 1024,
  });

  console.log("⏳ Vectorisation et indexation par batchs...");

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    console.log(
      `   Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)}...`
    );

    // Appel direct à Albert pour les embeddings
    const response = await fetch(`${getAlbertBaseUrl()}/embeddings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openweight-embeddings",
        input: batch.map((c) => c.text),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Erreur API Albert: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const resJson = (await response.json()) as { data: { embedding: number[] }[] };
    const vectors = resJson.data.map((d) => d.embedding);

    // Upsert dans LibSQL
    await vectorStore.upsert({
      indexName: "anssi_essentiels",
      vectors: vectors,
      metadata: batch,
      ids: batch.map((c) => `${c.source}-${c.chunk_index}`),
    });
  }

  console.log(`\n✨ Terminé ! La base vectorielle est prête dans ${indexDbPath}`);
}

main().catch(console.error);
