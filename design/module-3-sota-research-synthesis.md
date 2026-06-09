# Module 3 — Synthèse SOTA pour l'itération learning design

> Statut : synthèse de travail pour renforcer le deck facilitateur et les supports Module 3.
> Date : 2026-06-09.
> Périmètre : atelier RAG de 3h, participants techniques, usage d'agents de code, pipeline volontairement naïve.

---

## Résumé exécutif

La proposition actuelle est pédagogiquement solide, mais le passage au niveau “SOTA deep research” change la priorité : il ne suffit plus de construire un RAG naïf puis d'observer ses défauts. Il faut aussi protéger les participants contre un risque documenté de l'apprentissage avec IA générative : **réussir la tâche plus vite sans construire une compréhension transférable**.

Trois lignes de recherche convergent :

1. **Agent-assisted coding education** : les agents améliorent fortement la performance immédiate, mais peuvent réduire l'apprentissage durable si l'apprenant les utilise comme prestataire plutôt que comme tuteur.
2. **RAG evaluation** : la qualité RAG ne se résume pas à “hallucination ou pas”. Les erreurs fréquentes sont souvent la mauvaise récupération, le contexte bruité, la mauvaise interprétation et les citations décoratives.
3. **Instructional design for complex technical workshops** : les ateliers efficaces alternent défi, exemple guidé, estompage, rappel actif, micro-débriefs et évaluation formative. Le facilitateur doit provoquer des “moments de contingence”, pas seulement dérouler des slides.

Conséquence pour Module 3 : le fil rouge devient :

```text
construire → vérifier → expliquer → nommer les failles → préparer l'amélioration
```

La boucle “vérifier → expliquer” est l'ajout principal par rapport au draft précédent.

---

## 1. Agent de code : performance immédiate vs apprentissage réel

### Ce que dit la recherche

Les études récentes sur l'apprentissage de la programmation avec IA générative observent un paradoxe : les apprenants produisent plus vite de meilleurs artefacts, mais n'apprennent pas toujours mieux.

Points à retenir :

- Une méta-analyse de 35 études rapporte des gains significatifs de performance et de temps, mais un effet non significatif sur l'apprentissage conceptuel.
- Bastani et al. montrent qu'un LLM utilisé comme fournisseur de réponses peut dégrader la performance ultérieure sans IA, alors qu'un usage plus tutoriel neutralise ce risque.
- Les travaux sur “Tool, Tutor, or Crutch?” distinguent une boucle d'étayage — critique, explication, vérification — d'une boucle de délégation — copier, exécuter, avancer sans comprendre.
- Le concept de **dette épistémique** décrit l'écart entre “mon code marche” et “je saurais le corriger ou l'adapter sans l'agent”.

### Implication pour Module 3

Le danger n'est pas que les participants échouent. Le danger est qu'ils réussissent trop facilement.

Le deck et le guide facilitateur doivent donc installer trois gestes :

1. **Prédire** ce qu'une étape doit produire avant de lancer l'agent.
2. **Vérifier** avec un signal observable, pas avec l'impression “ça marche”.
3. **Expliquer** à un pair ce que le code ou la sortie prouve réellement.

### Décisions pédagogiques recommandées

- Remplacer le cadrage implicite “l'agent vous guide” par “l'agent est un tuteur, pas un prestataire”.
- Ajouter un court **journal de vérification** rempli pendant l'atelier.
- Introduire un **teach-back** après l'Étape 2 ou 3 : écran fermé, chacun explique à un pair ce que la pipeline sait faire à ce stade.
- Former le facilitateur à repérer les signaux d'alerte : copier-coller sans lecture, “ça marche” sans preuve, demande répétée “fix this error” sans diagnostic.

---

## 2. RAG evaluation : enseigner les bons échecs

### Ce que dit la recherche

Les frameworks RAGAS, RAGChecker, ALCE et les taxonomies récentes de pannes RAG convergent sur une idée : la qualité RAG est multidimensionnelle.

Dimensions utiles pour Module 3 :

| Dimension | Question simple | Pourquoi c'est utile en atelier |
|---|---|---|
| Pertinence du contexte | Les chunks récupérés répondent-ils à la question ? | Sépare l'échec retrieval de l'échec génération. |
| Fidélité / groundedness | Chaque affirmation vient-elle du contexte ? | Évite de juger à la fluidité. |
| Complétude | La réponse couvre-t-elle les éléments attendus ? | Rend visibles les réponses partiellement correctes. |
| Qualité de citation | La citation soutient-elle vraiment l'affirmation ? | Crucial pour l'audit administratif et juridique. |
| Abstention | Le système sait-il dire “je ne sais pas” ? | Réduit les réponses plausibles hors corpus. |

Point important : la “pure hallucination” n'est pas toujours le mode d'échec dominant. Les erreurs plus fréquentes sont souvent :

- contexte pertinent absent ou trop bas dans le top-k ;
- contexte présent mais bruité ;
- contexte mal découpé, anaphore cassée, métadonnées perdues ;
- réponse fidèle à un passage, mais pas à la question ;
- citation présente mais décorative.

### Implication pour Module 3

La grille actuelle “fidélité / complétude / traçabilité” est bonne, mais elle mérite deux enrichissements :

1. Rendre explicite la **pertinence du contexte** avant de juger la génération.
2. Distinguer **traçabilité** et **qualité de citation** : une page citée n'est pas forcément une preuve.

### Décisions pédagogiques recommandées

- En Étape 4, faire dire : “top-k = liste de suspects, pas verdict”.
- En Étape 5, opposer citation probante et citation décorative.
- En Étape 6, utiliser une grille courte en 4 critères : pertinence du contexte, fidélité, complétude, citation.
- Garder les métriques automatiques pour Module 4 ; en Module 3, construire d'abord le jugement humain.

---

## 3. Atelier complexe : charge cognitive, rappel actif, évaluation formative

### Ce que dit la recherche

Un atelier RAG de 3h combine plusieurs charges : TypeScript, Mastra, Albert API, embeddings, vector store, retrieval, génération, citations, évaluation, plus l'agent de code. La charge intrinsèque est donc élevée. Le design doit réduire la charge extrinsèque et réserver l'effort cognitif aux modèles mentaux importants.

Principes convergents :

- **Cognitive Load Theory** : limiter les explications décoratives, donner l'information procédurale juste au moment d'en avoir besoin.
- **Worked examples + fading** : montrer un exemple complet, puis retirer progressivement le support.
- **Retrieval practice** : faire rappeler plusieurs fois les concepts clés, sous forme de questions courtes.
- **Productive failure** : utile pour les concepts, mais risqué pour les procédures d'installation ; ne pas transformer le setup en épreuve.
- **Formative assessment** : le facilitateur doit collecter des preuves rapides d'apprentissage et adapter la cadence.

### Implication pour Module 3

Le format agent-piloté est compatible avec ces principes si le deck sert de métronome :

- une slide d'objectif ;
- une courte mission ;
- un signal de sortie ;
- un micro-débrief ;
- une question de rappel ou de transfert.

Il faut éviter deux excès :

- trop de théorie RAG dans les slides ;
- trop de délégation à l'agent sans moments de verbalisation humaine.

---

## 4. Changements concrets à intégrer

### Dans le deck facilitateur

1. Ajouter un cadrage “réussir ≠ apprendre” en ouverture.
2. Transformer “Comment travailler avec l'agent” en contrat : tuteur, pas prestataire.
3. Ajouter un geste récurrent : “Avant de continuer, quelle preuve avez-vous ?”.
4. Ajouter au moins un teach-back pair-à-pair après l'Étape 2 ou 3.
5. En Étape 6, passer de trois à quatre critères : pertinence contexte, fidélité, complétude, citation.
6. Remplacer le vocabulaire visible `CPx` par `Étape x`.

### Dans le guide facilitateur

Ajouter une section “signaux d'alerte agent-assisted learning” :

| Signal | Risque | Intervention courte |
|---|---|---|
| “Ça marche” sans preuve | Illusion de compétence | “Montre le signal de sortie.” |
| Copie de code non lu | Agent-prestataire | “Explique une ligne clé avant d'exécuter.” |
| Erreur transmise brute à l'agent | Diagnostic externalisé | “Que signifie l'erreur selon toi ?” |
| Optimisation prématurée | Perte du protocole naïf | “Parking Module 4 ; aujourd'hui on observe.” |
| Citation présente mais non vérifiée | Traçabilité décorative | “La citation soutient-elle l'affirmation exacte ?” |

### Dans le support participant

Créer une fiche courte “journal de vérification” :

```text
Étape :
Ce que j'attendais :
Preuve observée :
Ce que j'ai compris :
Ce que je ne sais pas encore expliquer :
Faille ou hypothèse pour Module 4 :
```

---

## 5. Sources principales

### Agent-assisted coding education

- Bastani et al., “Generative AI Can Harm Learning”, PNAS — https://www.pnas.org/doi/10.1073/pnas.2422633122
- “Training to Code with Generative AI”, 2024 — https://arxiv.org/pdf/2409.09047v1
- Prather et al., “The Widening Gap: Benefits and Harms of GenAI for Novice Programmers” — https://arxiv.org/html/2405.17739v1
- Yan et al., “Tool, Tutor, or Crutch?”, IJ STEM Ed — https://link.springer.com/article/10.1186/s40594-025-00592-w
- Li, Liu & Dong, GenAI-supported programming education — https://ajet.org.au/index.php/AJET/article/view/9932

### RAG evaluation

- Es et al., RAGAS, EACL 2024 — https://aclanthology.org/2024.eacl-demo.16.pdf
- RAGAS metrics documentation — https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/
- Gao et al., ALCE, EMNLP 2023 — https://aclanthology.org/2023.emnlp-main.398.pdf
- Ru et al., RAGChecker, NeurIPS 2024 — https://papers.nips.cc/paper_files/paper/2024/file/27245589131d17368cccdfa990cbf16e-Paper-Datasets_and_Benchmarks_Track.pdf
- Barnett et al., “Seven Failure Points When Engineering a RAG System” — https://arxiv.org/abs/2401.05856
- Zhang & Zhang, RAG hallucination review — https://www.mdpi.com/2227-7390/13/5/856

### Instructional design

- Naismith et al., CLT workshop design — https://link.springer.com/content/pdf/10.1007/s40037-015-0221-9.pdf
- Van Merriënboer & Kirschner, 4C/ID — https://web.mit.edu/xtalks/TenStepsToComplexLearning-Kirschner-VanMerrienboer.pdf
- Barbieri et al., worked examples meta-analysis — https://www.danamillercotto.com/uploads/4/7/7/2/47725475/barbieri_et_al__2023__we_meta-analysis.pdf
- Sinha & Kapur, productive failure meta-analysis — https://journals.sagepub.com/doi/full/10.3102/00346543211019105
- Karpicke, retrieval-based learning review — https://learninglab.psych.purdue.edu/downloads/2025/2025_Karpicke_Retrieval_Based_Learning_Review.pdf
- Black & Wiliam, formative assessment theory — https://www.researchgate.net/publication/225590759_Developing_the_theory_of_formative_assessment
