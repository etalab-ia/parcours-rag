# CP5 — Génération avec contexte + citations

## Objectif

Faire parler un agent Mastra qui répond à une question utilisateur en s'appuyant sur les chunks récupérés, et qui **cite** ses sources (guide + page).

## Learning Objective

**LO3 — Appliquer** : orchestrer récupération + génération pour produire des réponses contextualisées traçables.

## Durée cible

30 min (pilote agent) + 10 min de debrief plénier.

## Brief participant

« On branche `retrieve()` en amont du LLM. Le prompt impose deux contraintes : répondre uniquement à partir des passages fournis, et citer la source (nom du guide + page) pour chaque affirmation. Tu vas voir : c'est là que les failles du chunking remontent à la surface. »

## Procédure

> ⚠️ Squelette — procédure détaillée à rédiger dans la PR « CP3→CP6 détail ».

Grandes lignes :
1. Transformer `chat-agent` (ou créer `rag-agent`) avec un tool `retrieve` ou un middleware de contexte.
2. Écrire le system prompt : ton de réponse, obligation de citation, comportement si contexte vide/hors sujet.
3. Format de citation à normaliser (ex: `[Guide Zero Trust — p. 4]`).
4. Tester sur une question témoin fournie.

## Exit criteria

- [ ] Agent `rag-agent` (ou équivalent) accessible via `pnpm dev`.
- [ ] Sur la question témoin « Quelles sont les règles d'hygiène des mots de passe selon l'ANSSI ? », la réponse :
  - est en français,
  - cite au moins 2 sources au format convenu,
  - chaque citation pointe un `source` et une `page` cohérents avec les chunks retournés par `retrieve`.
- [ ] Si le contexte est vide (ex: question hors corpus), l'agent répond qu'il ne sait pas, **sans inventer**.

## Vérification

> ⚠️ Séquence exacte à rédiger dans la PR « CP3→CP6 détail ».

## Hint ladder

> ⚠️ À rédiger dans la PR « hint ladder complet ».

## Pièges pédagogiques

C'est le CP où l'hallucination apparaît si on ne cadre pas le prompt. À illustrer dans le debrief :
- Citation correcte mais contenu inventé (le modèle extrapole entre deux chunks).
- Absence de citation sur un paragraphe « de synthèse » du modèle.
- Contexte vide → réponse qui tente de sauver la face.

## Side quest

> ⚠️ À rédiger dans la PR « CP3→CP6 détail ». Candidat : streamer les tokens et afficher les citations en temps réel.

## Transition

« Ton RAG répond et cite. Au debrief on regarde collectivement un cas où ça marche et un cas où ça triche. Dernier CP : on le pousse sur 5 questions d'éval pour voir vraiment où il casse. »
