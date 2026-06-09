# Module 3 — Plan d'analyse pédagogique et supports complémentaires

> Statut : première itération de plan, à discuter avant production du deck final.
> Source principale : `skills/parcours-rag-module3/SKILL.md` et `skills/parcours-rag-module3/references/cp*.md`.
> Cible : supports **deck-ready** pour faciliter l'atelier, plus contenus d'introduction et de suivi pour les participants.

---

## 1. Résumé exécutif

Le Module 3 est déjà solide comme atelier technique : il fait construire un RAG local complet en 6 étapes, tout en gardant volontairement une pipeline naïve pour que ses défauts deviennent observables à la fin. Le design pédagogique implicite est bon : il suit une progression **fondation → ingestion → index → retrieval → génération → évaluation**, avec des critères de sortie vérifiables à chaque étape.

L'amélioration prioritaire n'est pas d'ajouter plus de technique, mais de rendre l'intention pédagogique plus visible :

1. **Avant le module** : préparer les participants à l'idée que l'objectif n'est pas de “faire le meilleur RAG”, mais de construire un système suffisamment simple pour comprendre ses points de rupture.
2. **Pendant le module** : utiliser des slides très courtes qui cadrent chaque étape par un message clé, un piège attendu, et une question de débrief.
3. **Après le module** : transformer `eval-findings.md` en pont explicite vers le Module 4 : chaque faille devient une hypothèse d'amélioration mesurable.

La recommandation de conception est un cadre hybride :

- **Backward Design + A-SMART/Bloom** pour clarifier objectifs, preuves d'apprentissage et activités.
- **Merrill First Principles** pour garder l'atelier centré sur un problème réel, démontrer, appliquer, intégrer.
- **Cognitive Load / worked examples** pour éviter de surcharger les participants techniques avec trop d'explications au moment où ils codent.
- **Retrieval practice** pour faire formuler les apprentissages sous forme de questions de rappel et d'auto-évaluation.


### 1.1 Addendum SOTA — 2026-06-09

Une recherche complémentaire a été ajoutée dans `design/module-3-sota-research-synthesis.md`. Elle renforce le plan sur trois axes :

1. **Agent-assisted learning** : les agents de code améliorent la performance immédiate mais peuvent créer une illusion de compétence si l'apprenant délègue le raisonnement. Le module doit donc installer le triptyque `prédire → vérifier → expliquer`.
2. **Évaluation RAG** : les échecs les plus utiles à enseigner ne sont pas seulement les hallucinations, mais aussi la mauvaise pertinence du contexte, la mauvaise interprétation, la complétude partielle et les citations décoratives.
3. **Design d'atelier complexe** : les slides doivent rester un métronome de facilitation, avec micro-débriefs, preuves observables, rappel actif et évaluation formative.

Conséquence : le fil rouge du Module 3 devient :

```text
construire → vérifier → expliquer → nommer les failles → préparer l'amélioration
```

Décisions intégrées dans la prochaine itération :

- utiliser **Étape** comme vocabulaire participant ;
- cadrer l'agent comme **tuteur, pas prestataire** ;
- ajouter un **journal de vérification participant** ;
- élargir la grille d'évaluation à `contexte`, `fidélité`, `complétude`, `citation` ;
- garder les métriques automatiques détaillées pour le Module 4, afin que le Module 3 construise d'abord le jugement humain.

---

## 2. Cadres de learning design candidats

### 2.1 Cadre recommandé : hybride pragmatique

Pour ce module, je recommande un cadre en 5 colonnes pour chaque étape :

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
3. Activités : 6 étapes agent-pilotées.

À utiliser pour : reformuler les objectifs globaux et par étape en verbes observables.

### 2.3 Merrill First Principles

Merrill est très adapté ici :

- **Problem-centered** : construire un RAG sur corpus ANSSI réel.
- **Activation** : s'appuyer sur Modules 1-2 et sur les intuitions des participants.
- **Demonstration** : slides de cadrage + exemples de sorties attendues.
- **Application** : chaque étape produit un artefact.
- **Integration** : Étape 6 formalise les failles et prépare Module 4.

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

## 4.2 Étape 1 — Setup projet + chat baseline

### Rôle dans le module

Étape 1 installe la confiance : avant d'ajouter du RAG, le participant vérifie que la chaîne locale, le modèle de génération et l'environnement fonctionnent.

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

**Titre** : “Étape 1 — Valider la fondation avant le RAG”

**Message clé** : si le chat baseline ne marche pas, le RAG ne pourra pas être diagnostiqué.

**À l'écran** :

- Setup local.
- Clé Albert.
- Mastra Studio.
- Réponse française sans contexte ANSSI.

### Slide de débrief

**Question centrale** : “Quelle vérification a isolé le problème le plus vite ?”

**Message à faire émerger** : debugger par couches : dépendances → env → serveur → agent → modèle.

### Contenu participant avant Étape 1

Une fiche “pré-vol” :

- vérifier Node 20+ ;
- savoir où est la clé Albert ;
- comprendre que le premier agent n'est pas encore un RAG.

### Follow-up participant

Question de rappel : “Quelle différence concrète observes-tu entre un agent baseline et un agent RAG ?”

### Prompts de génération

```text
Génère 2 slides Slidev en français pour Étape 1 d'un atelier RAG.
Slide 1 intro : objectif = valider Mastra + Albert API + chat-agent avant d'ajouter le corpus.
Slide 2 débrief : faire verbaliser les couches de diagnostic (dépendances, .env, port, agent, modèle).
Contraintes : 4 bullets max par slide, inclure notes facilitateur, inclure le signal de passage (>80% avec chat-agent fonctionnel).
Public : participants techniques de l'administration.
```

```text
Rédige une fiche participant pré-atelier de 250 mots pour Étape 1.
Elle doit expliquer pourquoi on commence par un agent de chat sans RAG, quels prérequis vérifier, et ce que signifie une réponse en français qui mentionne l'absence de contexte ANSSI.
Ton : rassurant, pratique, sans jargon inutile.
```

---

## 4.3 Étape 2 — Ingestion & chunking

### Rôle dans le module

Étape 2 transforme le corpus brut en unités manipulables. C'est la première étape où une décision naïve est volontairement introduite pour être critiquée plus tard.

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

**Titre** : “Étape 2 — Transformer des PDFs en morceaux exploitables”

**Message clé** : le chunking est une décision de design, pas un détail technique.

### Slide de débrief

**Question centrale** : “Qu'est-ce que le chunking naïf rend facile — et qu'est-ce qu'il casse ?”

**Message à faire émerger** : la simplicité rend le système constructible, mais introduit des défauts observables.

### Contenu participant avant Étape 2

Mini-explication visuelle : “document → pages → chunks → métadonnées”.

### Follow-up participant

Exercice : choisir 2 chunks consécutifs et noter un symptôme de bruit, coupure ou redondance.

### Prompts de génération

```text
Génère une paire de slides Étape 2 pour un atelier RAG.
Slide intro : expliquer le passage PDF -> texte -> chunks -> métadonnées, avec chunking naïf 500 tokens / overlap 50.
Slide débrief : poser 3 questions sur couverture manifest, bruit de PDF, et défauts du chunking naïf.
Inclure notes facilitateur et un rappel : ne pas optimiser maintenant, noter pour Module 4.
```

```text
Génère un exercice participant post-étape 2 de 10 minutes.
Objectif : observer les défauts de chunking dans data/chunks.json sans corriger la pipeline.
Livrable : 3 observations structurées (symptôme, exemple de chunk, hypothèse d'impact sur retrieval).
Public : développeurs / data practitioners.
```

---

## 4.4 Étape 3 — Embeddings & index vectoriel

### Rôle dans le module

Étape 3 introduit la représentation vectorielle et l'index local. C'est le passage entre des morceaux de texte lisibles et une structure interrogeable par similarité.

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

**Titre** : “Étape 3 — Chaque chunk devient un point dans l'espace”

**Message clé** : l'index ne vaut que si count, dimension et métadonnées restent cohérents.

### Slide de débrief

**Question centrale** : “Quand `count != chunks.length`, qu'est-ce que cela révèle ?”

**Message à faire émerger** : un index peut exister et être incorrect ; il faut des checks structurels.

### Contenu participant avant Étape 3

Une analogie courte : embeddings comme coordonnées sémantiques, mais pas comme vérité.

### Follow-up participant

Question de rappel : “Pourquoi préserver `source`, `page` et `chunk_index` au moment de l'upsert ?”

### Prompts de génération

```text
Génère 2 slides Étape 3 pour un atelier RAG.
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

## 4.5 Étape 4 — Retrieval

### Rôle dans le module

Étape 4 rend la pipeline interrogeable en langage naturel. C'est l'étape où les participants doivent commencer à se méfier des scores.

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

**Titre** : “Étape 4 — Retrouver du contexte, pas encore répondre”

**Message clé** : retrieval sélectionne des candidats ; il ne prouve pas qu'ils répondent correctement.

### Slide de débrief

**Question centrale** : “Que signifie vraiment un top-5 sur une question hors corpus ?”

**Message à faire émerger** : le système est forcé de retourner quelque chose ; l'absence de seuil est un choix naïf.

### Contenu participant avant Étape 4

Un schéma : `question → embedding → similarity search → top-k chunks`.

### Follow-up participant

Comparer `k=3`, `k=5`, `k=8` et noter le compromis signal/bruit.

### Prompts de génération

```text
Génère une slide Étape 4 intro et une slide Étape 4 débrief.
Objectif : expliquer retrieve(query, k=5), scores décroissants, top-k, et limite hors-corpus.
Inclure une métaphore simple : top-k comme liste de suspects, pas comme verdict.
Inclure notes facilitateur et 3 questions de débrief.
```

```text
Crée un exercice participant post-étape 4.
Le participant exécute la même question avec k=3, k=5, k=8 et remplit un tableau : pertinence, bruit, sources, hypothèse.
Le but est de comprendre le compromis top-k sans introduire reranking.
```

---

## 4.6 Étape 5 — Génération avec contexte + citations

### Rôle dans le module

Étape 5 donne l'impression que le système “fonctionne”. C'est donc l'étape la plus dangereuse pédagogiquement : les réponses fluides peuvent masquer des défauts de fidélité.

### Objectif critique

Produire une réponse en français à partir des chunks récupérés, avec citations traçables et comportement prudent lorsque le contexte est insuffisant.

### Objectifs auxiliaires

- Comprendre le rôle du prompt système dans la contrainte de fidélité.
- Distinguer citation formelle et citation réellement soutenante.
- Observer le risque d'hallucination sur une question hors corpus.
- Préparer les critères Étape 6 : fidélité, complétude, traçabilité.

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

**Titre** : “Étape 5 — Répondre, mais seulement avec preuves”

**Message clé** : une réponse RAG utile doit être ancrée, pas seulement plausible.

### Slide de débrief

**Question centrale** : “Comment distinguer une citation décorative d'une citation probante ?”

**Message à faire émerger** : la citation doit soutenir l'affirmation, pas seulement être présente.

### Contenu participant avant Étape 5

Un exemple contrastif : même réponse avec citation décorative vs citation probante.

### Follow-up participant

Auto-évaluation d'une réponse : surligner chaque affirmation importante et vérifier sa source.

### Prompts de génération

```text
Génère 2 slides Étape 5 pour un atelier RAG.
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

## 4.7 Étape 6 — Évaluation + analyse de failles

### Rôle dans le module

Étape 6 est le point culminant pédagogique. Le participant cesse de construire et commence à juger. C'est ici que le Module 3 devient le tremplin du Module 4.

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

**Titre** : “Étape 6 — On n'optimise pas : on observe”

**Message clé** : l'évaluation transforme une impression en preuve exploitable.

### Slide de débrief final

**Question centrale** : “Quelle faille devient votre première hypothèse Module 4 ?”

**Message à faire émerger** : Module 4 commence avec les failles documentées, pas avec des recettes génériques.

### Contenu participant avant Étape 6

Une grille d'évaluation en 3 critères : fidélité, complétude, traçabilité.

### Follow-up participant

Transformer 3 failles en backlog Module 4 : impact, cause probable, piste d'amélioration, métrique de succès.

### Prompts de génération

```text
Génère 3 slides pour la fin du Module 3.
Slide Étape 6 intro : "On n'optimise pas : on observe" avec les critères fidélité, complétude, traçabilité.
Slide Étape 6 débrief : partager 3 failles observées avec exemple et hypothèse de cause.
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

## 5. Choix d'outil et outline recommandé du deck facilitateur

### 5.1 Recommandation outil

Je recommande de ne pas choisir tout de suite un seul outil “magique”. Le meilleur flux est en deux temps :

1. **Source de vérité versionnée dans le repo** : Slidev en markdown.
   - Avantages : diffable en PR, facile à corriger, compatible avec les prompts détaillés, export PDF/PPTX possible.
   - Usage : stabiliser le contenu, les notes facilitateur, le timing et les schémas.
2. **Version visuelle finalisée dans Canva** après validation du contenu.
   - Avantages : mise en forme professionnelle, brand kit, meilleure qualité perçue en salle.
   - Usage : transformer le deck validé en support visuel propre, sans réinventer la structure.

Les outils d'images génératives doivent rester complémentaires :

| Outil | À utiliser pour | À éviter pour | Commentaire |
|---|---|---|---|
| **Slidev** | Source de vérité, contenu pédagogique, speaker notes, schémas simples, PR review | Design très “polished” sans travail graphique | Meilleur choix pour travailler dans ce repo. |
| **Canva** | Deck final on-brand, version présentable, illustrations, export partageable | Itérer lourdement sur le fond dans un outil non diffable | Très bon après validation du plan. |
| **Gemini image generation** | 4-6 visuels conceptuels : pipeline, chunks, vector space, citation audit, pont Module 4 | Générer tout le deck | Utile pour créer des images insérables dans Slidev/Canva. |
| **Google Flow** | Teaser vidéo, mini-storyboard d'ouverture, transition narrative éventuelle | Slides pédagogiques détaillées | Probablement secondaire pour ce besoin. |

**Décision proposée** : produire d'abord `slides/module-3-facilitator.md` en Slidev avec 40-42 slides, puis générer une version Canva à partir du même slide plan. Canva devient l'outil de finition, pas l'outil de conception pédagogique.

### 5.2 Pourquoi plus de slides que la première proposition

La première proposition (22 slides) était volontairement compacte. Après relecture, je partage ton intuition : pour faciliter correctement un atelier de 3h, il faut davantage de slides, mais pas davantage de texte par slide.

La bonne direction est :

- **plus de slides courtes** ;
- **un seul message par slide** ;
- **des transitions plus explicites** entre “je construis” et “j'observe” ;
- **des slides de respiration** pour recadrer les participants sans casser le rythme.

Cela donne un deck facilitateur autour de **39 slides** : suffisamment dense pour soutenir l'animation, mais toujours léger pendant les phases agent-pilotées.

### 5.3 Outline recommandé — version 39 slides

| # | Slide | Rôle pédagogique | Type visuel recommandé |
|---:|---|---|---|
| 1 | Titre — Construis ton RAG | Installer le cadre ALLiaNCE/DINUM. | Cover sobre. |
| 2 | Aujourd'hui, on construit volontairement naïf | Expliquer le contrat : apprendre par observation. | Statement slide. |
| 3 | Ce que vous aurez à la fin | Rendre les livrables concrets. | Liste artefacts + icônes. |
| 4 | La pipeline cible en une image | Donner la carte mentale globale. | Diagramme horizontal. |
| 5 | Rôles : vous, votre agent, le facilitateur | Éviter la confusion agent/facilitateur. | 3 colonnes. |
| 6 | Les 5 objectifs d'apprentissage | Rendre les LO visibles. | Carte LO1→LO5. |
| 7 | Agenda et règle de cadence | Donner le tempo. | Timeline 180 min. |
| 8 | Comment travailler avec l'agent | Rappeler micro-étapes et exit criteria. | Checklist. |
| 9 | Étape 1 — Mission | Ouvrir setup. | Section divider. |
| 10 | Baseline : un agent qui parle, pas encore un RAG | Distinguer chat vs RAG. | Schéma minimal. |
| 11 | Étape 1 — Signal de sortie | Clarifier la preuve observable. | Checklist sortie. |
| 12 | Étape 1 — Débrief | Faire émerger le debugging par couches. | Question slide. |
| 13 | Étape 2 — Mission | Ouvrir ingestion. | Section divider. |
| 14 | Du PDF au chunk | Expliquer la transformation. | Diagramme flux. |
| 15 | Le contrat de métadonnées | Montrer pourquoi source/page/chunk_index comptent. | Table annotée. |
| 16 | Chunking naïf : pourquoi on l'assume | Légitimer le défaut volontaire. | Split gains/coûts. |
| 17 | Étape 2 — Débrief | Observer bruit, coupures, couverture. | Question slide. |
| 18 | Étape 3 — Mission | Ouvrir embeddings/index. | Section divider. |
| 19 | Embeddings : coordonnées sémantiques, pas vérité | Installer le modèle mental. | Nuage 2D stylisé. |
| 20 | Index vectoriel : trois checks vitaux | Count, dimension, métadonnées. | Checklist technique. |
| 21 | Étape 3 — Débrief | Batching, IDs, index faux. | Question slide. |
| 22 | Pause — où en est la pipeline ? | Recadrer avant retrieval. | Pipeline avec étapes cochées. |
| 23 | Étape 4 — Mission | Ouvrir retrieval. | Section divider. |
| 24 | La requête devient un vecteur | Expliquer query embedding. | Diagramme question→vecteur→top-k. |
| 25 | Top-k : liste de suspects, pas verdict | Prévenir confusion score/vérité. | Métaphore enquête. |
| 26 | Étape 4 — Débrief | Top-1/top-5/top-50 et hors corpus. | Question slide. |
| 27 | Étape 5 — Mission | Ouvrir génération. | Section divider. |
| 28 | `retrieve -> generate` | Montrer l'orchestration. | Pipeline courte. |
| 29 | Le contrat de réponse | Répondre seulement avec contexte + citations. | Règles de prompt. |
| 30 | Citation probante vs décorative | Faire sentir la différence qualité. | Exemple contrastif. |
| 31 | Étape 5 — Débrief | Fluidité vs fidélité. | Question slide. |
| 32 | Étape 6 — Mission | Ouvrir évaluation. | Section divider. |
| 33 | On n'optimise pas : on observe | Bloquer la tentation de corriger. | Statement slide. |
| 34 | La grille : fidélité / complétude / traçabilité | Donner l'outil de jugement. | Matrice 3 critères. |
| 35 | Nommer une faille correctement | Type + exemple + cause probable. | Template annoté. |
| 36 | Étape 6 — Débrief | Partager 3 failles et causes. | Discussion slide. |
| 37 | Pont Module 4 | Transformer failles en améliorations mesurables. | Funnel failles→hypothèses→tests. |
| 38 | Ce qu'il faut conserver | Artefacts et notes utiles. | Checklist livrables. |
| 39 | Clôture | Rappel de la boucle d'apprentissage. | Construire→observer→améliorer. |

### 5.4 Variante si l'on veut plus d'explication conceptuelle

Si l'audience se révèle moins à l'aise avec RAG que prévu, ajouter 5 slides optionnelles, à activer seulement si nécessaire :

| Slide optionnelle | À placer après | But |
|---|---:|---|
| “RAG en 90 secondes” | 4 | Rappeler génération augmentée vs modèle seul. |
| “Pourquoi les PDFs sont pénibles” | 14 | Expliquer extraction, structure perdue, bruit. |
| “Pourquoi les embeddings rapprochent sans comprendre” | 19 | Nuancer la représentation vectorielle. |
| “Quand le top-k force une mauvaise réponse” | 25 | Montrer le hors-corpus avec top-k obligatoire. |
| “Évaluer avant d'améliorer” | 33 | Préparer Module 4 par démarche scientifique. |

**Règle** : ces slides sont des amortisseurs pédagogiques, pas le parcours nominal. Les garder en annexe ou en backup dans le deck.

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

### 6.2 Pendant l'atelier — “Carte des étapes”

Format : 1 page imprimable ou markdown.

Colonnes : CP, artefact produit, exit criterion principal, piège à observer, question de débrief.

Prompt :

```text
Génère une carte participant des 6 étapes du Module 3 RAG.
Pour chaque étape : nom, artefact produit, critère de sortie principal, piège pédagogique, question à se poser.
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

## 7. Prompts détaillés pour générer les supports

Les prompts précédents étaient utiles comme brouillons, mais trop courts pour obtenir un bon deck. Cette section propose des prompts directement utilisables, structurés par outil et par lot de production.

### 7.1 Prompt maître — génération Slidev dans le repo

À utiliser pour créer un deck versionné, relisible en PR, avec speaker notes. C'est le meilleur premier livrable.

```text
Tu es instructional designer, facilitateur technique et auteur de supports pédagogiques pour l'administration française.

Tâche : générer un deck Slidev en markdown pour le Module 3 "Construis ton RAG" du bootcamp RAG ALLiaNCE/DINUM.

Contexte atelier :
- Durée : 3h en présentiel.
- Public : environ 20 participants techniques, ayant suivi les modules 1-2.
- Stack : Mastra + LibSQL + Albert API.
- Corpus : 17 PDFs ANSSI "Les Essentiels".
- Modalité : chaque participant travaille avec un agent de codage qui guide les micro-étapes ; le facilitateur cadence la salle et anime les débriefs.
- Intention pédagogique : construire un RAG volontairement naïf, non pas pour optimiser la performance, mais pour rendre les failles observables et préparer le Module 4.

Contraintes pédagogiques :
- Un seul message clé par slide.
- 3 à 5 bullets maximum par slide.
- Pas de code détaillé dans les slides ; le code appartient au skill agent.
- Toujours inclure des speaker notes en commentaire HTML.
- Les speaker notes doivent contenir : ce que le facilitateur dit, la durée cible, la question à poser, le signal de passage.
- Style : sobre, service public, clair, pas marketing.
- Langue : français.

Structure du deck : produire 39 slides.
1. Titre — Construis ton RAG
2. Aujourd'hui, on construit volontairement naïf
3. Ce que vous aurez à la fin
4. La pipeline cible en une image
5. Rôles : vous, votre agent, le facilitateur
6. Les 5 objectifs d'apprentissage
7. Agenda et règle de cadence
8. Comment travailler avec l'agent
9. Étape 1 — Mission
10. Baseline : un agent qui parle, pas encore un RAG
11. Étape 1 — Signal de sortie
12. Étape 1 — Débrief
13. Étape 2 — Mission
14. Du PDF au chunk
15. Le contrat de métadonnées
16. Chunking naïf : pourquoi on l'assume
17. Étape 2 — Débrief
18. Étape 3 — Mission
19. Embeddings : coordonnées sémantiques, pas vérité
20. Index vectoriel : trois checks vitaux
21. Étape 3 — Débrief
22. Pause — où en est la pipeline ?
23. Étape 4 — Mission
24. La requête devient un vecteur
25. Top-k : liste de suspects, pas verdict
26. Étape 4 — Débrief
27. Étape 5 — Mission
28. retrieve -> generate
29. Le contrat de réponse
30. Citation probante vs décorative
31. Étape 5 — Débrief
32. Étape 6 — Mission
33. On n'optimise pas : on observe
34. La grille : fidélité / complétude / traçabilité
35. Nommer une faille correctement
36. Étape 6 — Débrief
37. Pont Module 4
38. Ce qu'il faut conserver
39. Clôture

Détails de contenu par slide :
- Chaque slide CP mission doit inclure : objectif de l'étape, artefact produit, piège à observer.
- Chaque slide signal de sortie doit inclure : critère observable, commande ou artefact attendu, erreur fréquente.
- Chaque slide de débrief doit inclure : une question principale, deux relances possibles, message clé à faire émerger.
- Les slides conceptuelles doivent utiliser des diagrammes simples : pipeline, transformation PDF→chunks, top-k, citation audit, failles→hypothèses.

Exemples de messages clés à préserver :
- "Un agent qui parle n'est pas encore un RAG."
- "Le chunking est une décision de design, pas un détail technique."
- "Un index peut exister et être faux."
- "Un score de similarité n'est pas une preuve de vérité."
- "Une citation présente n'est pas forcément une citation probante."
- "En Étape 6, on observe avant d'améliorer."

Sortie attendue :
- Un fichier markdown complet prêt à enregistrer en `slides/module-3-facilitator.md`.
- Frontmatter Slidev minimal.
- Séparateurs de slides `---`.
- Speaker notes en commentaires HTML après chaque slide.
- Pas d'images externes obligatoires ; utiliser Mermaid ou schémas texte si nécessaire.
```

### 7.2 Prompt maître — Canva

À utiliser après validation du contenu, pour obtenir une version plus visuelle. Il suit le format recommandé par le skill Canva : brief, arc narratif, slide plan.

```text
Presentation Brief
Title: Module 3 — Construis ton RAG
Topic/Scope: Atelier présentiel de 3h pour construire un RAG local volontairement naïf sur le corpus ANSSI Les Essentiels, avec Mastra, LibSQL et Albert API, puis analyser ses failles.
Audience: 20 participants techniques de l'administration française ; facilitateurs : ALLiaNCE / DINUM.
Key Messages:
1. On construit un RAG simple pour comprendre son fonctionnement, pas pour atteindre la meilleure performance.
2. Chaque étape produit un artefact observable et vérifiable.
3. La traçabilité (source, page, chunk) est aussi importante que la réponse générée.
4. Une réponse fluide peut être fausse, non fidèle ou mal citée.
5. Les failles documentées en Module 3 deviennent les hypothèses d'amélioration du Module 4.
Style Guide:
- Style service public français : sobre, lisible, institutionnel, chaleureux sans être marketing.
- Palette suggérée : bleu institutionnel, gris clair, blanc, accent violet/bleu pour les étapes actives.
- Typographie : sans-serif lisible, hiérarchie forte, peu de texte.
- Visuels : schémas vectoriels simples, cartes de pipeline, icônes document/base de données/loupe/bulle de réponse/checklist.
- Éviter : photos génériques de robots, images futuristes, surcharge de texte, jargon non expliqué.

Narrative Arc
Le deck suit une progression "Construire → Observer → Nommer → Améliorer". On commence par installer le contrat pédagogique : le RAG sera volontairement naïf. Ensuite, chaque étape ajoute une brique concrète à la pipeline : setup, ingestion, index, retrieval, génération. Les débriefs transforment chaque brique technique en apprentissage : quelles preuves avons-nous, quels pièges voyons-nous, quelles limites apparaissent ? La fin du module bascule de la construction vers l'évaluation : les participants documentent les failles dans `eval-findings.md`, qui devient le point de départ du Module 4.

Slide Plan
Slide 1 — "Module 3 — Construis ton RAG"
Goal: Ouvrir l'atelier et situer le module dans le bootcamp.
Bullets:
- Atelier pratique de 3h
- Corpus ANSSI partagé
- Mastra + LibSQL + Albert API
- Objectif : construire puis analyser
Visuals: Cover sobre avec ligne de pipeline stylisée en bas.
Speaker Notes: Accueillir, rappeler que l'atelier est pratique. Insister sur le fait que le facilitateur cadence la salle tandis que les agents accompagnent chaque participant.

Slide 2 — "Aujourd'hui, on construit volontairement naïf"
Goal: Poser le contrat pédagogique.
Bullets:
- Pas de quête de performance maximale
- Des choix simples et inspectables
- Des défauts assumés pour apprendre
- Module 4 partira de ces défauts
Visuals: Split screen "optimiser tout de suite" barré vs "observer d'abord" validé.
Speaker Notes: Dire explicitement que les participants auront envie d'améliorer ; on note ces idées, mais on ne les implémente pas pendant Module 3.

Slide 3 — "Ce que vous aurez à la fin"
Goal: Rendre les livrables concrets.
Bullets:
- Un corpus découpé en chunks
- Un index vectoriel local
- Une fonction retrieval
- Un agent RAG avec citations
- Un fichier `eval-findings.md`
Visuals: 5 cartes artefacts avec icônes.
Speaker Notes: Les artefacts sont importants car ils rendent la progression vérifiable, pas seulement ressentie.

Slide 4 — "La pipeline cible en une image"
Goal: Donner la carte mentale globale.
Bullets:
- PDF → chunks
- chunks → embeddings
- question → retrieval
- contexte → réponse citée
- évaluation → failles
Visuals: Diagramme horizontal en 5 blocs avec flèches.
Speaker Notes: Cette slide reviendra mentalement à chaque étape. Pointer où l'on se situe avant chaque phase.

Slide 5 — "Rôles : vous, votre agent, le facilitateur"
Goal: Clarifier la dynamique de salle.
Bullets:
- Participant : construit et observe
- Agent : guide et vérifie localement
- Facilitateur : cadence et débriefe
- Groupe : compare les apprentissages
Visuals: Trois colonnes ou triangle de rôles.
Speaker Notes: Réduire la confusion : l'agent n'anime pas la plénière ; le facilitateur ne remplace pas le guidage individuel.

Slide 6 — "Les 5 objectifs d'apprentissage"
Goal: Rendre visibles les LO globaux.
Bullets:
- Appliquer : ingestion et indexation
- Appliquer : retrieval en langage naturel
- Appliquer : génération avec citations
- Analyser : failles de pipeline
- Évaluer : fidélité, complétude, traçabilité
Visuals: Échelle LO1→LO5 avec changement de couleur pour Appliquer/Analyser/Évaluer.
Speaker Notes: L'objectif le plus important n'est pas seulement "ça marche", mais "je sais juger comment ça marche".

Slide 7 — "Agenda et règle de cadence"
Goal: Donner le tempo de l'atelier.
Bullets:
- 6 étapes
- Alternance pratique + débrief
- Passage quand 80% atteignent l'exit minimal
- Parking lot pour Module 4
Visuals: Timeline 180 min.
Speaker Notes: Préparer la salle à avancer même si tout n'est pas parfait. Les retards individuels seront traités sans bloquer tout le groupe.

Slide 8 — "Comment travailler avec l'agent"
Goal: Installer le mode opératoire.
Bullets:
- Une micro-étape à la fois
- Lire le résultat avant de continuer
- Ne pas copier sans comprendre
- Garder les idées d'optimisation pour Module 4
Visuals: Checklist courte.
Speaker Notes: Insister sur la responsabilité du participant : l'agent aide, mais l'apprentissage vient de l'observation et des questions.

Slides 9-12 — Étape 1 Setup
Goal: Ouvrir, expliquer, vérifier et débriefer Étape 1.
Required content:
- Mission : valider Mastra + Albert API + chat baseline.
- Concept : un agent qui parle n'a pas encore accès au corpus.
- Exit : `node_modules`, `.env`, `npm run dev`, `chat-agent` répond en français.
- Débrief : diagnostic par couches (dépendances, env, serveur, agent, modèle).
Visuals: baseline chat vs RAG augmenté ; checklist de sortie.
Speaker Notes: Faire émerger les problèmes d'environnement avant le code RAG.

Slides 13-17 — Étape 2 Ingestion & chunking
Goal: Expliquer PDF→chunks et faire observer les défauts du chunking naïf.
Required content:
- Mission : extraire 17 PDFs et produire `data/chunks.json`.
- Concept : document → pages → chunks → métadonnées.
- Métadonnées : `text`, `source`, `page`, `chunk_index`, `guide_id`.
- Piège : count global insuffisant ; vérifier couverture manifest.
- Débrief : bruit, coupures, doublons, pourquoi ne pas optimiser.
Visuals: découpage de page en chunks ; table de métadonnées annotée.
Speaker Notes: Rappeler que 500/50 est volontairement naïf.

Slides 18-21 — Étape 3 Embeddings & index
Goal: Expliquer embeddings et intégrité d'index.
Required content:
- Mission : vectoriser tous les chunks et stocker dans LibSQL.
- Concept : coordonnées sémantiques, pas vérité.
- Checks : count = chunks.length, dimension = 1024, métadonnées présentes.
- Débrief : batching, IDs uniques, index obsolète.
Visuals: nuage de points simplifié ; checklist index.
Speaker Notes: Insister sur les erreurs silencieuses : un index peut exister et être faux.

Slide 22 — Pause / état de pipeline
Goal: Recadrer après la pause.
Bullets:
- Corpus découpé
- Vecteurs créés
- Index prêt
- Prochaine étape : interroger
Visuals: pipeline avec Étape 1-Étape 3 cochés.
Speaker Notes: Utiliser cette slide pour reprendre le groupe et vérifier rapidement le niveau global.

Slides 23-26 — Étape 4 Retrieval
Goal: Expliquer top-k et limites des scores.
Required content:
- Mission : `retrieve(query, k=5)`.
- Concept : la question devient un vecteur.
- Piège : hors-corpus renvoie quand même un top-k.
- Débrief : top-1/top-5/top-50 ; score ≠ vérité.
Visuals: question→embedding→top-k ; métaphore liste de suspects.
Speaker Notes: Faire verbaliser que retrieval sélectionne des candidats, pas une vérité.

Slides 27-31 — Étape 5 Génération + citations
Goal: Relier retrieval et génération, puis introduire l'audit des citations.
Required content:
- Mission : produire une réponse française citée.
- Chaîne : retrieve → contexte → generate.
- Contrat : répondre seulement avec les passages fournis.
- Citation probante vs citation décorative.
- Débrief : fluidité vs fidélité, hallucination hors corpus.
Visuals: pipeline courte ; exemple contrastif de citation.
Speaker Notes: Faire tester la question hors-corpus et ne pas se satisfaire d'une belle réponse.

Slides 32-36 — Étape 6 Évaluation
Goal: Basculer de construction à jugement.
Required content:
- Mission : 5 questions, 5 résultats, 3 failles nommées.
- Règle : observer, ne pas optimiser.
- Grille : fidélité, complétude, traçabilité.
- Template faille : type, exemple concret, hypothèse de cause.
- Débrief : quelles failles deviennent prioritaires ?
Visuals: matrice d'évaluation ; fiche faille annotée.
Speaker Notes: Ne pas laisser les participants corriger avant d'avoir documenté.

Slides 37-39 — Clôture
Goal: Fermer le module et préparer Module 4.
Required content:
- Failles → hypothèses → améliorations mesurables.
- Artefacts à conserver : `chunks.json`, `index.db`, `eval-results.json`, `eval-findings.md`.
- Boucle d'apprentissage : construire → observer → nommer → améliorer.
Visuals: funnel ou boucle.
Speaker Notes: Clore sur l'idée que Module 4 ne sera pas une liste d'astuces, mais une réponse aux failles observées.
```

### 7.3 Prompt maître — génération d'images conceptuelles avec Gemini

À utiliser pour créer quelques visuels réutilisables dans Slidev/Canva. Ne pas demander à Gemini de faire tout le deck.

```text
Génère une illustration vectorielle sobre, style service public français, format 16:9, fond clair, couleurs bleu institutionnel / gris / accent violet.
Sujet : [remplacer par un sujet ci-dessous].
Contraintes : pas de robot humanoïde, pas de science-fiction, pas de logos officiels non fournis, pas de texte illisible dans l'image. L'image doit fonctionner comme support pédagogique pour un atelier RAG technique.

Sujets à générer séparément :
1. Pipeline RAG naïve : PDF -> chunks -> embeddings -> retrieval -> réponse citée -> évaluation.
2. Chunking naïf : une page PDF découpée en blocs avec chevauchement, montrant une coupure imparfaite.
3. Espace vectoriel : des chunks comme points proches d'une question, avec une zone "top-k".
4. Citation probante vs citation décorative : deux cartes de réponse, l'une reliée à une source, l'autre avec une citation flottante non reliée.
5. Pont Module 3 vers Module 4 : failles observées -> hypothèses -> améliorations mesurables.

Pour chaque image, produire aussi :
- un alt text en français ;
- une légende courte ;
- une recommandation de slide où l'utiliser.
```

### 7.4 Prompt détaillé — Étape 1 Setup

```text
Génère les slides 9 à 12 du deck Module 3 RAG, en français, pour Étape 1 Setup.

Contexte Étape 1 : les participants doivent faire tourner Mastra + Albert API localement avec un agent baseline `chat-agent` qui répond en français. Le RAG n'est pas encore branché.

Slides attendues :
1. "Étape 1 — Mission : valider la fondation"
   - Objectif : installer la confiance technique.
   - Bullets : dépendances, `.env`, serveur local, chat-agent.
   - Visual : section divider avec mini-pipeline où seule la brique "chat baseline" est active.
2. "Un agent qui parle n'est pas encore un RAG"
   - Objectif : distinguer LLM baseline et RAG augmenté.
   - Bullets : pas de corpus, pas de retrieval, pas de citations, pas encore d'ancrage documentaire.
   - Visual : deux cartes côte à côte "Chat baseline" vs "RAG".
3. "Étape 1 — Signal de sortie"
   - Objectif : rendre les exit criteria observables.
   - Bullets : `node_modules`, `ALBERT_API_KEY`, `localhost:4111`, réponse en français.
   - Visual : checklist.
4. "Étape 1 — Débrief : debugger par couches"
   - Objectif : faire verbaliser la méthode de diagnostic.
   - Question principale : "Quelle vérification a isolé le problème le plus vite ?"
   - Relances : clé vide ? mauvais dossier ? port occupé ? réseau ?

Contraintes :
- 4 bullets max par slide.
- Speaker notes de 80-120 mots par slide.
- Inclure le signal de passage : >80% avec chat-agent fonctionnel.
- Ne pas fournir de procédure complète de code : l'agent participant s'en charge.
```

### 7.5 Prompt détaillé — Étape 2 Ingestion & chunking

```text
Génère les slides 13 à 17 du deck Module 3 RAG, en français, pour Étape 2 Ingestion & chunking.

Contexte Étape 2 : les participants extraient le texte des 17 PDFs ANSSI et génèrent `data/chunks.json` avec un chunking volontairement naïf de 500 tokens et overlap 50.

Slides attendues :
1. "Étape 2 — Mission : transformer les PDFs en chunks"
   - Artefact : `data/chunks.json`.
   - Objectif critique : couvrir les 17 PDFs, pas seulement produire un nombre de chunks.
   - Piège : vouloir optimiser trop tôt.
2. "Du PDF au chunk"
   - Montrer la transformation document -> pages -> chunks -> JSON.
   - Message clé : on perd de la structure en chemin.
   - Visual : diagramme en 4 blocs.
3. "Le contrat de métadonnées"
   - Expliquer `text`, `source`, `page`, `chunk_index`, `guide_id`.
   - Message clé : les métadonnées d'aujourd'hui permettent les citations de Étape 5.
   - Visual : exemple de ligne JSON simplifiée, annotée.
4. "Chunking naïf : pourquoi on l'assume"
   - Côté gains : rapide, compréhensible, comparable.
   - Côté coûts : coupures, bruit, doublons, perte de contexte.
   - Message clé : défaut volontaire = matière pour Étape 6.
5. "Étape 2 — Débrief : compter ne suffit pas"
   - Question principale : "Qu'est-ce que la couverture manifest révèle que le count ne voit pas ?"
   - Relances : en-têtes, pieds de page, guide_id non unique, chunks consécutifs redondants.

Contraintes :
- 3-5 bullets par slide.
- Notes facilitateur de 100 mots par slide.
- Inclure une activité éclair : demander à 2 participants de citer un défaut de chunk observé.
- Ne pas introduire semantic chunking comme solution ; le garder pour Module 4.
```

### 7.6 Prompt détaillé — Étape 3 Embeddings & index

```text
Génère les slides 18 à 21 du deck Module 3 RAG, en français, pour Étape 3 Embeddings & index vectoriel.

Contexte Étape 3 : les participants transforment chaque chunk en vecteur 1024d via `openweight-embeddings` et stockent les vecteurs dans LibSQL.

Slides attendues :
1. "Étape 3 — Mission : rendre les chunks interrogeables"
   - Artefact : `data/index.db`.
   - Objectif : vecteurs + métadonnées + index local.
2. "Embeddings : coordonnées sémantiques, pas vérité"
   - Expliquer sans mathématiques lourdes.
   - Message clé : proximité ne signifie pas exactitude.
   - Visual : nuage de points 2D simplifié.
3. "Index vectoriel : trois checks vitaux"
   - `count == chunks.length`.
   - dimension = 1024.
   - métadonnées présentes.
   - Message clé : un index peut exister et être faux.
4. "Étape 3 — Débrief : les erreurs silencieuses"
   - Questions : batch size stable ? IDs uniques ? index réinitialisé ? métadonnées perdues ?

Contraintes :
- Notes facilitateur avec analogie simple pour embeddings.
- Inclure un avertissement sur collisions d'IDs.
- Éviter les équations et la théorie ML avancée.
```

### 7.7 Prompt détaillé — Étape 4 Retrieval

```text
Génère les slides 23 à 26 du deck Module 3 RAG, en français, pour Étape 4 Retrieval.

Contexte Étape 4 : les participants implémentent `retrieve(query, k=5)` qui embedde la question, interroge l'index LibSQL et retourne les chunks les plus similaires.

Slides attendues :
1. "Étape 4 — Mission : retrouver du contexte"
   - Artefact : fonction `retrieve`.
   - Message clé : on sélectionne des candidats, on ne répond pas encore.
2. "La requête devient un vecteur"
   - Montrer question -> embedding -> recherche similarité -> top-k.
   - Inclure le fait que le même modèle d'embedding doit être utilisé.
3. "Top-k : liste de suspects, pas verdict"
   - Métaphore enquête.
   - Expliquer top-1 trop fragile, top-50 trop bruyant, top-5 compromis pédagogique.
   - Insister : hors-corpus renvoie quand même quelque chose sans seuil.
4. "Étape 4 — Débrief : que valent les scores ?"
   - Question principale : "Que signifie un top-5 sur une question hors corpus ?"
   - Relances : score, bruit, seuil absent, inspection du chunk.

Contraintes :
- Inclure un mini-exemple non technique de question hors-corpus.
- Notes facilitateur : faire dire explicitement "score ≠ vérité".
- Ne pas proposer reranking ou seuils comme correction immédiate ; parking lot Module 4.
```

### 7.8 Prompt détaillé — Étape 5 Génération + citations

```text
Génère les slides 27 à 31 du deck Module 3 RAG, en français, pour Étape 5 Génération + citations.

Contexte Étape 5 : les participants branchent retrieval et génération pour produire une réponse en français, ancrée dans les chunks, avec citations au format `[source: filename, pN]`.

Slides attendues :
1. "Étape 5 — Mission : répondre avec preuves"
   - Artefact : point d'entrée RAG exécutable.
   - Message clé : utile = ancré + traçable, pas seulement fluide.
2. "retrieve -> generate"
   - Montrer la chaîne : question -> top-5 chunks -> prompt -> réponse.
   - Visual : pipeline courte avec contexte injecté.
3. "Le contrat de réponse"
   - Règles : répondre uniquement avec les passages fournis ; citer chaque affirmation importante ; dire quand le contexte manque.
   - Message clé : le prompt impose un comportement vérifiable.
4. "Citation probante vs citation décorative"
   - Exemple contrastif : citation qui soutient l'affirmation vs citation juste présente.
   - Visual : deux cartes comparées.
5. "Étape 5 — Débrief : fluide ou fidèle ?"
   - Question principale : "Avez-vous obtenu une belle réponse impossible à vérifier ?"
   - Relances : hors-corpus mots de passe, citations instables, hallucination de bonnes pratiques.

Contraintes :
- Inclure notes facilitateur de 100-130 mots par slide.
- Faire le lien explicite avec la grille Étape 6.
- Ne pas afficher de longues réponses générées ; utiliser des extraits courts.
```

### 7.9 Prompt détaillé — Étape 6 Évaluation + pont Module 4

```text
Génère les slides 32 à 39 du deck Module 3 RAG, en français, pour Étape 6 Évaluation et clôture.

Contexte Étape 6 : les participants exécutent 5 questions d'évaluation, écrivent `data/eval-results.json`, puis rédigent `eval-findings.md` avec au moins 3 failles nommées, chacune appuyée par un exemple et une hypothèse de cause.

Slides attendues :
1. "Étape 6 — Mission : stresser la pipeline"
   - Artefacts : `eval-results.json`, `eval-findings.md`.
   - Message clé : 5 questions, 5 profils, 3 failles.
2. "On n'optimise pas : on observe"
   - Règle : pas de correction pendant Étape 6.
   - Message clé : une preuve avant une solution.
3. "La grille : fidélité / complétude / traçabilité"
   - Définir chaque critère en une phrase.
   - Visual : matrice simple.
4. "Nommer une faille correctement"
   - Template : Type, exemple concret, hypothèse de cause.
   - Montrer un exemple générique.
5. "Étape 6 — Débrief : quelles failles reviennent ?"
   - Activité : récolter 3 failles au tableau.
   - Relances : hallucination, citation fausse, retrieval hors sujet, chunking bruité.
6. "Pont Module 4 : des failles aux améliorations mesurables"
   - Transformer faille -> hypothèse -> technique candidate -> métrique.
7. "Ce qu'il faut conserver"
   - `chunks.json`, `index.db`, `eval-results.json`, `eval-findings.md`, observations personnelles.
8. "Clôture : construire -> observer -> améliorer"
   - Récapitulatif de la boucle d'apprentissage.
   - Remercier, annoncer la suite.

Contraintes :
- Ton énergique mais sobre.
- Notes facilitateur avec timing strict : Étape 6 doit rester court.
- Inclure une phrase prête à dire pour recadrer : "C'est une très bonne amélioration — note-la pour Module 4, mais maintenant on documente la faille."
```

### 7.10 Prompt maître — guide facilitateur enrichi

```text
À partir du design Module 3 RAG et du deck 39 slides, rédige un guide facilitateur enrichi pour Luis et Noellie.

Objectif : aider à piloter la salle, pas à expliquer le code ligne par ligne.

Inclure :
- timeline minute par minute ;
- signal de passage par étape ;
- questions de débrief principales et relances ;
- phrases prêtes à dire ;
- interventions si blocage systémique ;
- gestion participants en avance ;
- erreurs pédagogiques à éviter ;
- parking lot Module 4 ;
- moments où il faut couper une discussion.

Format attendu : markdown structuré, sections courtes, checklists utilisables en salle.
Ton : concret, opérationnel, en français.
```

### 7.11 Prompt maître — packet participant

```text
Crée un packet participant en français pour Module 3 RAG.

Objectif : donner aux participants un support autonome léger, sans remplacer le guidage par l'agent.

Sections attendues :
1. Avant l'atelier — ce que vous allez construire et pourquoi le RAG est volontairement naïf.
2. Carte des étapes — CP, artefact, exit criterion, piège à observer.
3. Glossaire minimal — chunk, embedding, index, retrieval, top-k, citation, fidélité.
4. Grille d'évaluation — fidélité, complétude, traçabilité.
5. Template `eval-findings.md`.
6. Après l'atelier — transformer 3 failles en hypothèses Module 4.

Contraintes :
- 4 à 6 pages maximum si export PDF.
- Pas de code complet.
- Questions de rappel à la fin de chaque section.
- Ton pratique et rassurant.
```

### 7.12 Prompt de contrôle qualité du deck

```text
Tu es reviewer pédagogique d'un deck technique.
Évalue le deck Module 3 "Construis ton RAG" selon cette grille :

1. Alignement : chaque slide soutient-elle un objectif d'apprentissage ou une transition utile ?
2. Charge cognitive : y a-t-il trop de texte ou trop de concepts simultanés ?
3. Action : le participant sait-il quoi faire ou quoi observer après chaque slide ?
4. Facilitation : les notes indiquent-elles quoi dire, quelle question poser et quand couper ?
5. Cohérence Module 4 : les failles observées mènent-elles clairement aux améliorations futures ?
6. Outil : le deck est-il mieux adapté à Slidev, Canva, ou nécessite-t-il des visuels générés ?

Retour attendu :
- 10 problèmes prioritaires maximum ;
- pour chaque problème : slide concernée, risque pédagogique, correction proposée ;
- une recommandation globale : prêt / à alléger / à enrichir / à restructurer.
```

## 8. Plan d'itération proposé

### Itération 1 — Valider l'architecture pédagogique

Livrable : ce document.

Décisions à valider :

- granularité du deck nominal (39 slides) et choix des 5 slides optionnelles ;
- place du contenu participant avant / pendant / après ;
- vocabulaire des critères d'évaluation ;
- niveau d'explication conceptuelle acceptable dans les slides ;
- choix de flux de production : Slidev source de vérité, puis Canva pour finition visuelle.

### Itération 2 — Produire les supports markdown

Livrables :

- `slides/module-3-facilitator.md` en Slidev, basé sur l'outline 39 slides ;
- prompts Canva / Gemini prêts pour finition visuelle et illustrations ;
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
3. Les critères Étape 6 doivent-ils être validés en version SOTA courte : `contexte`, `fidélité`, `complétude`, `citation` ?
4. Souhaitez-vous intégrer un mini “quiz de rappel” entre Étape 3 et Étape 4, ou préserver tout le temps pour la pratique ?
5. Le pont Module 4 doit-il mentionner explicitement les techniques futures (reranking, seuils, chunking sémantique, faithfulness eval), ou seulement les catégories de failles ?

---

## 10. Sources et justifications rapides

La synthèse SOTA complète est dans `design/module-3-sota-research-synthesis.md`. Les sources ci-dessous restent les justifications pédagogiques initiales ; la nouvelle synthèse ajoute les références agent-assisted coding education, RAGAS/RAGChecker/ALCE et taxonomies de pannes RAG.

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
