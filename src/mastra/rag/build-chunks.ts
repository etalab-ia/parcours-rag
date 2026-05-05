import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { MDocument } from "@mastra/rag";
import { extractText } from "unpdf";
import { chunksPath, projectRoot } from "./paths";

async function main() {
  const manifestPath = resolve(projectRoot, "corpus/anssi-essentiels/manifest.json");
  const corpusDir = resolve(projectRoot, "corpus/anssi-essentiels");
  const outputDir = dirname(chunksPath);
  const outputFile = chunksPath;

  console.log("📖 Chargement du manifest...");
  const manifest = JSON.parse(await readFile(manifestPath, "utf-8"));
  console.log(`✅ Manifest chargé : ${manifest.length} entrées.`);

  const allChunks = [];

  for (const entry of manifest) {
    const filePath = resolve(corpusDir, entry.filename);
    console.log(`⏳ Traitement de : ${entry.filename}...`);

    try {
      const buffer = await readFile(filePath);

      // Extraction du texte avec unpdf (v2)
      const { text } = await extractText(new Uint8Array(buffer));
      const fullText = Array.isArray(text) ? text.join("\n") : text;

      // Chunking avec Mastra MDocument
      const doc = MDocument.fromText(fullText, {
        source: entry.filename,
        guide_id: entry.guide_id,
        guide_nom: entry.guide_nom,
        url: entry.url,
      });

      const chunks = await doc.chunk({
        strategy: "token",
        maxSize: 256,
        overlap: 50,
      });

      // On formate les chunks pour notre usage
      const formattedChunks = chunks.map((c, idx) => ({
        text: c.text,
        source: entry.filename,
        page: 1, // Note: Simplification ici, unpdf extrait le texte global
        chunk_index: idx,
        guide_id: entry.guide_id,
        guide_nom: entry.guide_nom,
        url: entry.url,
      }));

      allChunks.push(...formattedChunks);
      console.log(`   └─ ${formattedChunks.length} chunks générés.`);
    } catch (err) {
      console.error(`❌ Erreur sur ${entry.filename}:`, err instanceof Error ? err.message : err);
    }
  }

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, JSON.stringify(allChunks, null, 2));
  console.log(`\n✨ Terminé ! ${allChunks.length} chunks sauvegardés dans ${outputFile}`);
}

main().catch(console.error);
