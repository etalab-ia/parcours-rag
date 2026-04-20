import { Mastra } from "@mastra/core";
import { chatAgent } from "./agents/chat-agent";
import { AlbertAPIGateway } from "./gateways/albert";

export const mastra = new Mastra({
  agents: { chatAgent },
  // Gateway souverain Albert (DINUM) pour chat + embeddings.
  // Enregistre le préfixe `dinum/albert/*` dans le model router.
  gateways: { dinum: new AlbertAPIGateway() },
});
