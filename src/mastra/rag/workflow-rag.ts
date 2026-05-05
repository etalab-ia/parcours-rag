import { createStep, createWorkflow } from "@mastra/core/workflows";
import "./load-env";
import { z } from "zod";
import { formatEvidence, type RetrievedChunk, retrieve } from "./retrieve";

interface RetrievalResult {
  evidence: string;
  hits: RetrievedChunk[];
}

/**
 * ÉTAPE 1 : RÉCUPÉRATION (Retrieval)
 */
const retrieveStep = createStep({
  id: "retrieve-anssi-info",
  inputSchema: z.object({
    query: z.string(),
  }),
  outputSchema: z.object({
    evidence: z.string(),
    hits: z.array(
      z.object({
        id: z.string(),
        score: z.number(),
        text: z.string(),
        source: z.string(),
        page: z.number(),
        chunk_index: z.number(),
        guide_id: z.string(),
        guide_nom: z.string(),
        url: z.string(),
      })
    ),
  }),
  execute: async ({ getInitData }) => {
    const initData = getInitData<{ query: string }>();
    const query = initData?.query;

    if (!query || query.trim() === "") {
      throw new Error(
        `Query is empty or undefined in retrieveStep. InitData: ${JSON.stringify(initData)}`
      );
    }

    const hits = await retrieve(query, 4);

    return {
      evidence: formatEvidence(hits),
      hits,
    };
  },
});

/**
 * ÉTAPE 2 : RÉPONSE (Generation)
 */
const answerStep = createStep({
  id: "answer-with-albert",
  inputSchema: z.object({
    evidence: z.string(),
    hits: z.array(
      z.object({
        id: z.string(),
        score: z.number(),
        text: z.string(),
        source: z.string(),
        page: z.number(),
        chunk_index: z.number(),
        guide_id: z.string(),
        guide_nom: z.string(),
        url: z.string(),
      })
    ),
  }),
  outputSchema: z.object({
    text: z.string(),
  }),
  execute: async ({ getInitData, getStepResult, mastra }) => {
    const initData = getInitData<{ query: string }>();
    const retrievalData = getStepResult("retrieve-anssi-info") as RetrievalResult | undefined;

    const agent = mastra.getAgent("chatAgent");

    const result = await agent.generate(`
      Tu es un expert ANSSI. Réponds à la question en utilisant les preuves fournies.

      PREUVES :
      ${retrievalData?.evidence}

      QUESTION : ${initData?.query}
    `);

    return {
      text: result.text,
    };
  },
});

/**
 * WORKFLOW COMPLET
 */
export const anssiRagWorkflow = createWorkflow({
  id: "anssi-rag-workflow",
  inputSchema: z.object({
    query: z.string(),
  }),
  outputSchema: z.object({
    text: z.string(),
  }),
  steps: [retrieveStep, answerStep],
})
  .then(retrieveStep)
  .then(answerStep)
  .commit();

// Script de test
if (process.argv[1]?.includes("workflow-rag.ts")) {
  (async () => {
    const { mastra } = await import("../index.js");
    const query = process.argv[2] || "comment sécuriser un serveur Windows ?";
    console.log(`🚀 Lancement du Workflow Mastra pour : "${query}"`);

    const workflow = mastra.getWorkflow("anssiRagWorkflow");
    const run = await workflow.createRun();
    const result = await run.start({ inputData: { query } });

    console.log("\n--- RÉPONSE FINALE DU WORKFLOW ---");
    const stepResult = result.steps["answer-with-albert"];
    if (stepResult?.status === "success") {
      console.log(stepResult.output.text);
    }
  })().catch(console.error);
}
