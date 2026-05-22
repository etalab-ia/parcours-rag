# Module 3 — Plan d'analyse pédagogique et supports complémentaires

> Statut : première itération de plan, à discuter avant production du deck final.
> Source principale : `skills/parcours-rag-module3/SKILL.md` et `skills/parcours-rag-module3/references/cp*.md`.
> Cible : supports **deck-ready** pour faciliter l'atelier, plus contenus d'introduction et de suivi pour les participants.

---

## 1. Résumé exécutif

Le Module 3 est déjà solide comme atelier technique : il fait construire un RAG local complet en 6 checkpoints, tout en gardant volontairement une pipeline naïve pour que ses défauts deviennent observables à la fin. Le design pédagogique implicite est bon : il suit une progression **fondation → ingestion → index → retrieval → génération → évaluation**, avec des critères de sortie vérifiables à chaque étape.

L'amélioration prioritaire n'est pas d'ajouter plus de technique, mais de rendre l'intention pédagogique plus visible :

1. **Avant le module** : préparer les participants à l'idée que l'objectif n'est pas de “faire le meilleur RAG”, mais de construire un système suffisamment simple pour comprendre ses points de rupture.
2. **Pendant le module** : utiliser des slides très courtes qui cadrent chaque checkpoint par un message clé, un piège attendu, et une question de débrief.
3. **Après le module** : transformer `eval-findings.md` en pont explicite vers le Module 4 : chaque faille devient une hypothèse d'amélioration mesurable.

La recommandation de conception est un cadre hybride :

- **Backward Design + A-SMART/Bloom** pour clarifier objectifs, preuves d'apprentissage et activités.
- **Merrill First Principles** pour garder l'atelier centré sur un problème réel, démontrer, appliquer, intégrer.
- **Cognitive Load / worked examples** pour éviter de surcharger les participants techniques avec trop d'explications au moment où ils codent.
- **Retrieval practice** pour faire formuler les apprentissages sous forme de questions de rappel et d'auto-évaluation.

---

## 2. Cadres de learning design candidats

### 2.1 Cadre recommandé : hybride pragmatique

Pour ce module, je recommande un cadre en 5 colonnes pour chaque checkpoint :

| Colonne | Question de design | Usage concret |
|---|---|---|
| Objectif critique | Qu'est-ce que le participant doit absolument savoir faire ou diagnostiquer ? | Détermine la slide d'intro et l'exit criterion. |
| Objectifs auxiliaires | Quelles compétences secondaires émergent ? | Nourrit les side quests et le follow-up. |
| Preuve observable | Comment sait-on que l'objectif est atteint ? | Reprend les exit criteria du skill. |
| Piège pédagogique | Quelle confusion veut-on rendre visible ? | Devient la question de débrief. |
| Support complémentaire | Quel contenu facilite avant / pendant / après ? | Slides, fiche participant, exercice de rappel. |

### 2.2 Backward Design + A-SMART/Bloom

Intérêt : le module a déjà des Learning Objectives Bloom (`Appliquer`, `Analyser`, `Évaluer`). Le Backward Design permet de vérifier l'alignement :

1. Résultat attendu : construire et évaluer un RAG naïf.
2. Preuve : artefacts locaux + `eval-findings.md`.
3. Activités : 6 checkpoints agent-pilotés.

À utiliser pour : reformuler les objectifs globaux et par étape en verbes observables.

### 2.3 Merrill First Principles

Merrill est très adapté ici :

- **Problem-centered** : construire un RAG sur corpus ANSSI réel.
- **Activation** : s'appuyer sur Modules 1-2 et sur les intuitions des participants.
- **Demonstration** : slides de cadrage + exemples de sorties attendues.
- **Application** : chaque checkpoint produit un artefact.
- **Integration** : CP6 formalise les failles et prépare Module 4.

À utiliser pour : vérifier que les slides ne sont pas seulement informatives, mais activent/démontrent/appliquent/intègrent.

### 2.4 Cognitive Load, worked examples et fading

Le skill impose déjà la micro-progression : une action, une vérification, un résultat observable. C'est très cohérent avec la réduction de charge cognitive.

Recommandation : les slides ne doivent pas répéter tout le code. Elles doivent fournir :

- le modèle mental de l'étape ;
- le piège à surveiller ;
- le signal de sortie ;
- une question de débrief.

Le détail opérationnel reste dans l'agent participant.

### 2.5 Retrieval practice

À ajouter dans les contenus participants : chaque objectif devient une question de rappel, par exemple :

- “Pourquoi un top-5 peut-il être trompeur hors corpus ?”
- “Quelle preuve distingue une citation traçable d'une citation décorative ?”
- “Pourquoi `count == chunks.length` ne suffit pas si les métadonnées sont absentes ?”

---

## 3. Objectifs pédagogiques globaux

### 3.1 Objectif critique global

À l'issue du Module 3, le participant doit être capable de **construire un RAG local minimal de bout en bout sur un corpus partagé, puis d'en produire une analyse critique appuyée par des preuves observables**.

Ce n'est pas seulement un objectif de construction. Le vrai apprentissage est la boucle complète :

```text
construire → observer → nommer les failles → préparer les améliorations
```

### 3.2 Objectifs critiques globaux

1. **Assembler une pipeline RAG minimale** : setup, ingestion, chunking, embeddings, index, retrieval, génération.
2. **Préserver la traçabilité** : chaque réponse doit pouvoir être reliée à des chunks, sources et pages.
3. **Distinguer fonctionnement et qualité** : un système qui répond n'est pas nécessairement fidèle.
4. **Diagnostiquer les défauts d'une pipeline naïve** : chunking, retrieval, contexte, hallucination, citations.
5. **Préparer une amélioration mesurable** : les failles observées deviennent l'agenda Module 4.

### 3.3 Objectifs auxiliaires globaux

- Prendre en main Mastra en TypeScript sans se perdre dans l'architecture.
- Utiliser Albert API pour génération et embeddings.
- Comprendre les contraintes d'un corpus PDF administratif réel.
- Pratiquer une méthode de debugging par critères observables.
- Documenter ses observations sous une forme réutilisable.

### 3.4 Ce qu'il faut éviter pédagogiquement

- Laisser croire que la qualité d'un RAG se mesure à la fluidité de la réponse.
- Laisser les participants optimiser trop tôt.
- Confondre score de similarité, pertinence et vérité.
- Produire des slides trop techniques qui doublonnent le skill agent.

---

## 4. Analyse détaillée par étape

## 4.1 Étape 0 — Bootstrap workspace

### Rôle dans le module

Le bootstrap n'est pas un objectif conceptuel fort, mais c'est un prérequis critique : il évite que l'atelier devienne un atelier de clonage, d'installation ou de récupération de corpus.

### Objectif critique

Garantir que tous les participants partent d'un workspace atelier homogène, sans clone manuel, avec Mastra, le corpus ANSSI et le skill `mastra` disponibles.

### Objectifs auxiliaires

- Réduire les écarts de configuration entre postes.
- Installer les réflexes de vérification avant action.
- Séparer problèmes d'environnement et problèmes de pipeline RAG.

### Preuves observables

- `src/mastra/index.ts` présent.
- `corpus/anssi-essentiels/manifest.json` présent.
- 17 PDFs disponibles.

### Slide recommandée

**Titre** : “Avant de coder : même terrain de jeu pour tout le monde”

**Message clé** : on standardise l'environnement pour comparer les apprentissages, pas les laptops.

**Note facilitateur** : si plusieurs participants échouent au bootstrap, traiter en plénière immédiatement ; ne pas laisser la salle dériver.

### Prompt de génération de contenu

```text
Génère une slide facilitateur en français pour ouvrir un atelier RAG technique.
Contexte : 20 participants construisent un RAG local sur corpus ANSSI avec Mastra, LibSQL et Albert API.
Objectif de la slide : expliquer que le bootstrap sert à donner à tout le monde le même terrain de jeu, pas à enseigner Git ou npm.
Format : titre court, 3 bullets maximum, une note facilitateur de 60 mots, un signal d'alerte.
Ton : clair, institutionnel, pas marketing.
```

---

## 4.2 Étape 1 — CP1 Setup projet + chat baseline

### Rôle dans le module

CP1 installe la confiance : avant d'ajouter du RAG, le participant vérifie que la chaîne locale, le modèle de génération et l'environnement fonctionnent.

### Objectif critique

Faire tourner Mastra + Albert API localement avec un agent baseline qui répond en français, afin d'isoler les problèmes d'environnement avant les problèmes RAG.

### Objectifs auxiliaires

- Comprendre la différence entre un agent de chat générique et un agent augmenté par corpus.
- Vérifier les dépendances, variables d'environnement, port local et connectivité API.
- Installer un réflexe de diagnostic par exit criteria.

### Preuves observables

- `node_modules/` présent.
- `.env` contient `ALBERT_API_KEY` non vide.
- `npm run dev` expose `http://localhost:4111`.
- `chat-agent` répond en français et reconnaît qu'il n'a pas accès au corpus ANSSI.

### Pièges à exploiter pédagogiquement

- Une clé vide ressemble à un setup réussi tant qu'on ne teste pas l'appel.
- Un agent qui parle bien n'a pas pour autant accès au corpus.
- Les erreurs de port ou de réseau peuvent masquer les vrais apprentissages.

### Slide intro

**Titre** : “CP1 — Valider la fondation avant le RAG”

**Message clé** : si le chat baseline ne marche pas, le RAG ne pourra pas être diagnostiqué.

**À l'écran** :

- Setup local.
- Clé Albert.
- Mastra Studio.
- Réponse française sans contexte ANSSI.

### Slide de débrief

**Question centrale** : “Quelle vérification a isolé le problème le plus vite ?”

**Message à faire émerger** : debugger par couches : dépendances → env → serveur → agent → modèle.

### Contenu participant avant CP1

Une fiche “pré-vol” :

- vérifier Node 20+ ;
- savoir où est la clé Albert ;
- comprendre que le premier agent n'est pas encore un RAG.

### Follow-up participant

Question de rappel : “Quelle différence concrète observes-tu entre un agent baseline et un agent RAG ?”

### Prompts de génération

```text
Génère 2 slides Marp en français pour CP1 d'un atelier RAG.
Slide 1 intro : objectif = valider Mastra + Albert API + chat-agent avant d'ajouter le corpus.
Slide 2 débrief : faire verbaliser les couches de diagnostic (dépendances, .env, port, agent, modèle).
Contraintes : 4 bullets max par slide, inclure notes facilitateur, inclure le signal de passage (>80% avec chat-agent fonctionnel).
Public : participants techniques de l'administration.
```

```text
Rédige une fiche participant pré-atelier de 250 mots pour CP1.
Elle doit expliquer pourquoi on commence par un agent de chat sans RAG, quels prérequis vérifier, et ce que signifie une réponse en français qui mentionne l'absence de contexte ANSSI.
Ton : rassurant, pratique, sans jargon inutile.
```

---

## 4.3 Étape 2 — CP2 Ingestion & chunking

### Rôle dans le module

CP2 transforme le corpus brut en unités manipulables. C'est la première étape où une décision naïve est volontairement introduite pour être critiquée plus tard.

### Objectif critique

Extraire les 17 PDFs ANSSI et produire un `chunks.json` complet, avec métadonnées minimales, en assumant un chunking fixe 500/50.

### Objectifs auxiliaires

- Comprendre qu'un corpus PDF réel contient bruit, doublons, en-têtes et coupures.
- Voir que la couverture du manifest est plus importante qu'un simple nombre total de chunks.
- Préserver les métadonnées nécessaires aux citations futures.

### Preuves observables

- `data/chunks.json` existe.
- Au moins 40 chunks.
- Chaque chunk contient `text`, `source`, `page`, `chunk_index`, `guide_id`.
- Les 17 PDFs du manifest sont représentés.

### Pièges à exploiter pédagogiquement

- Le chunking naïf coupe parfois au mauvais endroit.
- Les en-têtes/pieds de page polluent le contenu.
- `guide_id` n'est pas suffisant pour vérifier la couverture.
- L'amélioration prématurée brouille la comparaison collective.

### Slide intro

**Titre** : “CP2 — Transformer des PDFs en morceaux exploitables”

**Message clé** : le chunking est une décision de design, pas un détail technique.

### Slide de débrief

**Question centrale** : “Qu'est-ce que le chunking naïf rend facile — et qu'est-ce qu'il casse ?”

**Message à faire émerger** : la simplicité rend le système constructible, mais introduit des défauts observables.

### Contenu participant avant CP2

Mini-explication visuelle : “document → pages → chunks → métadonnées”.

### Follow-up participant

Exercice : choisir 2 chunks consécutifs et noter un symptôme de bruit, coupure ou redondance.

### Prompts de génération

```text
Génère une paire de slides CP2 pour un atelier RAG.
Slide intro : expliquer le passage PDF -> texte -> chunks -> métadonnées, avec chunking naïf 500 tokens / overlap 50.
Slide débrief : poser 3 questions sur couverture manifest, bruit de PDF, et défauts du chunking naïf.
Inclure notes facilitateur et un rappel : ne pas optimiser maintenant, noter pour Module 4.
```

```text
Génère un exercice participant post-CP2 de 10 minutes.
Objectif : observer les défauts de chunking dans data/chunks.json sans corriger la pipeline.
Livrable : 3 observations structurées (symptôme, exemple de chunk, hypothèse d'impact sur retrieval).
Public : développeurs / data practitioners.
```

---

## 4.4 Étape 3 — CP3 Embeddings & index vectoriel

### Rôle dans le module

CP3 introduit la représentation vectorielle et l'index local. C'est le passage entre des morceaux de texte lisibles et une structure interrogeable par similarité.

### Objectif critique

Vectoriser tous les chunks avec `openweight-embeddings` et les stocker dans LibSQL avec un count, une dimension et des métadonnées cohérents.

### Objectifs auxiliaires

- Comprendre la notion de dimension d'embedding.
- Découvrir les effets pratiques du batching.
- Voir que des IDs non uniques peuvent produire un système silencieusement faux.
- Maintenir la traçabilité texte → vecteur → source.

### Preuves observables

- `data/index.db` existe.
- `stats.count === chunks.length`.
- Dimension = 1024.
- Smoke query retourne une source et une page.

### Pièges à exploiter pédagogiquement

- Batch trop gros : latence ou erreurs.
- IDs non uniques : écrasements silencieux.
- Index non réinitialisé : résultats obsolètes.
- Mauvais modèle : incohérence durable.

### Slide intro

**Titre** : “CP3 — Chaque chunk devient un point dans l'espace”

**Message clé** : l'index ne vaut que si count, dimension et métadonnées restent cohérents.

### Slide de débrief

**Question centrale** : “Quand `count != chunks.length`, qu'est-ce que cela révèle ?”

**Message à faire émerger** : un index peut exister et être incorrect ; il faut des checks structurels.

### Contenu participant avant CP3

Une analogie courte : embeddings comme coordonnées sémantiques, mais pas comme vérité.

### Follow-up participant

Question de rappel : “Pourquoi préserver `source`, `page` et `chunk_index` au moment de l'upsert ?”

### Prompts de génération

```text
Génère 2 slides CP3 pour un atelier RAG.
Slide intro : expliquer embeddings 1024d + LibSQL sans mathématiques lourdes.
Slide débrief : faire discuter batch size, collisions d'IDs, count vs chunks.length.
Contraintes : éviter le jargon ML avancé, inclure une note facilitateur sur la traçabilité des métadonnées.
```

```text
Rédige une micro-fiche participant intitulée "Un index vectoriel peut être faux même s'il existe".
Inclure 3 causes : mauvais modèle/dimension, IDs non uniques, métadonnées perdues.
Inclure une question d'auto-évaluation pour chaque cause.
```

---

## 4.5 Étape 4 — CP4 Retrieval

### Rôle dans le module

CP4 rend la pipeline interrogeable en langage naturel. C'est l'étape où les participants doivent commencer à se méfier des scores.

### Objectif critique

Implémenter `retrieve(query, k=5)` et vérifier que les résultats sont structurés, triés, contextualisés et au moins plausibles sur une requête cible.

### Objectifs auxiliaires

- Comprendre que la requête est elle aussi embeddée.
- Lire un score comme un signal, pas comme une garantie de vérité.
- Observer qu'une question hors-corpus renvoie quand même un top-k.
- Préparer le débat top-1 / top-5 / top-50.

### Preuves observables

- `retrieve` exportée et exécutable.
- 3 requêtes retournent chacune 5 chunks non vides avec métadonnées.
- Scores décroissants.
- La question Zero Trust remonte au moins un chunk `zero_trust`.

### Pièges à exploiter pédagogiquement

- Mismatch de modèle embedding entre chunks et requête.
- `indexName` incohérent.
- Absence de seuil : hors-corpus produit quand même des résultats.
- Confusion similarité / vérité.

### Slide intro

**Titre** : “CP4 — Retrouver du contexte, pas encore répondre”

**Message clé** : retrieval sélectionne des candidats ; il ne prouve pas qu'ils répondent correctement.

### Slide de débrief

**Question centrale** : “Que signifie vraiment un top-5 sur une question hors corpus ?”

**Message à faire émerger** : le système est forcé de retourner quelque chose ; l'absence de seuil est un choix naïf.

### Contenu participant avant CP4

Un schéma : `question → embedding → similarity search → top-k chunks`.

### Follow-up participant

Comparer `k=3`, `k=5`, `k=8` et noter le compromis signal/bruit.

### Prompts de génération

```text
Génère une slide CP4 intro et une slide CP4 débrief.
Objectif : expliquer retrieve(query, k=5), scores décroissants, top-k, et limite hors-corpus.
Inclure une métaphore simple : top-k comme liste de suspects, pas comme verdict.
Inclure notes facilitateur et 3 questions de débrief.
```

```text
Crée un exercice participant post-CP4.
Le participant exécute la même question avec k=3, k=5, k=8 et remplit un tableau : pertinence, bruit, sources, hypothèse.
Le but est de comprendre le compromis top-k sans introduire reranking.
```

---

## 4.6 Étape 5 — CP5 Génération avec contexte + citations

### Rôle dans le module

CP5 donne l'impression que le système “fonctionne”. C'est donc l'étape la plus dangereuse pédagogiquement : les réponses fluides peuvent masquer des défauts de fidélité.

### Objectif critique

Produire une réponse en français à partir des chunks récupérés, avec citations traçables et comportement prudent lorsque le contexte est insuffisant.

### Objectifs auxiliaires

- Comprendre le rôle du prompt système dans la contrainte de fidélité.
- Distinguer citation formelle et citation réellement soutenante.
- Observer le risque d'hallucination sur une question hors corpus.
- Préparer les critères CP6 : fidélité, complétude, traçabilité.

### Preuves observables

- Point d'entrée RAG exécutable.
- Sur Zero Trust : réponse française avec au moins 2 citations au format convenu.
- Citations cohérentes avec les chunks retournés.
- Sur mots de passe hors-corpus : limites explicites, pas de règles inventées.

### Pièges à exploiter pédagogiquement

- Réponse fluide mais non traçable.
- Citations décoratives.
- Hallucination de bonnes pratiques génériques.
- Format de citation instable.

### Slide intro

**Titre** : “CP5 — Répondre, mais seulement avec preuves”

**Message clé** : une réponse RAG utile doit être ancrée, pas seulement plausible.

### Slide de débrief

**Question centrale** : “Comment distinguer une citation décorative d'une citation probante ?”

**Message à faire émerger** : la citation doit soutenir l'affirmation, pas seulement être présente.

### Contenu participant avant CP5

Un exemple contrastif : même réponse avec citation décorative vs citation probante.

### Follow-up participant

Auto-évaluation d'une réponse : surligner chaque affirmation importante et vérifier sa source.

### Prompts de génération

```text
Génère 2 slides CP5 pour un atelier RAG.
Slide intro : chaîne retrieve -> generate, contrainte de citation [source: filename, pN], règle "si contexte insuffisant, le dire".
Slide débrief : citation décorative vs citation probante, hallucination hors-corpus, réponse fluide mais non fidèle.
Inclure notes facilitateur, exemple minimal non spécifique au code, et question de discussion.
```

```text
Rédige une fiche participant de suivi intitulée "Auditer une réponse RAG en 5 minutes".
Méthode : identifier les affirmations, vérifier les citations, comparer avec chunks, classer fidélité/complétude/traçabilité.
Inclure une grille simple à cocher.
```

---

## 4.7 Étape 6 — CP6 Évaluation + analyse de failles

### Rôle dans le module

CP6 est le point culminant pédagogique. Le participant cesse de construire et commence à juger. C'est ici que le Module 3 devient le tremplin du Module 4.

### Objectif critique

Exécuter 5 questions d'évaluation, documenter les résultats, et nommer au moins 3 failles avec exemple concret et hypothèse de cause.

### Objectifs auxiliaires

- Appliquer des critères explicites : fidélité, complétude, traçabilité.
- Distinguer symptôme, exemple et cause probable.
- Apprendre à ne pas corriger avant d'avoir observé.
- Prioriser les pistes d'amélioration pour Module 4.

### Preuves observables

- `data/eval-results.json` contient 5 questions exécutées.
- `eval-findings.md` existe.
- 5 résultats documentés.
- Au moins 3 failles nommées, chacune avec type, exemple et hypothèse de cause.

### Pièges à exploiter pédagogiquement

- Corriger trop tôt.
- Conclusions vagues.
- Confondre plausible et fidèle.
- Lire un score sans inspecter les chunks.

### Slide intro

**Titre** : “CP6 — On n'optimise pas : on observe”

**Message clé** : l'évaluation transforme une impression en preuve exploitable.

### Slide de débrief final

**Question centrale** : “Quelle faille devient votre première hypothèse Module 4 ?”

**Message à faire émerger** : Module 4 commence avec les failles documentées, pas avec des recettes génériques.

### Contenu participant avant CP6

Une grille d'évaluation en 3 critères : fidélité, complétude, traçabilité.

### Follow-up participant

Transformer 3 failles en backlog Module 4 : impact, cause probable, piste d'amélioration, métrique de succès.

### Prompts de génération

```text
Génère 3 slides pour la fin du Module 3.
Slide CP6 intro : "On n'optimise pas : on observe" avec les critères fidélité, complétude, traçabilité.
Slide CP6 débrief : partager 3 failles observées avec exemple et hypothèse de cause.
Slide pont Module 4 : chaque faille devient une amélioration mesurable.
Inclure notes facilitateur et timing serré pour 20 participants.
```

```text
Rédige un template participant `eval-findings.md` en français.
Sections : Résultats par question, Failles observées, Hypothèses Module 4.
Pour chaque question : fidélité, complétude, traçabilité, citations, commentaire.
Pour chaque faille : type, exemple concret, hypothèse de cause, piste Module 4.
```

---

## 5. Outline recommandé du deck facilitateur

Le deck existant `slides/module-3.md` contient déjà une bonne base. Je recommande une version enrichie mais toujours légère : environ 20-24 slides.

| # | Slide | Rôle |
|---|---|---|
| 1 | Titre — Construis ton RAG | Cadrage institutionnel. |
| 2 | Contrat pédagogique | Construire naïf pour observer. |
| 3 | Architecture cible en 1 schéma | Vue globale pipeline. |
| 4 | Objectifs d'apprentissage | 5 LO globaux. |
| 5 | Agenda 3h | Cadence et règle 80%. |
| 6 | CP1 intro | Fondation technique. |
| 7 | CP1 débrief | Debugger par couches. |
| 8 | CP2 intro | PDF → chunks. |
| 9 | CP2 débrief | Chunking naïf : gains/coûts. |
| 10 | CP3 intro | Embeddings + index. |
| 11 | CP3 débrief | Count, dimension, métadonnées. |
| 12 | Pause | Recadrage. |
| 13 | CP4 intro | Retrieval top-k. |
| 14 | CP4 débrief | Score ≠ vérité. |
| 15 | CP5 intro | Génération avec preuves. |
| 16 | CP5 exemple contrastif | Citation décorative vs probante. |
| 17 | CP5 débrief | Réponse fluide vs fidèle. |
| 18 | CP6 intro | Observer, ne pas corriger. |
| 19 | Grille d'évaluation | Fidélité / complétude / traçabilité. |
| 20 | CP6 débrief | 3 failles nommées. |
| 21 | Pont Module 4 | Failles → améliorations mesurables. |
| 22 | Clôture | Livrables à conserver + next steps. |

---

## 6. Contenus participants recommandés

### 6.1 Avant l'atelier — “Ce que vous allez construire”

Format : 1 page, lecture 5 minutes.

Contenu :

- schéma pipeline RAG naïf ;
- rappel : l'objectif est d'observer les limites ;
- prérequis pratiques ;
- artefacts finaux attendus (`chunks.json`, `index.db`, `eval-findings.md`).

Prompt :

```text
Rédige une fiche d'introduction participant pour un atelier RAG de 3h.
Public : participants techniques de l'administration française.
Objectif : expliquer ce qu'ils vont construire, pourquoi le RAG sera volontairement naïf, quels artefacts ils conserveront, et comment cela prépare le Module 4.
Longueur : 700 mots maximum.
Ton : clair, direct, pas promotionnel.
```

### 6.2 Pendant l'atelier — “Carte des checkpoints”

Format : 1 page imprimable ou markdown.

Colonnes : CP, artefact produit, exit criterion principal, piège à observer, question de débrief.

Prompt :

```text
Génère une carte participant des 6 checkpoints du Module 3 RAG.
Pour chaque checkpoint : nom, artefact produit, critère de sortie principal, piège pédagogique, question à se poser.
Format : tableau markdown compact, en français.
```

### 6.3 Après l'atelier — “De Module 3 à Module 4”

Format : fiche de suivi, 15 minutes.

Contenu : transformer `eval-findings.md` en backlog d'amélioration.

Prompt :

```text
Rédige une fiche de suivi post-atelier pour transformer les failles observées en Module 3 en hypothèses d'amélioration pour Module 4.
Inclure un tableau : faille, exemple, cause probable, amélioration candidate, métrique de succès, priorité.
Inclure 5 questions de réflexion individuelle.
```

---

## 7. Prompts maîtres pour générer les supports

### 7.1 Prompt maître — deck complet

```text
Tu es instructional designer et facilitateur technique.
Génère un deck Marp en français pour le Module 3 "Construis ton RAG" du bootcamp RAG ALLiaNCE/DINUM.

Contexte : atelier 3h en présentiel, 20 participants techniques, corpus ANSSI Les Essentiels, stack Mastra + LibSQL + Albert API.
Intention pédagogique : construire un RAG volontairement naïf pour observer ses limites et préparer le Module 4.

Structure attendue :
1. Titre
2. Contrat pédagogique
3. Architecture cible pipeline RAG
4. Objectifs d'apprentissage
5. Agenda 3h
6-19. Intro + débrief pour CP1 à CP6
20. Grille d'évaluation fidélité/complétude/traçabilité
21. Pont Module 4
22. Clôture

Contraintes :
- Français.
- 4 bullets max par slide.
- Notes facilitateur pour chaque slide.
- Pas de code détaillé, seulement concepts, signaux de passage et questions de débrief.
- Style service public / DINUM, sobre et clair.
```

### 7.2 Prompt maître — guide facilitateur enrichi

```text
À partir du design Module 3 RAG, rédige un guide facilitateur enrichi.
Objectif : aider Luis et Noellie à piloter la salle, pas à expliquer le code.
Inclure : timeline minute par minute, signal de passage par checkpoint, questions de débrief, interventions possibles si blocage systémique, messages à répéter, erreurs pédagogiques à éviter.
Ajouter une section "phrases prêtes à dire" pour recadrer l'optimisation prématurée et rappeler le pont Module 4.
```

### 7.3 Prompt maître — packet participant

```text
Crée un packet participant en français pour Module 3 RAG.
Sections : avant l'atelier, carte des checkpoints, grille d'évaluation, template eval-findings, suivi post-atelier.
Public : participants techniques.
Ton : pratique et autonome.
Ne pas inclure de code complet ; renvoyer au skill agent pour les étapes opérationnelles.
```

---

## 8. Plan d'itération proposé

### Itération 1 — Valider l'architecture pédagogique

Livrable : ce document.

Décisions à valider :

- granularité du deck (20-24 slides) ;
- place du contenu participant avant / pendant / après ;
- vocabulaire des critères d'évaluation ;
- niveau d'explication conceptuelle acceptable dans les slides.

### Itération 2 — Produire les supports markdown

Livrables :

- `slides/module-3.md` enrichi ou nouvelle version `slides/module-3-facilitator.md` ;
- `instructor-guide/module-3.md` enrichi ;
- `reference/module-3-participant-pack.md` ou équivalent.

### Itération 3 — Test à blanc

Objectif : vérifier le timing et la charge cognitive.

Méthode : dérouler le deck sans coder, en simulant les transitions CP.

À mesurer :

- slides trop longues ;
- questions de débrief redondantes ;
- manque d'un schéma ;
- points où le facilitateur risque de refaire le travail de l'agent.

### Itération 4 — Pilote 1-3 testeurs

Objectif : valider que les supports aident sans surcharger.

Questions de retour :

- À quel moment avez-vous compris le mieux le “pourquoi” de l'étape ?
- Quel support était inutile ?
- Quelle question de débrief a produit une vraie prise de conscience ?
- Qu'est-ce qui manque pour revenir au Module 4 ?

---

## 9. Questions ouvertes pour Luis / Noellie

1. Voulez-vous que le deck soit le support principal de facilitation, ou seulement un métronome entre les phases agent-pilotées ?
2. Faut-il produire une fiche participant autonome avant l'atelier, ou éviter de charger les participants avant la session ?
3. Les critères CP6 doivent-ils rester simples (`fidélité`, `complétude`, `traçabilité`) ou introduire aussi `pertinence retrieval` et `qualité citation` ?
4. Souhaitez-vous intégrer un mini “quiz de rappel” entre CP3 et CP4, ou préserver tout le temps pour la pratique ?
5. Le pont Module 4 doit-il mentionner explicitement les techniques futures (reranking, seuils, chunking sémantique, faithfulness eval), ou seulement les catégories de failles ?

---

## 10. Sources et justifications rapides

- **Learning objectives / Backward Design** : objectifs observables, preuves d'apprentissage et activités alignées ; utile pour relier LO, exit criteria et supports.
- **A-SMART / Bloom** : verbes d'action et objectifs mesurables ; cohérent avec LO1-LO5 existants.
- **Merrill First Principles** : problème réel, activation, démonstration, application, intégration ; très adapté au format atelier.
- **Cognitive Load Theory / worked examples** : limiter les slides au modèle mental et laisser le skill gérer le pas-à-pas réduit la surcharge.
- **Retrieval practice** : convertir les LO en questions d'auto-évaluation renforce la mémorisation et prépare le follow-up.

Références web consultées pendant la préparation :

- Writing and Using Learning Objectives — PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC9582829/
- Guidelines for Integrating actionable A-SMART Learning Outcomes into the Backward Design Process — PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC11589412/
- Applying Merrill’s First Principles of Instruction to redesign an online course — Springer: https://link.springer.com/article/10.1007/s11528-021-00658-w
- Cognitive Architecture and Instructional Design — Springer: https://link.springer.com/article/10.1023/A:1022193728205
- Worked examples and cognitive load findings — examples from MDPI / ScienceDirect search results.
