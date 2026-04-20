/**
 * Reference RAG generation — used by run-eval.
 *
 * Minimal RAG prompt: system instruction + retrieved context + question.
 * Calls Albert `openweight-large` directly via fetch (keeps the reference
 * transparent and decoupled from Mastra's AI SDK version pinning).
 *
 * Deliberately minimal guard-rails — the prompt does NOT aggressively tell the
 * model « dis que tu ne sais pas si le contexte est insuffisant ». This is on
 * purpose : we want to observe whether a naive prompt produces the failure
 * mode the design doc anticipates on the "piège" question.
 */

import "dotenv/config";
import type { RetrievedChunk } from "./retrieve";

const SYSTEM_PROMPT = `Tu es un assistant francophone spécialisé en cybersécurité.
Tu réponds aux questions en t'appuyant sur les extraits de guides ANSSI « Les Essentiels » fournis dans le contexte ci-dessous.
Cite systématiquement tes sources sous la forme [source: <nom_du_guide>, p<numéro_de_page>].
Réponds en français, de manière concise et structurée.`;

function formatContext(chunks: RetrievedChunk[]): string {
  return chunks
    .map((c, i) => `[${i + 1}] source: ${c.guide_nom} (${c.source}, p${c.page})\n${c.text}`)
    .join("\n\n---\n\n");
}

export interface GenerationResult {
  answer: string;
  context: RetrievedChunk[];
}

export async function generate(
  question: string,
  context: RetrievedChunk[]
): Promise<GenerationResult> {
  const baseUrl = process.env.ALBERT_BASE_URL ?? "https://albert.api.etalab.gouv.fr/v1";
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.ALBERT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openweight-large",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Contexte (extraits des guides ANSSI) :\n\n${formatContext(context)}\n\n---\n\nQuestion : ${question}`,
        },
      ],
      temperature: 0.2,
    }),
  });
  if (!res.ok) {
    throw new Error(`Albert chat HTTP ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return {
    answer: json.choices[0].message.content,
    context,
  };
}
