# Étape 2 — Ingestion & chunking

## Objectif

Extraire le texte des 17 PDFs ANSSI et le découper en chunks exploitables, avec un chunking volontairement naïf.

## Learning Objective

**LO1 — Appliquer** : ingestion d'un corpus hétérogène. **LO4 — Analyser** : commencer à sentir où le chunking naïf triche.

## Durée cible

30 min (pilote agent) + 10 min de débrief plénier.

## Brief participant

« On va lire les 17 PDFs, découper chaque document en morceaux de taille fixe, et tout stocker dans un fichier JSON. Chunking naïf exprès : 500 tokens avec overlap de 50. En Étape 6, on reviendra regarder ce que ce choix nous coûte. »

## Conduite guidée (obligatoire)

Ne pas envoyer la procédure complète d'un coup. Piloter en micro-étapes :

- une action concrète,
- une explication courte,
- une validation observable,
- puis seulement l'action suivante.

⚠️ Utilise le gabarit de restitution uniquement comme format de sortie ; adapte toujours le code au contexte courant (ce n'est pas une réponse modèle).

## Restitution de code (obligatoire)

- Fournir du code en markdown copiable (fichier complet ou extrait ciblé selon la taille).
- Préserver les métadonnées produites à cette étape (`chunk_index`, `source`, `page`, `guide_id`) dans les étapes suivantes.
- Si un typage embedding est nécessaire, utiliser exclusivement des types publics exposés (ex: `EmbeddingModelV3` importé depuis `@ai-sdk/provider`, notamment `Promise<EmbeddingModelV3>` comme type de retour de `resolveEmbeddingModel`) — ne jamais utiliser de types internes (ex: `GatewayEmbeddingModel`).

## Procédure

1. **Micro-étape 2.1 — Créer le squelette du script**

   Créer `src/mastra/rag/build-chunks.ts` avec :

   - imports (`fs/promises`, `path`, `unpdf`, `MDocument`),
   - fonction `main()` vide,
   - constante des chemins (`manifest`, dossier corpus, sortie JSON).

   Validation locale : le fichier existe et compile (`npx tsx src/mastra/rag/build-chunks.ts` sans logique métier complète peut déjà tourner sans crash syntaxique).

2. **Micro-étape 2.2 — Charger le manifest**

   Implémenter la lecture de `corpus/anssi-essentiels/manifest.json` et afficher le nombre d'entrées.

   Validation locale : sortie terminal du type `manifest entries: 17`.

3. **Micro-étape 2.3 — Tester extraction + chunking sur 1 PDF**

   Sur le premier PDF du manifest :

   - lire le fichier dans `corpus/anssi-essentiels/<filename>`,
   - extraire le texte page par page (avec `unpdf`),
   - concaténer le document,
   - chunker avec `MDocument` en stratégie token (`maxSize=500`, `overlap=50`).

   Validation locale : afficher pages lues + nombre de chunks générés pour ce PDF.

4. **Micro-étape 2.4 — Généraliser aux 17 PDFs**

   Boucler sur tout le manifest et construire les chunks au format minimal :

   ```json
   {
     "text": "...",
     "source": "anssi_essentiels_zero_trust_1.0.pdf",
     "page": 1,
     "chunk_index": 0,
     "guide_id": "modele-zero-trust"
   }
   ```

   Recommandé : ajouter aussi `guide_nom` et `url` (utile pour Étapes 5 et 6).

   Validation locale : afficher le total de chunks et le nombre de `source` distinctes.

5. **Micro-étape 2.5 — Écrire la sortie**

   Créer `data/` si nécessaire et écrire `data/chunks.json`.

   Validation locale : `test -f data/chunks.json`.

6. **Micro-étape 2.6 — Exécuter les vérifications de l'étape 2**

   Lancer le script puis les checks de cardinalité, schéma et couverture.

   ```bash
   npx tsx src/mastra/rag/build-chunks.ts
   ```

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

   « Pour valider l'étape 2, ton indicateur principal c'est quoi : juste le nombre total de chunks… ou la couverture des 17 `filename` du manifest ? »

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

   Tant qu'un check échoue, ne passe pas à l'Étape 3. »

## Pièges pédagogiques

- Le chunking naïf est **délibéré**. Ne pas laisser le participant « améliorer » maintenant (semantic chunking, nettoyage avancé, reranker…). Noter les défauts observés pour l'Étape 6.
- Les en-têtes/pieds ANSSI polluent les chunks (bruit répétitif inter-pages) : c'est attendu et pédagogique.
- Le `guide_id` n'est pas unique sur les 3 PDFs Windows : vérifier la couverture par `source` (`filename`), pas seulement par `guide_id`.
- Oubli de `mkdir data/` avant écriture de `chunks.json`.
- Tentation de viser `500+` chunks : ce corpus produit ~55 chunks avec la config 500/50, donc viser `≥40`.

## Side quest

Pour les participants en avance : ajouter un mini script d'analyse :

- distribution des tailles (`min`, `max`, `moyenne`) des `text.length`,
- top 3 des `source` qui produisent le plus de chunks,
- affichage de 2 chunks consécutifs d'un même PDF pour observer les quasi-doublons.

Objectif : préparer le débrief Étape 2 sans commencer à corriger la pipeline.

## Transition

« Tu as maintenant ~40–60 morceaux de texte, tous indifférenciés. Au débrief on compare ce que le chunking naïf fait bien (rapidité) et ce qu'il casse (doublons, coupures, bruit d'en-tête). Ensuite on passe à l'Étape 3 (embeddings). »
