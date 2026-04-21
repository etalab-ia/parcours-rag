# CP3 — Embeddings & index vectoriel

## Objectif

Vectoriser l'ensemble des chunks via l'API Albert (`openweight-embeddings`, 1024d) et les stocker dans un index LibSQL local.

## Learning Objective

**LO1 — Appliquer** : embeddings sur un corpus complet. **LO2 — Appliquer** : construction d'un index vectoriel.

## Durée cible

25 min (pilote agent) + 5 min de débrief plénier.

## Brief participant

« Chaque chunk devient un vecteur de 1024 dimensions via l'API Albert. On range tout dans LibSQL — un SQLite augmenté, intégré à Mastra, zéro serveur à démarrer. »

## Procédure

1. **Créer un script d'indexation**, par exemple :

   - `src/mastra/rag/build-index.ts`

2. **Charger les chunks** depuis `data/chunks.json`.

3. **Embedder en batchs** (taille 16 ou 32 recommandée) via l'endpoint Albert `/embeddings` :

   - modèle : `openweight-embeddings`,
   - entrée : `chunk.text`,
   - sortie attendue : vecteur 1024 dimensions.

4. **Créer un index LibSQL** (ex: `anssi_essentiels`) sur `file:data/index.db` avec :

   - `dimension: 1024`,
   - `metric: "cosine"`.

5. **Upsert les vecteurs** avec métadonnées minimales :

   - `source`, `page`, `guide_id`, `chunk_index`, `text`.

   ⚠️ Les 3 PDFs Windows partagent le même `guide_id` : utiliser des IDs de chunk uniques basés sur `source + chunk_index` (pas `guide_id` seul).

6. **Ajouter un mini smoke test** à la fin du script :

   - lire `describeIndex()`,
   - afficher `count` et `dimension`,
   - exécuter une requête de test (`topK=1`) et afficher `source/page` du premier résultat.

7. **Lancer l'indexation** :

   ```bash
   pnpm tsx src/mastra/rag/build-index.ts
   ```

## Exit criteria

- [ ] Fichier `data/index.db` (ou équivalent LibSQL) créé.
- [ ] Nombre de vecteurs dans l'index = nombre de chunks dans `data/chunks.json`.
- [ ] Dimension des vecteurs = 1024 (cohérente avec `openweight-embeddings`).
- [ ] Une requête de smoke test (`topK=1`) renvoie au moins un résultat avec métadonnées non vides (`source`, `page`).

## Vérification

Exécuter les checks suivants :

1. **DB présente** :

   ```bash
   test -f data/index.db
   ```

2. **Count et dimension cohérents** :

   ```bash
   pnpm tsx -e 'import {readFileSync} from "node:fs"; import {LibSQLVector} from "@mastra/libsql"; const chunks=JSON.parse(readFileSync("data/chunks.json","utf8")); const vector=new LibSQLVector({id:"cp3",url:"file:data/index.db"}); const stats=await vector.describeIndex({indexName:"anssi_essentiels"}); if(stats.dimension!==1024||stats.count!==chunks.length){console.error({expectedCount:chunks.length, stats}); process.exit(1);} console.log("index-stats=ok", stats);'
   ```

3. **Smoke query avec métadonnées** :

   ```bash
   pnpm tsx -e 'import {LibSQLVector} from "@mastra/libsql"; const base=process.env.ALBERT_BASE_URL ?? "https://albert.api.etalab.gouv.fr/v1"; const key=process.env.ALBERT_API_KEY; if(!key){process.exit(1)}; const emb=await fetch(`${base}/embeddings`,{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({model:"openweight-embeddings",input:"Zero Trust"})}); const embJson=await emb.json(); const vector=new LibSQLVector({id:"cp3",url:"file:data/index.db"}); const hits=await vector.query({indexName:"anssi_essentiels",queryVector:embJson.data[0].embedding,topK:1}); const ok=hits.length>0 && hits[0]?.metadata?.source && hits[0]?.metadata?.page; if(!ok){console.error(hits[0]); process.exit(1)}; console.log("query-smoke=ok", hits[0].metadata.source, hits[0].metadata.page);'
   ```

## Hint ladder

1. **Hint socratique**

   « Si ton index contient moins de vecteurs que de chunks, est-ce un problème d'embedding… ou d'identifiants qui se collisionnent à l'upsert ? »

2. **Solution complète**

   « Procède en 3 blocs simples :
   1) `chunks.json` → embeddings en batch (16/32),
   2) `createIndex({dimension:1024})`,
   3) `upsert(ids,vectors,metadata)` avec IDs uniques basés sur `source`.
   Termine par `describeIndex()` et compare `stats.count` à `chunks.length`. Si ça diffère, vérifie d'abord les collisions d'IDs. »

## Pièges pédagogiques

- **Batch trop gros** (ex: 200+) : latence élevée, erreurs API, debugging pénible.
- **IDs non uniques** : vecteurs écrasés silencieusement à l'upsert.
- **Index non réinitialisé** entre deux runs : données obsolètes conservées.
- **Mauvaise dimension** (modèle embedding différent) : incohérence durable pour CP4.
- **Env API non chargé** : l'erreur ressemble à un bug code alors que c'est juste la clé.

## Side quest

Pour les participants en avance :

- comparer 2 tailles de batch (16 vs 32),
- mesurer le temps total,
- noter dans 3 lignes le compromis latence/stabilité observé.

## Transition

« L'index est prêt. Au débrief on compare les tailles de batch et les collisions d'IDs rencontrées. Ensuite on passe à la récupération (`retrieve`). »
