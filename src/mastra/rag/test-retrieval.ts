import "./load-env";
import { retrieve } from "./retrieve";

async function main() {
  // Récupère la question depuis la ligne de commande ou utilise une valeur par défaut
  const query = process.argv[2] || "sécurisation active directory";

  console.log(`🔍 Recherche sémantique pour : "${query}"...`);
  const results = await retrieve(query, 3);

  // 3. Afficher les extraits trouvés
  console.log("\n📚 Extraits ANSSI les plus pertinents :\n");
  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    console.log(`${i + 1}. [Score de similarité : ${res.score.toFixed(4)}]`);
    console.log(`   📄 Guide : ${res.source} (p.${res.page})`);
    console.log(`   📝 Texte : ${res.text.substring(0, 300)}...`);
    console.log("\n==================================================\n");
  }
}

main().catch(console.error);
