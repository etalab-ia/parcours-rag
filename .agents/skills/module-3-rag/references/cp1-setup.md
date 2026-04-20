# CP1 — Setup projet + chat baseline

## Objectif

Faire tourner l'environnement Mastra + Albert API de bout en bout sur le poste du participant, avec un agent de chat minimal qui répond en français.

## Learning Objective

**LO1 — Appliquer** : prendre en main la chaîne Mastra locale.

## Durée cible

20 min (pilote agent) + 5 min de debrief plénier.

## Brief participant

« Avant d'ajouter le RAG, on valide que la fondation marche. À la fin de ce CP tu auras un agent qui parle français via l'API Albert, hébergé en local, prêt à être augmenté. »

## Procédure

> ⚠️ Squelette — procédure détaillée à rédiger dans la PR « CP1+CP2 détail ».

Grandes lignes :
1. Installer les dépendances (`pnpm install`).
2. Dupliquer `.env.example` en `.env` et renseigner `ALBERT_API_KEY`.
3. Lancer `pnpm dev` et ouvrir Mastra Studio.
4. Valider la réponse du `chat-agent` à une question simple en français.

## Exit criteria

- [ ] `node_modules/` présent (pnpm install réussi).
- [ ] `.env` existe et contient `ALBERT_API_KEY=...` (valeur non vide, pas la chaîne littérale d'exemple).
- [ ] `pnpm dev` démarre sans erreur et expose `http://localhost:4111`.
- [ ] L'agent `chat-agent` répond à une question de test en français.

## Vérification

> ⚠️ Séquence exacte à rédiger dans la PR « CP1+CP2 détail ».

Idée : lire `.env`, hit `GET /api/agents`, poster un message de test via l'API, vérifier la réponse.

## Hint ladder

> ⚠️ À rédiger dans la PR « hint ladder complet ».

1. *Hint socratique* : TODO
2. *Solution complète* : TODO

## Pièges pédagogiques

> ⚠️ À rédiger dans la PR « CP1+CP2 détail ».

Candidats : mauvaise version de Node, `.env` oublié, proxy d'entreprise bloquant `albert.api.etalab.gouv.fr`.

## Side quest

> ⚠️ À rédiger dans la PR « CP1+CP2 détail ». Candidat : faire parler l'agent en changeant son `instructions`.

## Transition

« Ton agent parle, mais il ne sait rien du corpus ANSSI. C'est le moment du debrief plénier — on se retrouve dans 5 minutes pour attaquer l'ingestion. »
