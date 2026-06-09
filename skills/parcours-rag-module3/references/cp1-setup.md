# Étape 1 — Setup projet + chat baseline

## Objectif

Faire tourner l'environnement Mastra + Albert API de bout en bout sur le poste du participant, avec un agent de chat minimal qui répond en français.

## Learning Objective

**LO1 — Appliquer** : prendre en main la chaîne Mastra locale.

## Durée cible

20 min (pilote agent) + 5 min de debrief plénier.

## Brief participant

« Avant d'ajouter le RAG, on valide que la fondation marche. À la fin de cette étape tu auras un agent qui parle français via l'API Albert, hébergé en local, prêt à être augmenté. »

## Conduite guidée (obligatoire)

Piloter cette étape en micro-étapes :

- proposer **une seule action** à la fois,
- expliquer chaque commande avant exécution (objectif + résultat attendu),
- valider le résultat avant de passer à l'action suivante,
- ne donner le plan complet que si l'utilisateur le demande explicitement.

Au début de l'étape, demander la préférence de rythme :

- **mode guidé** (par défaut, pédagogique),
- **mode rapide** (moins de détails, mais toujours une explication courte avant commande).

Rappel outil : pour cet atelier standalone, exécuter les commandes avec **npm/npx uniquement** (pas de `pnpm`).

## Procédure

1. **Micro-étape 1.1 — Si le projet n'existe pas, lancer le bootstrap workspace** :

   Si `src/mastra/index.ts` est absent, charger et exécuter d'abord :
   - `references/bootstrap-workspace.md`

   Validation locale :
   - `src/mastra/index.ts` présent,
   - `corpus/anssi-essentiels/manifest.json` présent,
   - au moins 17 PDFs dans `corpus/anssi-essentiels/`.

2. **Micro-étape 1.2 — Vérifier les prérequis locaux** :

   ```bash
   node -v
   npm -v
   ```

   Attendu : Node 20+ et `npm` disponible.

   Validation locale : versions affichées sans erreur.

3. **Micro-étape 1.3 — Installer les dépendances** :

   ```bash
   npm install
   ```

   Validation locale : dossier `node_modules/` créé.

4. **Micro-étape 1.4 — Créer le fichier d'environnement** :

   ```bash
   cp .env.example .env
   ```

   Puis ouvrir `.env` et renseigner `ALBERT_API_KEY` (valeur non vide).

   Validation locale : `.env` présent, clé renseignée (non vide).

5. **Micro-étape 1.5 — Lancer Mastra en local** :

   ```bash
   npm run dev
   ```

   Garder ce terminal ouvert.

   Validation locale : endpoint des agents répond.

6. **Micro-étape 1.6 — Valider l'agent baseline** dans Mastra Studio (`http://localhost:4111`) :
   - sélectionner l'agent `chat-agent` (nom technique) ; dans l'UI, le label peut être `Agent de chat (baseline)`,
   - poser une question de test en français, par exemple :

     > « Présente-toi en 2 phrases et précise pourquoi tu n'as pas encore accès aux guides ANSSI. »

   - vérifier que la réponse est en français et mentionne explicitement l'absence de contexte ANSSI à ce stade.

   Validation locale : réponse en français + pas d'accès au corpus ANSSI.

## Exit criteria

- [ ] `node_modules/` présent (`npm install` réussi).
- [ ] `.env` existe et contient `ALBERT_API_KEY=...` (valeur non vide, pas la chaîne littérale d'exemple).
- [ ] `npm run dev` démarre sans erreur et expose `http://localhost:4111`.
- [ ] L'agent `chat-agent` répond à une question de test en français.

## Vérification

Exécuter ces checks dans l'ordre.

1. **Dépendances installées** :

   ```bash
   test -d node_modules
   ```

2. **`.env` présent + clé non vide** (sans afficher la clé) :

   ```bash
   test -f .env
   awk -F= '/^ALBERT_API_KEY=/{if(length($2)>10) ok=1} END{exit ok?0:1}' .env
   ```

3. **Mastra up** (`npm run dev` déjà lancé dans un autre terminal) :

   ```bash
   curl -sf http://localhost:4111/api/agents | grep -q 'chat-agent'
   ```

4. **Réponse fonctionnelle du chat-agent** :
   - dans Studio, envoyer le prompt de test,
   - vérifier manuellement :
     - réponse en français,
    - mention explicite qu'il n'a pas encore accès au corpus ANSSI (la formulation exacte peut varier).

## Hint ladder

1. **Hint socratique**

   « Le premier critère de sortie qui échoue chez toi, c'est lequel exactement : dépendances, `.env`, service `:4111`, ou réponse de l'agent ? »

2. **Solution complète**

   « Repars dans cet ordre, sans sauter d'étape :
   1) `npm install`
   2) `cp .env.example .env` puis renseigne `ALBERT_API_KEY` (non vide)
   3) `npm run dev`
   4) `curl -sf http://localhost:4111/api/agents | grep -q 'chat-agent'`
   5) dans Studio, envoie le prompt de test et vérifie une réponse en français mentionnant l'absence de contexte ANSSI.

   Si une étape échoue, corrige-la avant de passer à la suivante. »

## Pièges pédagogiques

- **`.env` existe mais clé vide** (`ALBERT_API_KEY=`) : le participant pense avoir "fait le setup" alors que l'auth échouera.
- **Mauvais dossier courant** : `npm run dev` lancé hors du projet atelier, ce qui masque les vraies erreurs.
- **Port 4111 déjà pris** : Mastra ne démarre pas proprement ou démarre sur un autre port sans que le participant le voie.
- **Contrainte réseau/proxy** : poste d'entreprise bloquant l'accès à `albert.api.etalab.gouv.fr`.
- **Version Node trop ancienne** : erreurs d'exécution floues avant même d'atteindre l'API.

## Side quest

Pour les participants en avance :

- modifier `src/mastra/agents/chat-agent.ts` pour changer légèrement le style (ex: finir chaque réponse par `✅ Baseline Étape 1`),
- relancer `npm run dev`,
- vérifier dans Studio que le changement d'instructions est bien pris en compte.

But : montrer qu'ils contrôlent le comportement de base avant d'ajouter le RAG.

## Transition

« Ton agent parle, mais il ne sait rien du corpus ANSSI. C'est le moment du débrief plénier — on se retrouve dans 5 minutes pour attaquer l'Étape 2 (ingestion). »
