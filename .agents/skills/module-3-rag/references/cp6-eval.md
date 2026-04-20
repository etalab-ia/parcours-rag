# CP6 — Éval + analyse de failles

## Objectif

Exécuter 5 questions d'évaluation sur le RAG construit, observer les réponses, et **nommer au moins 3 types de failles** dans un fichier `eval-findings.md` — qui devient le pont vers le Module 4.

## Learning Objective

**LO4 — Analyser** : identifier les failles d'une pipeline RAG. **LO5 — Évaluer** : juger la qualité d'une réponse selon des critères explicites.

## Durée cible

20 min (pilote agent) + discussion plénière finale enchaînée.

## Brief participant

« Tu as construit la pipeline. Maintenant on la stresse. 5 questions, 5 profils différents : une facile, une qui exige de combiner 2 chunks, un piège hors corpus, une ambiguë, une multi-documents. Ton job : lancer, observer, écrire. Pas corriger. »

## Procédure

> ⚠️ Squelette — procédure détaillée à rédiger dans la PR « CP3→CP6 détail ».
>
> ⚠️ Les 5 questions d'éval (texte + réponses de référence) sont définies dans la PR « reference-index + 5 eval questions ». Cette PR ici fournit seulement l'orchestration.

Grandes lignes :
1. Charger les 5 questions d'éval depuis `data/eval-questions.json`.
2. Pour chaque question : invoquer l'agent RAG, capturer (question, réponse, chunks récupérés, citations).
3. Construire un tableau de comparaison réponse vs réponse de référence.
4. Demander au participant de nommer ≥ 3 types de failles avec exemples concrets, rédiger `eval-findings.md`.

## Critères de jugement (à imposer au participant)

Pour chaque question, noter au minimum :

- **Fidélité** : la réponse s'appuie-t-elle uniquement sur les chunks ? (halluciné / ancré / partiellement ancré)
- **Complétude** : la réponse couvre-t-elle tout ce qui était dans le corpus ? (oui / partielle / non)
- **Traçabilité** : les citations pointent-elles bien la bonne source et la bonne page ? (exacte / approximative / fausse)

## Exit criteria

- [ ] Fichier `eval-findings.md` existe à la racine du projet.
- [ ] Il contient la sortie des 5 questions d'éval (question / réponse / citations / référence).
- [ ] Il liste au moins 3 failles nommées, avec pour chacune :
  - un type (ex: « chunking qui coupe un tableau »),
  - un exemple concret tiré de l'une des 5 questions,
  - une hypothèse de cause.

## Vérification

> ⚠️ Séquence exacte à rédiger dans la PR « CP3→CP6 détail ».

## Hint ladder

> ⚠️ À rédiger dans la PR « hint ladder complet ».

## Pièges pédagogiques (ici : c'est *tout* le CP)

Les 5 questions sont conçues pour faire sortir des failles typiques. Selon le corpus et la pipeline naïve, on s'attend à voir apparaître :
- Coupures de chunks qui perdent le sujet grammatical d'une phrase.
- Retrieval qui ramène le bon guide mais la mauvaise section.
- Citation du bon document mais de la mauvaise page (décalage d'1-2 pages).
- Hallucination « entre deux chunks » (le LLM comble un trou).
- Refus de répondre sur une question pourtant couverte (top-k trop petit).

Tu **ne corriges rien**. Tu fais **observer** et **nommer**.

## Transition

« `eval-findings.md` en main, c'est fini pour le Module 3. Le Module 4 part exactement de cette liste — chaque faille que tu as notée devient un outil à ajouter : meilleur chunking, reranking, seuils de confiance, prompt plus strict. On se revoit là-bas. »
