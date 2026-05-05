import "./rag/load-env";
import { Mastra } from "@mastra/core";
import { chatAgent } from "./agents/chat-agent";
import { AlbertAPIGateway } from "./gateways/albert";
import { anssiRagWorkflow } from "./rag/workflow-rag";

export const mastra = new Mastra({
  agents: { chatAgent },
  workflows: { anssiRagWorkflow },
  // Gateway souverain Albert (DINUM) pour chat + embeddings.
  // Enregistre le préfixe `dinum/albert/*` dans le model router.
  gateways: { dinum: new AlbertAPIGateway() },
});
