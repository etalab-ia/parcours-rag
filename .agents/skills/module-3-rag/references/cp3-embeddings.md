# CP3 — Embeddings & index vectoriel

## Objectif

Vectoriser l'ensemble des chunks via l'API Albert (`openweight-embeddings`, 1024d) et les stocker dans un index LibSQL local.

## Learning Objective

**LO1 — Appliquer** : embeddings sur un corpus complet. **LO2 — Appliquer** : construction d'un index vectoriel.

## Durée cible

25 min (pilote agent) + 5 min de debrief plénier.

## Brief participant

« Chaque chunk devient un vecteur de 1024 dimensions via l'API Albert. On range tout dans LibSQL — un SQLite augmenté, intégré à Mastra, zéro serveur à démarrer. »

## Procédure

> ⚠️ Squelette — procédure détaillée à rédiger dans la PR « CP3→CP6 détail ».

Grandes lignes :
1. Charger `data/chunks.json`.
2. Batcher les appels à `dinum/albert/openweight-embeddings` (taille de batch à déterminer — sujet pédagogique).
3. Créer un store LibSQL via `@mastra/libsql` (dimension 1024).
4. Upsert : `{ id, vector, metadata: { source, page, guide_id, chunk_index, text } }`. Conserver `chunk_index` (défini en CP2) permet de reconstruire l'ordre des passages lors de la génération et facilite le débogage.
5. Vérifier par `SELECT COUNT(*)` ou API Mastra équivalente que N vecteurs = N chunks.

## Exit criteria

- [ ] Fichier `data/index.db` (ou équivalent LibSQL) créé.
- [ ] Nombre de vecteurs dans l'index = nombre de chunks dans `chunks.json`.
- [ ] Dimension des vecteurs = 1024 (cohérente avec `openweight-embeddings`).
- [ ] Au moins une requête `SELECT` manuelle renvoie un vecteur avec métadonnées non vides.

## Vérification

> ⚠️ Séquence exacte à rédiger dans la PR « CP3→CP6 détail ».

## Hint ladder

> ⚠️ À rédiger dans la PR « hint ladder complet ».

## Pièges pédagogiques

Le coût/latence de l'embedding sur 500+ chunks est le sujet de discussion. À laisser émerger : rate limits Albert, batching, reprise sur erreur. **Ne pas pré-optimiser pour le participant** — on veut qu'il voie le coût.

## Side quest

> ⚠️ À rédiger dans la PR « CP3→CP6 détail ». Candidat : afficher la distance moyenne entre deux vecteurs aléatoires du même guide vs de guides différents.

## Transition

« L'index est chaud, 500+ vecteurs dedans. Au debrief on parle coût et batching. Après ça on passe à la récupération. »
