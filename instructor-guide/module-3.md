# Guide facilitateur — Module 3 « Construis ton RAG »

> Public : formateurs (Noellie + Luis).
> 
> Ce document est le playbook d'animation en présentiel (3h, 20 participants techniques).
> Le détail technique de chaque checkpoint est dans `.agents/skills/module-3-rag/references/cp*.md`.

---

## 1) Objectif de ce guide

Ce guide sert à piloter **la salle** (rythme, débriefs, blocages, homogénéité du groupe), pas à détailler le code ligne par ligne.

À la fin du module, chaque participant doit avoir :

- un pipeline RAG local complet (CP1→CP5),
- un `eval-findings.md` avec au moins 3 failles observées (CP6),
- une compréhension claire de pourquoi ces failles deviennent l'agenda du Module 4.

---

## 2) Rôle du facilitateur vs rôle de l'agent participant

### Facilitateur (vous)

- Cadencer la progression collective.
- Couper les débats à temps.
- Débloquer les cas systémiques (problème commun à la salle).
- Animer les débriefs entre checkpoints.
- Garantir que l'on reste sur les objectifs pédagogiques (pas d'optimisation prématurée).

### Agent participant

- Guider pas-à-pas sur le poste individuel.
- Vérifier les exit criteria observables de chaque CP.
- Donner un hint socratique puis une solution complète si besoin.

**Règle pratique** :
- blocage individuel → agent
- blocage massif / incompréhension conceptuelle → facilitateur en plénière courte

---

## 3) Timeline minute par minute (180 min)

## 0. Accueil + cadrage (00:00–00:10)

**But** : poser le contrat pédagogique.

Script conseillé (2 min) :

- « Aujourd'hui on construit un RAG volontairement naïf. Le but n'est pas la perf maximale, c'est d'observer où ça casse. »
- « Votre agent vous guide individuellement, moi je cadence les transitions et les débriefs. »

Checklist :

- Wi-Fi OK
- accès repo OK
- clé Albert disponible
- chacun sait lancer son agent de codage

---

## 1. CP1 Setup (00:10–00:30)

- 00:10–00:25 : travail individuel
- 00:25–00:30 : débrief plénier CP1

**Signal de passage** : >80% de la salle a `pnpm dev` + `chat-agent` fonctionnel.

### Débrief CP1 (5 min) — questions

1. « Qu'est-ce qui vous a bloqués en premier : dépendances, `.env`, port, réseau ? »
2. « Quelle vérification vous a permis d'isoler le problème le plus vite ? »

### Signaux d'alerte CP1

- Beaucoup de 401/403 → vérifier clé Albert en plénière.
- Plusieurs ports 4111 occupés → rappeler comment identifier/changer proprement.
- Postes entreprise bloqués réseau → traiter en priorité (sinon effet domino).

---

## 2. CP2 Ingestion & chunking (00:30–01:00)

- 00:30–00:50 : travail individuel
- 00:50–01:00 : débrief plénier CP2

**Signal de passage** : majorité avec `data/chunks.json` valide (>=40 chunks, couverture 17 PDFs).

### Débrief CP2 (10 min) — questions

1. « Qu'est-ce que le comptage global cache, que la vérification par manifest révèle ? »
2. « Quels artefacts du chunking naïf avez-vous observés (bruit, coupures, répétitions) ? »
3. « Pourquoi on accepte ce chunking imparfait à ce stade ? »

### Signaux d'alerte CP2

- Participants qui "optimisent" déjà (semantic chunking, nettoyage agressif) → recadrer : "note-le pour Module 4".
- Couverture incomplète du manifest (souvent oubli d'un PDF) → rappeler vérif systématique.

---

## 3. CP3 Embeddings & index (01:00–01:25)

- 01:00–01:20 : travail individuel
- 01:20–01:25 : débrief plénier CP3

**Signal de passage** : index créé, `count == chunks.length`, dimension 1024.

### Débrief CP3 (5 min) — questions

1. « Quel batch size a été le plus stable chez vous ? »
2. « Qui a rencontré des collisions d'IDs ou des counts incohérents ? »

### Signaux d'alerte CP3

- `count < chunks.length` récurrent → rappeler la cause fréquente : IDs non uniques.
- erreurs API massives → réduire batch size recommandé en plénière (ex: 32 → 16).

---

## 4. Pause (01:25–01:35)

Couper franchement. Afficher heure de reprise explicite.

---

## 5. CP4 Retrieval (01:35–02:00)

- 01:35–01:55 : travail individuel
- 01:55–02:00 : débrief plénier CP4

**Signal de passage** : `retrieve(query,k=5)` stable avec scores décroissants + hit Zero Trust.

### Débrief CP4 (5 min) — questions

1. « Qu'est-ce que top-5 apporte par rapport à top-1 ? »
2. « Qu'avez-vous observé sur une requête hors domaine ? »

### Signaux d'alerte CP4

- résultats hors sujet partout → mismatch modèle embedding ou indexName.
- confusion score = vérité → recadrer : score est un signal, pas une preuve.

---

## 6. CP5 Génération + citations (02:00–02:30)

- 02:00–02:20 : travail individuel
- 02:20–02:30 : débrief plénier CP5

**Signal de passage** : réponse Zero Trust bien citée + comportement maîtrisé sur question hors corpus.

### Débrief CP5 (10 min) — questions

1. « Avez-vous obtenu une réponse fluide mais mal traçable ? »
2. « Sur la question hors corpus, qu'a fait le modèle ? »
3. « Quelles formulations de prompt ont réduit l'hallucination ? »

### Signaux d'alerte CP5

- citations décoratives (format ok, fond faux) → insister sur vérification manuelle citation↔chunk.
- participants qui ne testent qu'un cas in-corpus → imposer le test hors-corpus aussi.

---

## 7. CP6 Éval + analyse de failles (02:30–02:50)

- 02:30–02:45 : travail individuel
- 02:45–02:50 : mini debrief salle + préparation clôture

**Signal de passage** : `eval-findings.md` existe, 5 questions traitées, 3 failles nommées avec causes.

### Débrief CP6 (5 min) — questions

1. « Quelle faille vous paraît la plus critique en production ? »
2. « Quelle faille est la plus facile à corriger au Module 4 ? »
3. « Quelle hypothèse de cause vous semble la mieux étayée par vos résultats ? »

### Signaux d'alerte CP6

- comptes-rendus vagues (sans exemple concret) → exiger trace issue de `eval-results.json`.
- tentation de corriger au lieu d'analyser → rappeler l'objectif du CP.

---

## 8. Debrief final + pont Module 4 (02:50–03:00)

Script conseillé (3 min) :

- « Vous avez maintenant un RAG fonctionnel *et* ses limites observées. »
- « Module 4 = transformer ces constats en améliorations mesurables : chunking, reranking, seuils, faithfulness. »

Clôture (7 min) :

- 2 retours participant "ce qui a le plus surpris"
- rappel livrables à conserver (`chunks.json`, `index.db`, `eval-findings.md`)

---

## 4) Gestion des participants bloqués / en avance

## A. Participants bloqués

### Cas 1 — blocage individuel (<5 personnes)

- Laisser l'agent gérer d'abord.
- Intervenir seulement si blocage >5 min sur un point non pédagogique (env, port, clé).

### Cas 2 — blocage systémique (>=30% de la salle)

- Stopper 2-3 min en plénière.
- Donner un correctif unique et testable (une commande / un check).
- Faire valider rapidement avant de relancer le flux.

### Cas 3 — retard important d'un petit groupe

- Objectif minimal : les remettre sur le rail au checkpoint suivant, pas perfectionner le CP courant.
- Autoriser "good-enough" si exit criteria essentiels sont validés.

## B. Participants en avance

- Leur donner la **side quest du CP courant uniquement**.
- Interdire les optimisations Module 4 (sinon divergence de groupe).
- Leur demander de noter une observation utile pour le debrief.

---

## 5) Règles de coupe temporelle (anti-dérive)

À appliquer sans hésiter :

1. **Règle des 2 minutes** en débrief : une réponse longue est coupée puis parked.
2. **Règle des 80%** : on avance quand 80% ont atteint l'exit minimal.
3. **Parking lot** : toute question d'optimisation est notée pour Module 4.
4. **Un seul message opérationnel à la fois** quand la salle est bloquée.

---

## 6) Checklist facilitateur (impression rapide)

Avant session :

- [ ] repo + corpus présents
- [ ] clé Albert testée
- [ ] timing affiché
- [ ] plan de secours réseau

Pendant session :

- [ ] checkpoint de la salle visible en continu
- [ ] débrief lancé à l'heure prévue
- [ ] aucun CP ne déborde de >5 min

Fin session :

- [ ] chaque participant a `eval-findings.md`
- [ ] pont Module 4 explicite donné
- [ ] points d'amélioration notés pour itération suivante

---

## 7) Liens de travail

- Source de vérité design : `design/module-3-design.md`
- Références CP détaillées : `.agents/skills/module-3-rag/references/cp1-setup.md` à `cp6-eval.md`
- Observations pipeline de référence : `reference/observed-behavior.md`
- Questions d'éval : `data/eval-questions.json`
