import { Agent } from "@mastra/core/agent";

/**
 * Agent de chat minimal — point de départ du Module 3.
 *
 * À ce stade : pas de mémoire, pas d'outils, pas de RAG.
 * Objectif Étape 1 : valider que l'infra (Mastra + Albert API) fonctionne
 * avant d'ajouter l'ingestion, l'embedding, la récupération et la génération
 * contextuelle dans les étapes suivants.
 */
export const chatAgent = new Agent({
  id: "chat-agent",
  name: "Agent de chat (baseline)",
  instructions: `Tu es un assistant francophone de cybersécurité, en cours de construction.

À ce stade du Module 3, tu n'as aucune connaissance spécifique sur le corpus ANSSI —
tu ne fais que discuter à partir de tes connaissances générales.

Consignes :
- Réponds toujours en français.
- Si on te demande quelque chose de précis sur les guides ANSSI « Les Essentiels »,
  signale que tu n'as pas encore accès à ces documents — ils seront ajoutés au
  l'étape 3 du workshop.
- Sois concis. Ne simule pas d'expertise que tu n'as pas.`,
  model: "dinum/albert/openweight-large",
});
