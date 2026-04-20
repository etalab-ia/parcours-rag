# CP2 — Ingestion & chunking

## Objectif

Extraire le texte des 17 PDFs ANSSI et le découper en chunks exploitables, avec un chunking volontairement naïf.

## Learning Objective

**LO1 — Appliquer** : ingestion d'un corpus hétérogène. **LO4 — Analyser** : commencer à sentir où le chunking naïf triche.

## Durée cible

30 min (pilote agent) + 10 min de debrief plénier.

## Brief participant

« On va lire les 17 PDFs, découper chaque document en morceaux de taille fixe, et tout stocker dans un fichier JSON. Chunking naïf exprès : 500 tokens avec overlap de 50. En CP6 on reviendra regarder ce que ce choix nous coûte. »

## Procédure

> ⚠️ Squelette — procédure détaillée à rédiger dans la PR « CP1+CP2 détail ».

Grandes lignes :
1. Choisir l'outil d'extraction PDF (candidat : `@mastra/rag` ou `pdf-parse`).
2. Lire `corpus/anssi-essentiels/manifest.json` pour la liste de documents + métadonnées.
3. Pour chaque PDF : extraire le texte page par page, concaténer.
4. Appliquer un chunker *token-based* taille 500, overlap 50 (cf. skill mastra — MDocument et chunkers intégrés).
5. Écrire `data/chunks.json` : array d'objets `{ text, source, page, chunk_index, guide_id }`.

## Exit criteria

- [ ] `data/chunks.json` existe.
- [ ] Le fichier contient ≥ 500 chunks.
- [ ] Chaque chunk porte au minimum les clés `text`, `source`, `page`.
- [ ] Les 17 guides du manifest sont tous représentés (au moins un chunk par `guide_id`).

## Vérification

> ⚠️ Séquence exacte à rédiger dans la PR « CP1+CP2 détail ».

Idée : lire le JSON, compter les chunks, vérifier les clés du premier et d'un chunk aléatoire, croiser avec le manifest.

## Hint ladder

> ⚠️ À rédiger dans la PR « hint ladder complet ».

1. *Hint socratique* : TODO
2. *Solution complète* : TODO

## Pièges pédagogiques

Le chunking naïf est délibéré. **Ne pas laisser le participant l'améliorer**. Noter les cas où ça va manifestement mal couper (milieu de liste à puces, en-tête de section coupé du paragraphe qui suit, tableaux éclatés) — ces observations deviennent le matériau du débrief plénier.

Autres pièges candidats (à affiner dans la PR détail) : encodage des PDFs, textes en plusieurs colonnes, PDFs qui sont en fait des scans sans OCR.

## Side quest

> ⚠️ À rédiger dans la PR « CP1+CP2 détail ». Candidat : écrire une fonction qui visualise la distribution des tailles de chunks.

## Transition

« Tu as 500+ morceaux de texte, tous indifférenciés. Au debrief on va comparer ce que donne le chunking naïf sur un guide clair (ex: migration) vs un guide structuré (ex: serveur Windows). Après la pause on passe aux embeddings. »
