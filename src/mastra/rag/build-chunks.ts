import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { MDocument } from "@mastra/rag";
import { extractText, getDocumentProxy } from "unpdf";
import { chunksPath, projectRoot } from "./paths";

async function main() {
  const manifestPath = resolve(projectRoot, "corpus/anssi-essentiels/manifest.json");
  const corpusDir = resolve(projectRoot, "corpus/anssi-essentiels");
  const outputDir = dirname(chunksPath);
  const outputFile = chunksPath;

  console.log("📖 Chargement du manifest...");
  const manifest = JSON.parse(await readFile(manifestPath, "utf-8"));
  console.log(`✅ Manifest chargé : ${manifest.length} entrées.`);

  const allChunks: {
    text: string;
    source: string;
    page: number;
    chunk_index: number;
    guide_id: string;
    guide_nom: string;
    url: string;
  }[] = [];

  for (const entry of manifest) {
    const filePath = resolve(corpusDir, entry.filename);
    console.log(`⏳ Traitement de : ${entry.filename}...`);

    try {
      const buffer = await readFile(filePath);

      // Extraction page par page pour préserver la traçabilité des citations
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      const { text } = await extractText(pdf, { mergePages: false });
      const pages = Array.isArray(text) ? text : [text];

      let generatedForFile = 0;
      for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
        const pageText = pages[pageIndex] ?? "";
        if (!pageText.trim()) {
          continue;
        }

        const doc = MDocument.fromText(pageText, {
          source: entry.filename,
          guide_id: entry.guide_id,
          guide_nom: entry.guide_nom,
          url: entry.url,
          page: pageIndex + 1,
        });

        const chunks = await doc.chunk({
          strategy: "token",
          maxSize: 256,
          overlap: 50,
        });

        const formattedChunks = chunks.map((c, chunkIndex) => ({
          text: c.text,
          source: entry.filename,
          page: pageIndex + 1,
          chunk_index: chunkIndex,
          guide_id: entry.guide_id,
          guide_nom: entry.guide_nom,
          url: entry.url,
        }));

        allChunks.push(...formattedChunks);
        generatedForFile += formattedChunks.length;
      }

      console.log(`   └─ ${pages.length} page(s), ${generatedForFile} chunks générés.`);
    } catch (err) {
      console.error(`❌ Erreur sur ${entry.filename}:`, err instanceof Error ? err.message : err);
    }
  }

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, JSON.stringify(allChunks, null, 2));
  console.log(`\n✨ Terminé ! ${allChunks.length} chunks sauvegardés dans ${outputFile}`);
}

main().catch(console.error);
