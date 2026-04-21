# Module 3 — Construis ton RAG (3h)

> Document de conception de travail. Itéré avec Letta Code.
> Langue des livrables participants : **français**. Langue de ce doc de conception : français, commentaires internes en anglais OK.

---

## 1. Paramètres verrouillés

| Dimension | Décision |
|---|---|
| Durée | 3h en présentiel |
| Audience | 20 participants, profils techniques, prérequis modules 1-2, TS, pnpm, agent de codage, clés API |
| Corpus | ANSSI « Les Essentiels » (15 guides FR, 17 PDFs — le filtre UI « 30 » compte FR+EN) |
| Cible finale | Un RAG local fonctionnel **sur corpus partagé** (pour comparabilité en module 4) |
| Foundation | Mastra (TypeScript) |
| Pilotage | Skill « checkpoint-gated linear » exécuté par l'agent de codage de chaque participant |
| Vérification | Agent inspecte fichiers/sortie. Hints progressifs si bloqué. |
| Rythme | Facilitateur pilote la discussion collective entre chaque checkpoint |

## 2. Trois livrables, une source de vérité

```
design/module-3-design.md          ← ce document (source de vérité)
         │
         ├──> .skills/module-3-rag/           (runtime pour l'agent du participant)
         │    ├── SKILL.md                     (entrée, description, orchestration des étapes)
         │    ├── steps/01-setup.md             (une étape = un checkpoint)
         │    ├── steps/02-ingest.md
         │    ├── ...
         │    ├── references/                  (docs techniques, prompts, schémas)
         │    ├── assets/                      (corpus ANSSI pré-téléchargé, questions d'éval)
         │    └── verify/                      (scripts/prompts de vérification par étape)
         │
         ├──> slides/module-3.{md,pdf}         (deck facilitateur)
         │    - 1 slide d'intro par checkpoint
         │    - 1 slide de debrief par checkpoint
         │
         └──> instructor-guide/module-3.md     (playbook facilitateur)
              - Timing minute par minute
              - Signaux d'alerte par checkpoint
              - Questions de debrief
              - Gestion des participants bloqués / en avance
```

**Règle d'or** : si une étape bouge dans le skill, le slide et le guide facilitateur correspondants bougent aussi. On évite la dérive en gardant ce document comme contrat.

## 3. Objectifs pédagogiques (Bloom)

À l'issue de Module 3, chaque participant sera capable de :

1. **[Appliquer]** Ingérer un corpus documentaire hétérogène (PDF ANSSI) dans un index vectoriel local via Mastra.
2. **[Appliquer]** Construire une pipeline de récupération (chunking → embedding → retrieval) et la requêter en langage naturel.
3. **[Appliquer]** Orchestrer récupération + génération pour produire des réponses contextualisées avec citations.
4. **[Analyser]** Identifier au moins 3 failles de sa pipeline (chunking trop grossier, retrieval hors sujet, citations manquantes…) sur une question d'éval.
5. **[Évaluer]** Juger la qualité d'une réponse RAG selon des critères explicites (fidélité, complétude, traçabilité).

Ces 5 LO sont la boussole. Chaque checkpoint du skill doit contribuer à au moins un LO. La vérification d'un checkpoint doit être observable (l'agent peut la constater).

## 4. Découpage temporel (3h = 180 min)

Philosophie : Learning Pyramid — minimiser le lecture-seule (<15%), maximiser pratique (>65%), intégrer discussion (>20%).

| # | Bloc | Durée | Format | LO |
|---|---|---|---|---|
| 0 | **Accueil + cadrage** (pas de code) | 10 min | Plénière slides | — |
| 1 | **Checkpoint 1** — Setup projet Mastra + corpus | 20 min | Agent-piloté, puis debrief 5 min | LO1 |
| 2 | **Checkpoint 2** — Ingestion & chunking | 30 min | Agent-piloté, puis debrief 10 min | LO1, LO4 |
| 3 | **Checkpoint 3** — Embeddings & index vectoriel | 25 min | Agent-piloté, puis debrief 5 min | LO1, LO2 |
| 4 | **Pause** | 10 min | — | — |
| 5 | **Checkpoint 4** — Retrieval & requête | 25 min | Agent-piloté, puis debrief 5 min | LO2 |
| 6 | **Checkpoint 5** — Génération avec contexte + citations | 30 min | Agent-piloté, puis debrief 10 min | LO3 |
| 7 | **Checkpoint 6** — Test sur questions d'éval + analyse de failles | 20 min | Agent-piloté + discussion | LO4, LO5 |
| 8 | **Debrief final + pont vers Module 4** | 10 min | Plénière slides | LO5 |

**Total agent-piloté** : 150 min (83%). **Plénière** : 30 min (17%). Dans les 150 min agent-piloté, chaque debrief intermédiaire (5-10 min) est conduit collectivement — c'est la respiration sociale qui ramène tout le monde au même niveau avant d'avancer.

## 5. Spécification des 6 checkpoints

Pour chaque checkpoint, le skill fournit à l'agent du participant :
- **Brief** : ce qu'on construit, pourquoi, LO ciblé
- **Contexte technique** : fichiers à créer/modifier, APIs Mastra à utiliser, snippets de référence
- **Exit criteria** : conditions observables que l'agent doit vérifier avant d'annoncer "done"
- **Hint ladder** : 3-4 niveaux d'indices, du plus socratique au plus directif, déclenchés sur demande ou frustration

### Checkpoint 1 — Setup (20 min)
**But** : projet Mastra qui démarre, corpus ANSSI téléchargé localement.
**Exit** : `pnpm mastra dev` répond, `corpus/anssi-essentiels/*.pdf` présent avec ≥10 fichiers.
**Hint ladder** : (1) « Vérifie quelle commande Mastra initialise un projet. » → (4) snippet exact `pnpm create mastra@latest`.

### Checkpoint 2 — Ingestion & chunking (30 min)
**But** : extraire le texte des PDFs et les découper en chunks exploitables.
**Décision pédagogique délibérée** : commencer avec un chunking naïf (taille fixe 500 tokens, overlap 50). Laisser le défaut fonctionner. Garder les approches avancées (semantic/structural) pour module 4.
**Exit** : `data/chunks.json` existe, contient ≥40 chunks (référence observée : ~55), chaque chunk a `text`, `source`, `page`.
**Discussion** : pourquoi le chunking naïf marche « à peu près » ? Quand casse-t-il ?

### Checkpoint 3 — Embeddings & index (25 min)
**But** : vectoriser et stocker dans un index local (LibSQL ou PgLite via Mastra).
**Exit** : index contient N vecteurs = N chunks, dimension attendue selon modèle.
**Piège à illustrer** : coût/latence de l'embedding sur ~40-60 chunks — faire toucher le sujet du batching.

### Checkpoint 4 — Retrieval (25 min)
**But** : fonction `retrieve(query, k=5)` qui renvoie les chunks les plus pertinents.
**Exit** : test manuel sur 3 requêtes fournies retourne des chunks sensibles au sujet.
**Discussion** : pourquoi top-5 et pas top-1 ? Pourquoi pas top-50 ?

### Checkpoint 5 — Génération avec citations (30 min)
**But** : agent Mastra qui répond en langage naturel en citant ses sources (guide + page).
**Exit** : sur la question « Quels sont les objectifs principaux du modèle Zero Trust selon l'ANSSI ? », la réponse cite au moins 2 chunks avec source identifiable.
**Piège à illustrer** : hallucination quand le contexte est vide ou hors sujet.

### Checkpoint 6 — Éval & analyse de failles (20 min)
**But** : faire tourner 5 questions d'éval fournies, observer où ça casse, nommer au moins 3 types de failles.
**Questions d'éval** : définies dans `data/eval-questions.json` — 5 questions dont :
  - 1 facile (directement dans un chunk)
  - 1 moyenne (nécessite 2 chunks)
  - 1 piège (réponse ne peut pas être dans le corpus)
  - 1 ambiguë (plusieurs interprétations)
  - 1 multi-document (info répartie sur 3+ guides)
**Exit** : fichier `eval-findings.md` rédigé par le participant, listant 3+ failles observées avec exemples concrets.
**Ceci est le pont direct vers Module 4** : tout le module 4 part de ces failles et apprend à les mesurer et corriger.

## 6. Décisions verrouillées

| # | Choix | Décision |
|---|---|---|
| 1 | **Store vectoriel** | **LibSQL** — built-in Mastra, zéro setup Docker |
| 2 | **Modèle d'embedding** | **Albert API** (`openweight-embeddings` = BAAI/bge-m3, 1024d). Nécessite extension de `AlbertAPIGateway` pour la voie embeddings (voir §9). |
| 3 | **LLM génération** | **Albert API** `openweight-large` (gpt-oss-120b) — souverain, gratuit, déjà intégré côté chat |
| 4 | **Corpus** | **Pré-shippé** dans le repo (`corpus/anssi-essentiels/*.pdf`, 17 PDFs, 2.7 MB total, manifest dans `manifest.json`). Participants ne téléchargent rien → démarrage garanti. |
| 5 | **Template CP1** | Starter Mastra avec **un simple agent de chat sans mémoire**. Point de départ minimal, permet de valider « ça marche » avant d'attaquer le RAG. |
| 6 | **Hint ladder** | **1 hint socratique, puis solution complète**. On ajustera après retours participants. |
| 7 | **Questions d'éval** | Définies dans `data/eval-questions.json` (5 profils : facile, moyenne, piège, ambiguë, multi-document). |

## 9. Gateway Albert — extension embeddings

L'implémentation existante (`AlbertAPIGateway` dans assistant-rh) gère déjà le chat via `resolveLanguageModel`. Pour CP3 il faut ajouter :

- Ajouter `"openweight-embeddings"` à la liste de modèles exposés par `fetchProviders()`
- Implémenter `resolveEmbeddingModel({ modelId, apiKey, ... })` retournant un `EmbeddingModelV2` via `createOpenAICompatible({...}).textEmbeddingModel(modelId)`
- Tester : `embed({ model: dinum("openweight-embeddings"), value: "test" })` → vecteur de 1024 dimensions

Emplacement dans ce repo : `packages/albert-gateway/` (extrait de assistant-rh, enrichi embeddings) — à copier/adapter depuis `~/Code/alliance/assistant-rh/main/apps/mastra-pipeline/src/mastra/gateways/albert.ts`.

## 7. Risques identifiés

| Risque | Mitigation |
|---|---|
| 20 agents hammerent l'API OpenAI en même temps → rate limits | Prévoir un proxy local ou limiter le débit ; prévoir un corpus réduit (top 5 guides) si retard |
| Un participant plante à CP1, bloque toute sa trajectoire | Le skill doit pouvoir sauter en aval si CP1 est validé par fichiers manuellement copiés ; docker image fallback |
| Mastra change d'API entre la conception et le workshop | Verrouiller la version dans le template ; pointer le skill sur la doc embarquée (skill mastra le fait déjà) |
| Le debrief collectif traîne, grignote le temps | Timer visible, facilitateur coupe à X minutes ; questions de debrief pré-écrites dans le guide facilitateur |
| Participants finissent en avance | « Side quest » optionnelle par checkpoint (ex: CP2 → essayer un chunker sémantique) |

## 8. Jalons de conception (ce qu'on va faire ensemble)

1. Trancher les questions ouvertes (§6) — 30 min de discussion ciblée
2. Rédiger le `SKILL.md` d'entrée + squelette des 6 étapes
3. Rédiger en détail CP1 et CP2 (les plus critiques pour la dynamique de démarrage)
4. Construire le corpus et l'index de référence, identifier les 5 questions d'éval
5. Rédiger en détail CP3 → CP6
6. Rédiger le hint ladder complet par checkpoint
7. Rédiger le guide facilitateur
8. Rédiger les slides
9. Test à blanc : faire tourner le skill avec un agent neutre sur un laptop propre
10. Test pilote : 1-3 testeurs techniques externes
