# Étape 4 (CP4) — Retrieval

## Objectif

Exposer une fonction `retrieve(query, k=5)` qui prend une question en langage naturel et renvoie les `k` chunks les plus pertinents avec leurs métadonnées.

## Learning Objective

**LO2 — Appliquer** : construction d'une pipeline de récupération et requêtage en langage naturel.

## Durée cible

25 min (pilote agent) + 5 min de débrief plénier.

## Brief participant

« La requête utilisateur est elle aussi vectorisée, puis on fait une recherche de similarité cosinus dans l'index. Top-5, pas top-1, pas top-50 — on en reparle au débrief. »

## Conduite guidée (obligatoire)

Dérouler en micro-étapes : une modification, un test, une validation.

- ne pas livrer le plan complet en une seule réponse,
- expliquer brièvement chaque commande avant exécution,
- confirmer le résultat obtenu avant la suite.

⚠️ Utilise le gabarit de restitution uniquement comme format de sortie ; adapte toujours le code au contexte courant (ce n'est pas une réponse modèle).

## Restitution de code (obligatoire)

- Fournir du code en markdown copiable (fichier complet ou extrait ciblé selon la taille).
- Préserver et exposer les métadonnées utiles au retrieval (`chunk_index`, `source`, `page`, `guide_id`) dans les retours de `retrieve()`.
- Si un typage embedding est nécessaire, privilégier les types publics (ex: `EmbeddingModelV3` importé depuis `@ai-sdk/provider`) plutôt que des types internes (ex: `GatewayEmbeddingModel`).

## Procédure

1. **Micro-étape 4.1 — Créer le module retrieval**, par exemple `src/mastra/rag/retrieve.ts`, avec :

   - `embedQuery(query)` via Albert `/embeddings` (`openweight-embeddings`),
   - `retrieve(query, k=5)` qui interroge `data/index.db` (LibSQL),
   - retour structuré : `score`, `text`, `source`, `page`, `guide_id`/`guide_nom`.

   Validation locale : module créé, export `retrieve` présent.

2. **Micro-étape 4.2 — Conserver le contrat simple** :

   - pas de seuil de score,
   - pas de reranking,
   - pas de rewriting de requête.

3. **Micro-étape 4.3 — Ajouter un mode CLI** pour le smoke test, ex :

   ```bash
   pnpm tsx src/mastra/rag/retrieve.ts "<question>"
   ```

   Validation locale : un appel CLI retourne bien une liste structurée.

4. **Micro-étape 4.4 — Tester avec 3 requêtes contrastées** :

   - Q1 (cas "propre") :
     - « Quels sont les objectifs principaux du modèle Zero Trust selon l'ANSSI ? »
   - Q2 (cas transversal) :
     - « Quelles bonnes pratiques concernant les comptes administrateur sont recommandées ? »
   - Q3 (hors-corpus volontaire) :
     - « Quelle est la meilleure recette de gratin dauphinois ? »

5. **Micro-étape 4.5 — Afficher les résultats** de manière lisible :

   - score,
   - source/page,
   - extrait court du chunk.

## Exit criteria

- [ ] Fonction `retrieve` exportée et exécutable.
- [ ] Sur les 3 requêtes test, chaque appel retourne 5 chunks non vides avec métadonnées (`source`, `page`).
- [ ] Les scores sont triés en ordre décroissant.
- [ ] Sur la requête Zero Trust, au moins un chunk du guide `anssi_essentiels_zero_trust_1.0.pdf` apparaît dans le top-5.

## Vérification

Exécuter les checks suivants :

1. **Smoke tests CLI** :

   ```bash
   pnpm tsx src/mastra/rag/retrieve.ts "Quels sont les objectifs principaux du modèle Zero Trust selon l'ANSSI ?"
   pnpm tsx src/mastra/rag/retrieve.ts "Quelles bonnes pratiques concernant les comptes administrateur sont recommandées ?"
   pnpm tsx src/mastra/rag/retrieve.ts "Quelle est la meilleure recette de gratin dauphinois ?"
   ```

2. **Scores décroissants + top-5 complet** :

   ```bash
   pnpm tsx -e 'import {retrieve} from "./src/mastra/rag/retrieve.ts"; const res=await retrieve("Quels sont les objectifs principaux du modèle Zero Trust selon ANSSI ?",5); const sorted=res.every((r,i,a)=>i===0 || a[i-1].score>=r.score); if(res.length!==5 || !sorted){console.error(res.map(r=>r.score)); process.exit(1);} console.log("ordering=ok");'
   ```

3. **Présence Zero Trust dans le top-5** :

   ```bash
   pnpm tsx -e 'import {retrieve} from "./src/mastra/rag/retrieve.ts"; const res=await retrieve("Quels sont les objectifs principaux du modèle Zero Trust selon ANSSI ?",5); const ok=res.some(r=>String(r.source).includes("zero_trust")); if(!ok){console.error(res.map(r=>r.source)); process.exit(1);} console.log("zerotrust-hit=ok");'
   ```

## Hint ladder

1. **Hint socratique**

   « Si tes résultats semblent hors sujet, as-tu vérifié que la requête est embeddée avec le même modèle que les chunks de CP3 ? »

2. **Solution complète**

   « Reprends `retrieve()` avec ce contrat minimal :
   1) `embedQuery(query)` avec `openweight-embeddings`
   2) `vector.query({ indexName: "anssi_essentiels", queryVector: embeddedQuery, topK: k })`
   3) retourner `score/text/source/page` pour chaque hit
   4) tester via CLI sur les 3 requêtes de smoke test

   Ensuite valide les deux checks critiques :
   - scores décroissants
   - au moins un hit `zero_trust` pour la question Zero Trust.

   Si ça échoue, compare d'abord modèle/indexName avec CP3. »

## Pièges pédagogiques

- **Mauvais modèle d'embedding pour la requête** : retrieval dégradé même si CP3 semblait "ok".
- **IndexName incohérent** entre CP3 et CP4 (`anssi_essentiels` vs autre).
- **Oubli de métadonnées** dans l'upsert CP3 : impossible de citer proprement en CP5.
- **Lecture naïve des scores** : même une question hors-corpus renvoie un top-5 (pas de seuil).

## Side quest

Pour les participants en avance :

- ajouter un paramètre `k` au CLI (`retrieve.ts "question" 8`),
- comparer rapidement `k=3`, `k=5`, `k=8` sur la même question,
- noter quel `k` donne le meilleur compromis signal/bruit.

## Transition

« On récupère bien du contexte. Au débrief : que racontent vraiment les scores, et pourquoi le top-5 ment parfois. Ensuite on branche l'Étape 5 (génération avec citations). »
