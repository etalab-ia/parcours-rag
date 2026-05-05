import "./load-env";
import { mastra } from "../index.js";
import { formatEvidence, retrieve } from "./retrieve";

async function main() {
  const query = process.argv[2] || "comment sécuriser un contrôleur de domaine ?";

  console.log(`🤖 Agent RAG en cours de réflexion sur : "${query}"...`);

  // 1. Retrieval : On cherche les extraits pertinents
  const hits = await retrieve(query, 5);
  const context = formatEvidence(hits);

  // 2. Generation : On demande à l'agent de synthétiser
  const agent = mastra.getAgent("chatAgent");

  const result = await agent.generate(
    `Tu es un assistant spécialisé en cybersécurité, expert des guides ANSSI.
		Utilise les extraits suivants pour répondre à la question de manière précise et pédagogique.
		Cite systématiquement le nom du guide utilisé pour tes recommandations.
		Si les extraits ne permettent pas de répondre, indique-le clairement.

		---
		CONTEXTE DES GUIDES ANSSI :
		${context}
		---

		QUESTION DE L'UTILISATEUR : ${query}
		`
  );

  console.log("\n==================================================");
  console.log("💬 RÉPONSE DE L'AGENT ALBERT :");
  console.log("==================================================\n");
  console.log(result.text);
  console.log("\n==================================================");
}

main().catch(console.error);
