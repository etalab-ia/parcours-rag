# CP6 — Éval + analyse de failles

## Objectif

Exécuter 5 questions d'évaluation sur le RAG construit, observer les réponses, et **nommer au moins 3 types de failles** dans un fichier `eval-findings.md` — qui devient le pont vers le Module 4.

## Learning Objective

**LO4 — Analyser** : identifier les failles d'une pipeline RAG. **LO5 — Évaluer** : juger la qualité d'une réponse selon des critères explicites.

## Durée cible

20 min (pilote agent) + discussion plénière finale enchaînée.

## Brief participant

« Tu as construit la pipeline. Maintenant on la stresse. 5 questions, 5 profils différents. Ton job : lancer, observer, écrire. Pas corriger. »

## Procédure

1. **Vérifier les entrées d'éval** :

   - `data/eval-questions.json` existe (5 questions),
   - pipeline CP4/CP5 exécutable (`retrieve` + `answer`).

2. **Créer un runner d'évaluation**, par exemple `src/mastra/rag/run-eval.ts`, qui pour chaque question :

   - récupère les chunks (`retrieve`),
   - génère la réponse (`answer`/`generate`),
   - sérialise : question, réponses, top chunks, citations, scores.

3. **Exécuter l'évaluation complète** et écrire :

   - `data/eval-results.json`

4. **Rédiger `eval-findings.md`** avec 2 sections minimales :

   - `## Résultats par question` (5 entrées)
   - `## Failles observées` (au moins 3 failles nommées)

5. **Pour chaque question**, noter explicitement :

   - fidélité,
   - complétude,
   - traçabilité.

6. **Pour chaque faille identifiée**, documenter :

   - type,
   - exemple concret (question + extrait),
   - hypothèse de cause.

⚠️ Règle CP6 : **on n'améliore pas la pipeline**. On observe et on nomme.

## Critères de jugement (à imposer au participant)

Pour chaque question, noter au minimum :

- **Fidélité** : la réponse s'appuie-t-elle uniquement sur les chunks ? (halluciné / ancré / partiellement ancré)
- **Complétude** : la réponse couvre-t-elle tout ce qui était dans le corpus ? (oui / partielle / non)
- **Traçabilité** : les citations pointent-elles bien la bonne source et la bonne page ? (exacte / approximative / fausse)

## Exit criteria

- [ ] Fichier `eval-findings.md` existe à la racine du projet.
- [ ] `data/eval-results.json` existe et contient les 5 questions exécutées.
- [ ] `eval-findings.md` contient les 5 résultats (question / réponse / citations / référence).
- [ ] `eval-findings.md` liste au moins 3 failles nommées, avec pour chacune :
  - un type,
  - un exemple concret,
  - une hypothèse de cause.

## Vérification

Exécuter les checks suivants :

1. **Fichiers attendus présents** :

   ```bash
   test -f data/eval-results.json
   test -f eval-findings.md
   ```

2. **5 résultats bien exécutés** :

   ```bash
   node -e 'const fs=require("node:fs"); const r=JSON.parse(fs.readFileSync("data/eval-results.json","utf8")); if(!Array.isArray(r.results)||r.results.length!==5){console.error(r.results?.length); process.exit(1)}; console.log("eval-results=ok");'
   ```

3. **Structure minimale de `eval-findings.md`** :

   ```bash
   grep -q '^## Résultats par question' eval-findings.md
   grep -q '^## Failles observées' eval-findings.md
   test "$(grep -c '^### Q' eval-findings.md)" -ge 5
   test "$(grep -c '^- \*\*Type' eval-findings.md)" -ge 3
   ```

4. **Contrôle qualitatif manuel** :

   - vérifier qu'au moins une faille décrit un cas d'hallucination ou de citation non fidèle,
   - vérifier qu'au moins une faille est reliée à un symptôme retrieval/chunking.

## Hint ladder

1. **Hint socratique**

   « Si tu devais convaincre quelqu'un en 2 minutes que ton RAG est imparfait, quels 3 exemples concrets garderais-tu ? »

2. **Solution complète**

   « Structure `eval-findings.md` en 2 blocs :
   1) `Résultats par question` (Q1→Q5 avec fidélité/complétude/traçabilité),
   2) `Failles observées` (au moins 3, chacune avec type + exemple + cause).
   Utilise `data/eval-results.json` comme source factuelle, pas ton intuition. »

## Pièges pédagogiques (ici : c'est *tout* le CP)

- Corriger le code trop tôt au lieu d'observer.
- Écrire des conclusions vagues (« ça marche moyen ») sans exemple vérifiable.
- Confondre "réponse plausible" et "réponse fidèle aux sources".
- Surévaluer un score de similarité sans inspection des chunks.

## Side quest

Pour les participants en avance :

- classer les failles par priorité de correction (impact × fréquence),
- proposer pour chaque faille **une** piste Module 4 (sans l'implémenter).

## Transition

« `eval-findings.md` en main, Module 3 est terminé. Le Module 4 part exactement de cette liste : chaque faille devient un outil d'amélioration mesurable. »
