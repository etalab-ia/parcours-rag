/**
 * Reference ingestion pipeline — Module 3 RAG.
 *
 * Reads 17 ANSSI PDFs from corpus/anssi-essentiels/, extracts text page-by-page,
 * chunks naively (500 tokens, overlap 50 — per design decision), embeds via
 * Albert openweight-embeddings, and upserts into a LibSQL vector store.
 *
 * Writes:
 *   - data/chunks.json       (all chunks with text + metadata)
 *   - data/reference-index.db (LibSQL vector index)
 *
 * Runtime: ~2-4 min depending on API batching.
 *
 * NOT for participant reuse — see reference/README.md.
 */

import "dotenv/config";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { LibSQLVector } from "@mastra/libsql";
import { MDocument } from "@mastra/rag";
import { extractText, getDocumentProxy } from "unpdf";

// ── Configuration ────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const CORPUS_DIR = resolve(__dirname, "../corpus/anssi-essentiels");
const DATA_DIR = resolve(__dirname, "../data");
const CHUNKS_PATH = join(DATA_DIR, "chunks.json");
const INDEX_DB_PATH = join(DATA_DIR, "reference-index.db");
const INDEX_NAME = "anssi_essentiels";
const EMBEDDING_DIMENSION = 1024; // BAAI/bge-m3
const EMBEDDING_BATCH_SIZE = 32; // kind to the API — tunable
const CHUNK_MAX_TOKENS = 500;
const CHUNK_OVERLAP = 50;

// ── Types ────────────────────────────────────────────────────────────────────
interface ManifestEntry {
  guide_id: string;
  guide_nom: string;
  filename: string;
  date: string;
  thematique: string;
  document_libelle: string;
  url: string;
  size_bytes: number;
}

interface Chunk {
  id: string; // deterministic: <guide_id>#p<page>#c<index>
  text: string;
  metadata: {
    source: string; // filename
    guide_id: string;
    guide_nom: string;
    page: number; // 1-indexed
    chunk_index: number; // 0-indexed within the (guide, page)
    url: string;
  };
}

// ── Step 1: load manifest ────────────────────────────────────────────────────
async function loadManifest(): Promise<ManifestEntry[]> {
  const path = join(CORPUS_DIR, "manifest.json");
  return JSON.parse(await readFile(path, "utf-8")) as ManifestEntry[];
}

// ── Step 2: extract per-page text ────────────────────────────────────────────
async function extractPages(pdfPath: string): Promise<string[]> {
  const buffer = await readFile(pdfPath);
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: false });
  // With mergePages: false, unpdf returns one string per page.
  return Array.isArray(text) ? text : [text];
}

// ── Step 3: naive chunking (per-page, token-based) ───────────────────────────
async function chunkPage(text: string): Promise<string[]> {
  if (!text.trim()) return [];
  const doc = MDocument.fromText(text);
  const chunks = await doc.chunk({
    strategy: "token",
    maxSize: CHUNK_MAX_TOKENS,
    overlap: CHUNK_OVERLAP,
  });
  return chunks.map((c) => c.text).filter((t) => t.trim().length > 0);
}

// ── Step 4: embed in batches ─────────────────────────────────────────────────
// NOTE: we call the Albert embeddings endpoint directly via fetch instead of
// going through Mastra's `embedMany` + gateway. The scaffold pins `ai@6` with
// `@ai-sdk/openai-compatible@^1` (v1 model spec), which is fine for the chat
// path used in CP1 but incompatible with `embedMany`'s v2 spec check. A direct
// fetch is what participants end up writing anyway — keeps this reference
// transparent.
async function embedBatch(texts: string[]): Promise<number[][]> {
  const baseUrl = process.env.ALBERT_BASE_URL ?? "https://albert.api.etalab.gouv.fr/v1";
  const res = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.ALBERT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openweight-embeddings",
      input: texts,
    }),
  });
  if (!res.ok) {
    throw new Error(`Albert embeddings HTTP ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as {
    data: { index: number; embedding: number[] }[];
  };
  // Order is guaranteed by `index` — sort defensively.
  return json.data
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
}

// ── Orchestration ────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.ALBERT_API_KEY) {
    console.error("ALBERT_API_KEY is not set — load .env first.");
    process.exit(1);
  }

  await mkdir(DATA_DIR, { recursive: true });
  // Remove any existing index so re-runs don't leave stale vectors from a
  // previous corpus (upsert only overwrites matching IDs, not drops deleted ones).
  await rm(INDEX_DB_PATH, { force: true });

  const manifest = await loadManifest();
  const pdfs = manifest.map((m) => m.filename);
  console.log(`Corpus: ${pdfs.length} PDFs`);

  // 1. Extract + chunk
  const allChunks: Chunk[] = [];
  for (const entry of manifest) {
    const pdfPath = join(CORPUS_DIR, entry.filename);
    process.stdout.write(`  ${entry.filename} ... `);
    const pages = await extractPages(pdfPath);
    let pageChunkCount = 0;
    for (let p = 0; p < pages.length; p += 1) {
      const pageText = pages[p] ?? "";
      const pieces = await chunkPage(pageText);
      // ID uses filename (not guide_id) because the manifest assigns the same
      // guide_id to multiple Windows-server PDFs; filename is guaranteed unique.
      const filenameSlug = entry.filename.replace(/\.pdf$/, "");
      pieces.forEach((text, idx) => {
        allChunks.push({
          id: `${filenameSlug}#p${p + 1}#c${idx}`,
          text,
          metadata: {
            source: entry.filename,
            guide_id: entry.guide_id,
            guide_nom: entry.guide_nom,
            page: p + 1,
            chunk_index: idx,
            url: entry.url,
          },
        });
        pageChunkCount += 1;
      });
    }
    console.log(`${pages.length} pages → ${pageChunkCount} chunks`);
  }
  console.log(`Total chunks: ${allChunks.length}`);

  // 2. Persist chunks.json
  await writeFile(CHUNKS_PATH, JSON.stringify(allChunks, null, 2), "utf-8");
  console.log(`Wrote ${CHUNKS_PATH}`);

  // 3. Embed in batches
  console.log(`Embedding in batches of ${EMBEDDING_BATCH_SIZE}...`);
  const vectors: number[][] = [];
  for (let i = 0; i < allChunks.length; i += EMBEDDING_BATCH_SIZE) {
    const batch = allChunks.slice(i, i + EMBEDDING_BATCH_SIZE);
    const batchVectors = await embedBatch(batch.map((c) => c.text));
    vectors.push(...batchVectors);
    process.stdout.write(
      `  batch ${Math.floor(i / EMBEDDING_BATCH_SIZE) + 1}/${Math.ceil(
        allChunks.length / EMBEDDING_BATCH_SIZE
      )}\r`
    );
  }
  console.log(`\nEmbedded ${vectors.length} chunks`);

  // 4. Upsert into LibSQL
  const vector = new LibSQLVector({
    id: "reference",
    url: `file:${INDEX_DB_PATH}`,
  });
  await vector.createIndex({
    indexName: INDEX_NAME,
    dimension: EMBEDDING_DIMENSION,
    metric: "cosine",
  });
  await vector.upsert({
    indexName: INDEX_NAME,
    vectors,
    metadata: allChunks.map((c) => ({ ...c.metadata, text: c.text })),
    ids: allChunks.map((c) => c.id),
  });
  console.log(`Upserted ${allChunks.length} vectors into ${INDEX_NAME}`);

  const stats = await vector.describeIndex({ indexName: INDEX_NAME });
  console.log(`Index stats: ${JSON.stringify(stats)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
