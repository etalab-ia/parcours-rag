# Reference pipeline — Module 3 RAG

**Public cible : formateurs et auteurs du module**. Participants ne lisent pas ce dossier pendant l'atelier — sauf s'ils sont bloqués et que le facilitateur les y renvoie explicitement.

## Pourquoi ce dossier existe

Avant de rédiger les étapes en détail, nous avons construit nous-mêmes une pipeline RAG de référence sur le corpus ANSSI. Le but :

1. **Observer** le comportement réel (qualité du chunking, précision du retrieval, hallucinations, citations) — pas anticipé, mesuré.
2. **Formuler les 5 questions d'éval** (Étape 6) en face de ce que la pipeline produit *vraiment*, pas ce qu'on *croit* qu'elle produit.
3. **Donner aux futurs auteurs des Étapes 1–6** une référence de travail à laquelle comparer la sortie attendue à chaque étape.

La pipeline de référence **est fidèle aux décisions pédagogiques du design doc** (chunking naïf 500 tokens / overlap 50, Albert API pour embeddings + chat, LibSQL). Pas d'astuces cachées : elle n'est pas meilleure qu'une implémentation que ferait un participant au bout des 3h.

## Structure

```
reference/
├── README.md           (ce fichier)
├── build-index.ts      extract PDFs → chunk → embed → LibSQL
├── retrieve.ts         retrieve(query, k=5) — utilisé par run-eval
├── generate.ts         agent RAG (génération + citations) — utilisé par run-eval
├── run-eval.ts         exécute les 5 questions d'éval, sérialise les résultats
└── observed-behavior.md  notes qualitatives après run-eval
```

Artefacts générés (gitignored) :

```
data/
├── chunks.json         produit par build-index
├── reference-index.db  produit par build-index (LibSQL)
└── eval-results.json   produit par run-eval
```

Et, committé car c'est le contrat public du workshop :

```
data/
└── eval-questions.json  5 questions + réponses de référence
```

## Comment (re-)lancer

```bash
# depuis la racine du projet, avec .env chargé (ALBERT_API_KEY)
pnpm tsx reference/build-index.ts   # ~2-4 min selon batching
pnpm tsx reference/run-eval.ts      # ~30s
```

Les scripts sont idempotents : re-lancer écrase proprement `data/chunks.json` et ré-initialise l'index.

## Ce qui est volontairement naïf

Comme indiqué dans `design/module-3-design.md`, plusieurs décisions sont volontairement sous-optimales. Elles **doivent** rester telles quelles ici aussi, pour que les failles observées en Étape 6 soient fidèles à ce que les participants verront.

| Décision naïve | Conséquence attendue |
|---|---|
| Chunking page-par-page, 500 tokens, overlap 50 | Phrases coupées entre pages, ordre sujet-verbe brisé, chunks de fin de page courts |
| Pas de header/footer strip | Chunks pollués par le nom du guide, numéros de page, mentions légales |
| Pas de reranker | Top-5 parfois hors-sujet sur questions ambiguës |
| Pas de seuil de score | Questions hors-corpus retournent quand même 5 chunks |
| Prompt système minimal | Pas de garde-fou « dis que tu ne sais pas si le contexte est insuffisant » |

Ne pas « corriger » ces points dans cette pipeline de référence. Ces failles sont le **matériau de l'Étape 6** et l'agenda du Module 4.
