# Étape 5 (CP5) — Génération avec contexte + citations

## Objectif

Produire une réponse RAG en français à partir des chunks récupérés, avec citations traçables (`source` + `page`) pour chaque affirmation importante.

## Learning Objective

**LO3 — Appliquer** : orchestrer récupération + génération pour produire des réponses contextualisées traçables.

## Durée cible

30 min (pilote agent) + 10 min de débrief plénier.

## Brief participant

« On branche `retrieve()` en amont du LLM. Le prompt impose deux contraintes : répondre uniquement à partir des passages fournis, et citer la source (guide + page) pour chaque affirmation. »

## Conduite guidée (obligatoire)

Piloter cette étape en séquence courte :

- un bloc de code,
- un test ciblé,
- un constat,
- puis la suite.

Éviter les réponses "plan complet" sauf demande explicite de l'utilisateur.

⚠️ Utilise le gabarit de restitution uniquement comme format de sortie ; adapte toujours le code au contexte courant (ce n'est pas une réponse modèle).

## Restitution de code (obligatoire)

- Fournir du code en markdown copiable (fichier complet ou extrait ciblé selon la taille).
- Préserver les métadonnées de contexte (`chunk_index`, `source`, `page`, `guide_id`) pour garantir des citations traçables.
- Si un typage embedding est nécessaire, privilégier les types publics (ex: `EmbeddingModelV3` importé depuis `@ai-sdk/provider`) plutôt que des types internes (ex: `GatewayEmbeddingModel`).

## Procédure

1. **Micro-étape 5.1 — Créer un module de génération**, par exemple `src/mastra/rag/generate.ts`, qui :

   - reçoit `question` + `contextChunks`,
   - appelle Albert `/chat/completions` (`openweight-large`),
   - applique un prompt système avec format de citation obligatoire.

   Validation locale : module `generate` exécutable avec un contexte minimal.

2. **Micro-étape 5.2 — Normaliser un format de citation unique**, par exemple :

   - `[source: <filename>, p<page>]`

3. **Micro-étape 5.3 — Créer une orchestration RAG**, par exemple `src/mastra/rag/answer.ts`, qui enchaîne :

   - `retrieve(question, 5)` (CP4),
   - `generate(question, retrievedChunks)`.

   Validation locale : `answer.ts` retourne une réponse sur une question simple.

4. **Micro-étape 5.4 — Ajouter un mode CLI** :

   ```bash
   pnpm tsx src/mastra/rag/answer.ts "<question>"
   ```

5. **Micro-étape 5.5 — Tester sur deux questions** :

   - **in-corpus (happy path)** :
     - « Quels sont les objectifs principaux du modèle Zero Trust selon l'ANSSI ? »
   - **hors-corpus (piège)** :
     - « Quelles sont les règles d'hygiène des mots de passe selon l'ANSSI ? »

6. **Micro-étape 5.6 — Documenter le comportement observé** (2-3 lignes) :

   - la question in-corpus doit être bien citée,
   - la question hors-corpus doit expliciter l'insuffisance du contexte (et éviter l'invention).

## Exit criteria

- [ ] Point d'entrée RAG exécutable (`answer.ts` CLI ou équivalent agent) présent.
- [ ] Sur la question Zero Trust, la réponse :
  - est en français,
  - contient au moins 2 citations au format convenu,
  - cite des `source/page` cohérents avec les chunks retournés par `retrieve`.
- [ ] Sur la question hors-corpus mots de passe, la réponse signale explicitement les limites du contexte et n'invente pas de règles absentes du corpus.

## Vérification

Exécuter les checks suivants :

1. **Run in-corpus** :

   ```bash
   pnpm tsx src/mastra/rag/answer.ts "Quels sont les objectifs principaux du modèle Zero Trust selon l'ANSSI ?" > data/cp5-zero-trust.txt
   ```

2. **Run hors-corpus** :

   ```bash
   pnpm tsx src/mastra/rag/answer.ts "Quelles sont les règles d'hygiène des mots de passe selon l'ANSSI ?" > data/cp5-mots-de-passe.txt
   ```

3. **Au moins 2 citations dans la réponse in-corpus** :

   ```bash
   test "$(grep -Eo '\[source: [^]]+, p[0-9]+\]' data/cp5-zero-trust.txt | wc -l | tr -d ' ')" -ge 2
   ```

4. **Contrôle qualitatif manuel (obligatoire)** :

   - comparer les citations de `cp5-zero-trust.txt` avec un run `retrieve()` de la même question,
   - lire `cp5-mots-de-passe.txt` et vérifier qu'il n'y a pas de liste inventée présentée comme certaine.

## Hint ladder

1. **Hint socratique**

   « Si la réponse est fluide mais sans citations vérifiables, as-tu imposé un format de citation obligatoire dans le prompt système ? »

2. **Solution complète**

   « Remets une chaîne stricte `retrieve -> generate` :
   1) `retrieve(question, 5)`
   2) injecter les 5 chunks dans le prompt
   3) imposer le format `[source: <filename>, p<page>]` pour chaque affirmation
   4) ajouter la règle : “Si le contexte est insuffisant, dis-le et n'invente pas.”

   Valide ensuite avec les 2 runs demandés :
   - Zero Trust : au moins 2 citations cohérentes
   - mots de passe : reconnaissance explicite des limites du corpus. »

## Pièges pédagogiques

- **Réponse fluide mais non traçable** : texte convaincant sans citations.
- **Citations décoratives** : source citée qui ne soutient pas vraiment l'affirmation.
- **Hallucination sur hors-corpus** : le modèle complète les trous avec des "bonnes pratiques" génériques.
- **Format de citation instable** : impossible à vérifier automatiquement en CP6.

## Side quest

Pour les participants en avance :

- ajouter une section `Contexte utilisé` en fin de réponse (liste des 5 chunks avec score),
- comparer une exécution avec `k=3` puis `k=5`,
- noter l'impact sur la qualité des citations.

## Transition

« Ton RAG répond et cite. Au débrief on compare un cas où il est fidèle et un cas où il dérive. Dernière étape : Étape 6 (évaluation structurée sur 5 questions). »
