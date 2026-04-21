---
marp: true
paginate: true
title: Module 3 — Construis ton RAG
style: |
  @import url("https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.13.0/dist/dsfr/dsfr.min.css");

  :root {
    --fr-bg: #f6f6f6;
    --fr-surface: #ffffff;
    --fr-text: #161616;
    --fr-title: #000091;
    --fr-border: #dddddd;
    --fr-accent: #6a6af4;
  }

  section {
    font-family: Marianne, "Marianne", "Segoe UI", Roboto, Arial, sans-serif;
    background: var(--fr-bg);
    color: var(--fr-text);
    padding: 56px 64px;
    line-height: 1.35;
  }

  h1, h2, h3 {
    color: var(--fr-title);
    margin-bottom: 0.45em;
  }

  h1 { font-size: 1.9em; }
  h2 { font-size: 1.45em; }

  p, li { font-size: 0.95em; }

  ul { margin-top: 0.35em; }
  li { margin: 0.2em 0; }

  .kicker {
    font-size: 0.8em;
    font-weight: 700;
    letter-spacing: .04em;
    text-transform: uppercase;
    color: var(--fr-accent);
    margin-bottom: 0.6em;
  }

  .card {
    background: var(--fr-surface);
    border: 1px solid var(--fr-border);
    border-radius: 8px;
    padding: 14px 16px;
    margin-top: 0.6em;
  }

  .small { font-size: 0.8em; color: #666; }

  .cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
---

<div class="kicker">ALLiaNCE / DINUM</div>
# Module 3 — Construis ton RAG

## Atelier 3h (présentiel)

- 20 participants techniques
- Corpus ANSSI partagé (17 PDFs)
- Stack : Mastra + LibSQL + Albert API

<div class="card small">Contrainte de session : RAG volontairement naïf (on observe les failles avant de les corriger).</div>

---

# Cadrage facilitateur

## Contrat pédagogique

- **Objectif du module** : construire un RAG fonctionnel + documenter ses limites.
- **Rôle agent participant** : guidage individuel + vérification des exits.
- **Rôle facilitateur** : cadence collective, débriefs, gestion des blocages.
- **Règle de rythme** : passage quand **>80%** ont atteint l'exit minimal.

---

# Agenda (180 min)

- 00:00–00:10 — Accueil + cadrage
- 00:10–00:30 — CP1 Setup + débrief
- 00:30–01:00 — CP2 Ingestion + débrief
- 01:00–01:25 — CP3 Embeddings + débrief
- 01:25–01:35 — Pause
- 01:35–02:00 — CP4 Retrieval + débrief
- 02:00–02:30 — CP5 Génération + débrief
- 02:30–02:50 — CP6 Éval + mini debrief
- 02:50–03:00 — Clôture + pont Module 4

---

<div class="kicker">Checkpoint 1 · 20 min</div>
# CP1 — Setup (intro)

## Ce que les participants font maintenant

- Installer dépendances
- Configurer `.env` (`ALBERT_API_KEY`)
- Lancer `pnpm dev`
- Valider `chat-agent` dans Studio

<div class="card">Signal de passage : >80% avec `pnpm dev` opérationnel + réponse `chat-agent` en français.</div>

---

<div class="kicker">Checkpoint 1 · Debrief 5 min</div>
# CP1 — Debrief collectif

## Questions à poser

1. Où avez-vous perdu le plus de temps (clé, port, réseau, dépendances) ?
2. Quelle vérification a débloqué le plus vite ?

<div class="card">Message clé : isoler les problèmes d'environnement avant de toucher le code.</div>

---

<div class="kicker">Checkpoint 2 · 30 min</div>
# CP2 — Ingestion & chunking (intro)

## Ce que les participants font maintenant

- Lire `manifest.json`
- Extraire texte PDF
- Chunking token `500/50`
- Écrire `data/chunks.json`

<div class="card">Signal de passage : >80% avec `chunks.json` valide (>=40 chunks + couverture 17 PDFs).</div>

---

<div class="kicker">Checkpoint 2 · Debrief 10 min</div>
# CP2 — Debrief collectif

## Questions à poser

1. Qu'est-ce que le manifest détecte que le simple count ne voit pas ?
2. Quels défauts du chunking naïf avez-vous observés ?
3. Pourquoi on garde ce niveau de naïveté ici ?

<div class="card">Message clé : on accepte l'imparfait en CP2 pour le rendre observable en CP6.</div>

---

<div class="kicker">Checkpoint 3 · 25 min</div>
# CP3 — Embeddings & index (intro)

## Ce que les participants font maintenant

- Embedder les chunks (batch)
- Créer index `anssi_essentiels` (LibSQL)
- Upsert vecteurs + métadonnées

<div class="card">Signal de passage : >80% avec `count == chunks.length`, dimension 1024, métadonnées présentes.</div>

---

<div class="kicker">Checkpoint 3 · Debrief 5 min</div>
# CP3 — Debrief collectif

## Questions à poser

1. Quel batch size a été le plus stable ?
2. Avez-vous vu des collisions d'IDs / counts incohérents ?

<div class="card">Message clé : robustesse de pipeline > optimisation prématurée.</div>

---

<div class="kicker">Pause</div>
# Pause (10 min)

- Reprise stricte à l'heure affichée
- Vérifier rapidement l'état de la salle avant CP4

<div class="card small">Objectif facilitateur : repartir avec un groupe recadré, pas fragmenté.</div>

---

<div class="kicker">Checkpoint 4 · 25 min</div>
# CP4 — Retrieval (intro)

## Ce que les participants font maintenant

- Implémenter `retrieve(query, k=5)`
- Vérifier scores décroissants
- Tester requêtes contrastées

<div class="card">Signal de passage : >80% avec retrieval stable + hit Zero Trust dans top-5.</div>

---

<div class="kicker">Checkpoint 4 · Debrief 5 min</div>
# CP4 — Debrief collectif

## Questions à poser

1. Pourquoi top-5 et pas top-1 ?
2. Que se passe-t-il hors domaine sans seuil ?

<div class="card">Message clé : un score de similarité n'est pas une preuve de vérité.</div>

---

<div class="kicker">Checkpoint 5 · 30 min</div>
# CP5 — Génération + citations (intro)

## Ce que les participants font maintenant

- Chaîne `retrieve -> generate`
- Format de citation obligatoire
- Test in-corpus + hors-corpus

<div class="card">Signal de passage : >80% avec réponse Zero Trust bien citée et gestion explicite des limites hors-corpus.</div>

---

<div class="kicker">Checkpoint 5 · Debrief 10 min</div>
# CP5 — Debrief collectif

## Questions à poser

1. Avez-vous eu des citations "décoratives" ?
2. Sur hors-corpus, le modèle avoue-t-il les limites ?
3. Quelle instruction prompt a le plus aidé ?

<div class="card">Message clé : réponse fluide ≠ réponse fidèle.</div>

---

<div class="kicker">Checkpoint 6 · 20 min</div>
# CP6 — Éval & analyse (intro)

## Ce que les participants font maintenant

- Exécuter 5 questions d'éval
- Produire `data/eval-results.json`
- Rédiger `eval-findings.md`

<div class="card">Signal de passage : >80% avec `eval-findings.md` (5 questions + 3 failles nommées avec causes).</div>

---

<div class="kicker">Checkpoint 6 · Debrief 5 min</div>
# CP6 — Debrief collectif

## Questions à poser

1. Quelle faille est la plus critique ?
2. La plus simple à corriger en Module 4 ?
3. Quelle cause est la mieux étayée par vos traces ?

<div class="card">Message clé : CP6 produit le backlog d'amélioration du Module 4.</div>

---

# Clôture — Pont vers Module 4

## Ce qu'on emporte

- Un RAG fonctionnel (naïf)
- Des limites observées et documentées
- Une base commune pour comparer les améliorations

<div class="card">
Module 4 = transformer les failles CP6 en gains mesurables :
chunking, reranking, seuils de confiance, faithfulness.
</div>

---

# Notes facilitateur (backup slide)

<div class="cols">
<div class="card">
<strong>Si la salle décroche</strong>
<ul>
<li>Couper le débrief à 2 min par réponse</li>
<li>Recentrer sur 1 signal observable</li>
<li>Appliquer règle des >80%</li>
</ul>
</div>
<div class="card">
<strong>Si la salle va trop vite</strong>
<ul>
<li>Donner side quest du CP courant</li>
<li>Interdire optimisations Module 4</li>
<li>Capturer observations pour debrief</li>
</ul>
</div>
</div>
