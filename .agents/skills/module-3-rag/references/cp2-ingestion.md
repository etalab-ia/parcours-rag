# CP2 — Ingestion & chunking

## Objectif

Extraire le texte des 17 PDFs ANSSI et le découper en chunks exploitables, avec un chunking volontairement naïf.

## Learning Objective

**LO1 — Appliquer** : ingestion d'un corpus hétérogène. **LO4 — Analyser** : commencer à sentir où le chunking naïf triche.

## Durée cible

30 min (pilote agent) + 10 min de débrief plénier.

## Brief participant

« On va lire les 17 PDFs, découper chaque document en morceaux de taille fixe, et tout stocker dans un fichier JSON. Chunking naïf exprès : 500 tokens avec overlap de 50. En CP6 on reviendra regarder ce que ce choix nous coûte. »

## Procédure

1. **Créer un script d'ingestion dédié**, par exemple :

   - `src/mastra/rag/build-chunks.ts`

2. **Charger le manifest** `corpus/anssi-essentiels/manifest.json` pour piloter la boucle d'ingestion.

3. **Pour chaque PDF du manifest** :

   - lire le fichier depuis `corpus/anssi-essentiels/<filename>`,
   - extraire le texte page par page (avec `unpdf`),
   - concaténer le texte du document,
   - chunker le document avec `@mastra/rag` (`MDocument`) en stratégie token :
     - `maxSize = 500`
     - `overlap = 50`

4. **Construire les chunks** au format minimal :

   ```json
   {
     "text": "...",
     "source": "anssi_essentiels_zero_trust_1.0.pdf",
     "page": 1,
     "chunk_index": 0,
     "guide_id": "modele-zero-trust"
   }
   ```

   Recommandé : ajouter aussi `guide_nom` et `url` (utile pour CP5/CP6).

5. **Écrire `data/chunks.json`** (créer `data/` si nécessaire), puis exécuter le script :

   ```bash
   pnpm tsx src/mastra/rag/build-chunks.ts
   ```

6. **Lire rapidement la sortie** (count + un exemple) avant de passer à CP3.

## Exit criteria

- [ ] `data/chunks.json` existe.
- [ ] Le fichier contient **≥ 40 chunks** (référence observée : ~55 sur ce corpus).
- [ ] Chaque chunk porte au minimum les clés `text`, `source`, `page`, `chunk_index`, `guide_id`.
- [ ] Les **17 PDFs** du manifest sont tous représentés (au moins un chunk par `source`/`filename`).

## Vérification

Exécuter les checks suivants :

1. **Fichier présent** :

   ```bash
   test -f data/chunks.json
   ```

2. **Cardinalité minimale** :

   ```bash
   node -e 'const fs=require("node:fs"); const chunks=JSON.parse(fs.readFileSync("data/chunks.json","utf8")); if(!Array.isArray(chunks)||chunks.length<40){console.error(`chunks=${chunks?.length ?? "n/a"}`); process.exit(1);} console.log(`chunks=${chunks.length}`);'
   ```

3. **Schéma minimal d'un chunk** :

   ```bash
   node -e 'const fs=require("node:fs"); const chunks=JSON.parse(fs.readFileSync("data/chunks.json","utf8")); const ok=chunks.every(c=>typeof c.text==="string"&&c.text.trim().length>0&&typeof c.source==="string"&&typeof c.page==="number"&&typeof c.chunk_index==="number"&&typeof c.guide_id==="string"); if(!ok){process.exit(1)}; console.log("schema=ok")'
   ```

4. **Couverture des 17 PDFs du manifest** :

   ```bash
   node -e 'const fs=require("node:fs"); const chunks=JSON.parse(fs.readFileSync("data/chunks.json","utf8")); const manifest=JSON.parse(fs.readFileSync("corpus/anssi-essentiels/manifest.json","utf8")); const seen=new Set(chunks.map(c=>c.source)); const missing=manifest.map(m=>m.filename).filter(f=>!seen.has(f)); if(missing.length){console.error("missing sources:", missing); process.exit(1)}; console.log(`sources=ok (${seen.size})`)'
   ```

## Hint ladder

1. **Hint socratique**

   « Pour valider CP2, ton indicateur principal c'est quoi : juste le nombre total de chunks… ou la couverture des 17 `filename` du manifest ? »

2. **Solution complète**

   « Implémente un seul script `build-chunks.ts` qui fait exactement :
   1) lire `corpus/anssi-essentiels/manifest.json`
   2) pour chaque `filename`, extraire le texte PDF, concaténer le document
   3) chunker en token `500/50`
   4) écrire `data/chunks.json` avec `text/source/page/chunk_index/guide_id`

   Puis exécute les vérifications dans cet ordre :
   - `test -f data/chunks.json`
   - `chunks.length >= 40`
   - schéma minimal valide
   - **zéro `filename` manquant** vs manifest.

   Tant qu'un check échoue, ne passe pas à CP3. »

## Pièges pédagogiques

- Le chunking naïf est **délibéré**. Ne pas laisser le participant « améliorer » maintenant (semantic chunking, nettoyage avancé, reranker…). Noter les défauts observés pour CP6.
- Les en-têtes/pieds ANSSI polluent les chunks (bruit répétitif inter-pages) : c'est attendu et pédagogique.
- Le `guide_id` n'est pas unique sur les 3 PDFs Windows : vérifier la couverture par `source` (`filename`), pas seulement par `guide_id`.
- Oubli de `mkdir data/` avant écriture de `chunks.json`.
- Tentation de viser `500+` chunks : ce corpus produit ~55 chunks avec la config 500/50, donc viser `≥40`.

## Side quest

Pour les participants en avance : ajouter un mini script d'analyse :

- distribution des tailles (`min`, `max`, `moyenne`) des `text.length`,
- top 3 des `source` qui produisent le plus de chunks,
- affichage de 2 chunks consécutifs d'un même PDF pour observer les quasi-doublons.

Objectif : préparer le débrief CP2 sans commencer à corriger la pipeline.

## Transition

« Tu as maintenant ~40–60 morceaux de texte, tous indifférenciés. Au débrief on compare ce que le chunking naïf fait bien (rapidité) et ce qu'il casse (doublons, coupures, bruit d'en-tête). Ensuite on passe aux embeddings. »
