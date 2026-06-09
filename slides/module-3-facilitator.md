---
theme: default
transition: fade-out
title: Module 3 — Construis ton RAG · Facilitateur
style: |
  @import url("https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.13.0/dist/dsfr/dsfr.min.css");

  :root {
    --fr-bg: #f6f6f6;
    --fr-surface: #ffffff;
    --fr-text: #161616;
    --fr-muted: #666666;
    --fr-title: #000091;
    --fr-border: #dddddd;
    --fr-accent: #6a6af4;
    --fr-green: #18753c;
    --fr-orange: #b34000;
    --fr-red: #ce0500;
    --fr-blue-soft: #ececff;
  }

  section {
    font-family: Marianne, "Marianne", "Segoe UI", Roboto, Arial, sans-serif;
    background: var(--fr-bg);
    color: var(--fr-text);
    padding: 52px 64px;
    line-height: 1.35;
  }

  h1, h2, h3 {
    color: var(--fr-title);
    margin-bottom: 0.45em;
  }

  h1 { font-size: 1.88em; }
  h2 { font-size: 1.36em; }
  h3 { font-size: 1.05em; }

  p, li { font-size: 0.92em; }
  ul, ol { margin-top: 0.35em; }
  li { margin: 0.16em 0; }
  strong { color: var(--fr-title); }
  code { color: #000091; background: #eeeeff; padding: 0 0.16em; border-radius: 3px; }

  .kicker {
    font-size: 0.78em;
    font-weight: 700;
    letter-spacing: .04em;
    text-transform: uppercase;
    color: var(--fr-accent);
    margin-bottom: 0.5em;
  }

  .subtitle { color: var(--fr-muted); font-size: 0.92em; }
  .small { font-size: 0.76em; color: var(--fr-muted); }
  .center { text-align: center; }
  .big { font-size: 1.2em; }
  .statement { font-size: 1.34em; line-height: 1.25; color: var(--fr-title); font-weight: 700; }

  .card {
    background: var(--fr-surface);
    border: 1px solid var(--fr-border);
    border-radius: 10px;
    padding: 14px 16px;
    margin-top: 0.65em;
  }

  .card.blue { background: var(--fr-blue-soft); border-color: #d4d4ff; }
  .card.green { border-left: 7px solid var(--fr-green); }
  .card.orange { border-left: 7px solid var(--fr-orange); }
  .card.red { border-left: 7px solid var(--fr-red); }

  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .cols-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .cols-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }

  .step, .pill {
    display: inline-block;
    border: 1px solid var(--fr-border);
    background: white;
    border-radius: 999px;
    padding: 6px 10px;
    margin: 4px 4px 4px 0;
    font-size: 0.78em;
  }

  .pill.active { background: var(--fr-title); color: white; border-color: var(--fr-title); }
  .pill.done { background: #e9f7ef; color: var(--fr-green); border-color: #b8e6c8; }
  .pill.warn { background: #fff4e5; color: var(--fr-orange); border-color: #ffd8a8; }

  .pipeline {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    align-items: stretch;
    margin-top: 0.9em;
  }

  .pipebox {
    background: white;
    border: 1px solid var(--fr-border);
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    min-height: 78px;
  }

  .pipebox.active { border: 2px solid var(--fr-title); background: var(--fr-blue-soft); }
  .pipebox.done { border-color: #b8e6c8; background: #e9f7ef; }
  .pipebox .icon { font-size: 1.35em; display: block; margin-bottom: 0.25em; }
  .pipebox .label { font-weight: 700; color: var(--fr-title); font-size: 0.86em; }
  .pipebox .caption { color: var(--fr-muted); font-size: 0.68em; margin-top: 0.2em; }

  .timeline {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: 6px;
    margin-top: 0.8em;
  }
  .timebox { background: white; border: 1px solid var(--fr-border); border-radius: 8px; padding: 7px; font-size: 0.62em; }
  .timebox strong { display: block; font-size: 1.02em; margin-bottom: 3px; }

  .matrix { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 0.8em; }
  .matrix .card { margin-top: 0; min-height: 145px; }

  .example { background: #f7f7ff; border: 1px dashed #9999ff; border-radius: 10px; padding: 12px; font-size: 0.8em; }
  .bad { border-left: 6px solid var(--fr-red); }
  .good { border-left: 6px solid var(--fr-green); }

  .footer-note { position: absolute; left: 64px; right: 64px; bottom: 28px; color: var(--fr-muted); font-size: 0.68em; }
---

<div class="kicker">ALLiaNCE · DINUM</div>
# Module 3 — Construis ton RAG

## Deck facilitateur · Atelier 3h

- Corpus ANSSI « Les Essentiels »
- Stack : Mastra + LibSQL + Albert API
- Objectif : construire, observer, préparer l'amélioration

<div class="card blue small">Source de vérité pédagogique : ce deck cadence la salle ; l'agent participant pilote les micro-étapes techniques.</div>

<!--
Durée : 1 min.
Accueillir les participants, rappeler que le module est pratique et collectif. Dire que ce deck n'est pas un tutoriel de code : il sert à garder le groupe aligné, à annoncer les missions et à organiser les débriefs. Le détail opérationnel sera porté par l'agent de chaque participant.
Signal : tout le monde comprend que l'on alterne plénière courte et travail individuel guidé.
-->

---

<div class="kicker">Contrat pédagogique</div>
# Aujourd'hui, on construit volontairement naïf

<div class="statement">On ne cherche pas le meilleur RAG possible. On cherche un RAG assez simple pour voir où il casse.</div>

- Choix techniques simples et inspectables
- Défauts assumés, pas cachés
- Optimisations garées pour le Module 4

<div class="card orange small">Phrase à répéter : « Très bonne idée d'amélioration — note-la pour Module 4. Maintenant, on observe. »</div>

<!--
Durée : 1 min.
C'est le contrat central. Le risque principal est que les participants techniques veuillent corriger immédiatement : chunking sémantique, reranking, seuils, nettoyage avancé. Les rassurer : ces idées sont bonnes, mais elles arrivent après l'observation. Le Module 3 est une expérience contrôlée où le défaut est une matière pédagogique.
Question : « Qu'est-ce qu'on perdrait si on optimisait tout dès maintenant ? »
-->

---

<div class="kicker">Livrables</div>
# Ce que vous aurez à la fin

<div class="cols-3">
  <div class="card"><strong>1. Corpus découpé</strong><br><code>data/chunks.json</code></div>
  <div class="card"><strong>2. Index local</strong><br><code>data/index.db</code></div>
  <div class="card"><strong>3. Retrieval</strong><br><code>retrieve(query, k)</code></div>
</div>

<div class="cols">
  <div class="card"><strong>4. Réponses citées</strong><br>Agent RAG en français, sources et pages</div>
  <div class="card"><strong>5. Failles documentées</strong><br><code>eval-findings.md</code></div>
</div>

<!--
Durée : 1 min.
Rendre les résultats concrets. Les participants doivent savoir que la progression n'est pas subjective : à chaque étape un fichier, une fonction ou un résultat observable existe. Ces artefacts seront aussi utiles pour reprendre le travail en Module 4.
Signal : les participants peuvent nommer les 5 familles de livrables.
-->

---

<div class="kicker">Carte mentale</div>
# La pipeline cible en une image

<div class="pipeline">
  <div class="pipebox"><span class="icon">📄</span><span class="label">PDFs</span><div class="caption">17 guides ANSSI</div></div>
  <div class="pipebox"><span class="icon">✂️</span><span class="label">Chunks</span><div class="caption">500 / 50</div></div>
  <div class="pipebox"><span class="icon">🧭</span><span class="label">Embeddings</span><div class="caption">1024d</div></div>
  <div class="pipebox"><span class="icon">🔎</span><span class="label">Retrieval</span><div class="caption">top-k</div></div>
  <div class="pipebox"><span class="icon">💬</span><span class="label">Réponse</span><div class="caption">citée</div></div>
  <div class="pipebox"><span class="icon">🧪</span><span class="label">Éval</span><div class="caption">failles</div></div>
</div>

<div class="card small">Chaque étape ajoute une brique — Étape 6 juge l'ensemble.</div>

<!--
Durée : 1 min.
Utiliser cette slide comme carte de navigation. À chaque transition, revenir mentalement à cette chaîne. Important : la génération n'arrive qu'après retrieval ; l'évaluation ne vient qu'une fois un système complet construit.
Question : « À quelle étape commence-t-on vraiment à pouvoir juger la qualité ? » Réponse attendue : pas avant l’Étapes 5/6, même si des signaux apparaissent avant.
-->

---

<div class="kicker">Dynamique de salle</div>
# Rôles : vous, votre agent, le facilitateur

<div class="cols-3">
  <div class="card"><h3>Vous</h3><p>Construisez, lisez les sorties, formulez les observations.</p></div>
  <div class="card"><h3>Votre agent</h3><p>Guide pas à pas, applique les changements, vérifie les exits.</p></div>
  <div class="card"><h3>Facilitateur</h3><p>Cadence le groupe, coupe les dérives, anime les débriefs.</p></div>
</div>

<div class="card blue small">Blocage individuel → agent. Blocage systémique → plénière courte.</div>

<!--
Durée : 1 min.
Clarifier les responsabilités pour éviter deux confusions : attendre du facilitateur qu'il débugge chaque poste, ou attendre de l'agent qu'il anime la pédagogie collective. Le facilitateur intervient surtout quand une incompréhension ou un problème d'environnement touche une part significative de la salle.
Signal : les participants savent quand appeler le facilitateur.
-->

---

<div class="kicker">Learning objectives</div>
# Les 5 objectifs d'apprentissage

1. **Appliquer** — ingérer un corpus et construire un index local
2. **Appliquer** — requêter la pipeline en langage naturel
3. **Appliquer** — générer une réponse contextualisée avec citations
4. **Analyser** — identifier les failles d'une pipeline naïve
5. **Évaluer** — juger fidélité, complétude, traçabilité

<div class="card small">Le vrai cap : passer de “ça répond” à “je sais juger la réponse”.</div>

<!--
Durée : 1 min.
Les objectifs 1-3 sont orientés construction. Les objectifs 4-5 sont le cœur de la maturité RAG. Les expliciter dès le départ aide les participants à accepter l’Étape 6, qui peut sembler moins “productive” mais qui est la plus importante pédagogiquement.
Question : « Lequel de ces objectifs est le plus difficile à automatiser ? » Faire émerger l'évaluation.
-->

---

<div class="kicker">Cadence</div>
# Agenda et règle de cadence

<div class="timeline">
  <div class="timebox"><strong>00:00</strong>Cadrage</div>
  <div class="timebox"><strong>00:10</strong>Étape 1 Setup</div>
  <div class="timebox"><strong>00:30</strong>Étape 2 Ingestion</div>
  <div class="timebox"><strong>01:00</strong>Étape 3 Index</div>
  <div class="timebox"><strong>01:25</strong>Pause</div>
  <div class="timebox"><strong>01:35</strong>Étape 4 Retrieval</div>
  <div class="timebox"><strong>02:00</strong>Étape 5 Génération</div>
  <div class="timebox"><strong>02:30</strong>Étape 6 Éval</div>
  <div class="timebox"><strong>02:50</strong>Clôture</div>
</div>

- Débrief court entre étapes
- Passage quand **~80%** ont l'exit minimal
- Optimisations dans le parking lot Module 4

<!--
Durée : 1 min.
Annoncer dès maintenant que le groupe avancera même si quelques personnes ne sont pas au niveau parfait, sinon l'atelier dérive. Les participants en retard pourront se raccrocher aux exits essentiels. Les participants en avance font uniquement les side quests de l'étape courante.
Signal : acceptation de la règle des 80%.
-->

---

<div class="kicker">Mode opératoire</div>
# Comment travailler avec l'agent

<div class="cols">
  <div class="card green"><strong>À faire</strong><br>Lire les sorties, vérifier les critères, poser une question quand un résultat surprend.</div>
  <div class="card red"><strong>À éviter</strong><br>Copier sans comprendre, sauter une étape, optimiser avant l’Étape 6.</div>
</div>

- Une micro-étape à la fois
- Une preuve observable avant de continuer
- Une idée d'amélioration = parking lot

<!--
Durée : 1 min.
Donner un mode de collaboration avec l'agent. Le risque est que l'agent devienne une machine à copier-coller. Demander aux participants d'expliquer les résultats clés avec leurs mots, surtout à partir de l’Étape 2. Le facilitateur peut interrompre si la salle “avance” sans comprendre.
Question : « Quelle preuve vous autorise à passer à l'étape suivante ? »
-->

---

<div class="kicker">Agent-assisted learning</div>
# Réussir vite ≠ apprendre durablement

<div class="statement">L'agent peut accélérer la construction. Notre travail est de garder la compréhension dans la boucle.</div>

<div class="cols">
  <div class="card green"><strong>Performance</strong><br>Le code tourne, les fichiers existent, l'agent répond.</div>
  <div class="card orange"><strong>Apprentissage</strong><br>Vous savez expliquer, vérifier et diagnostiquer sans copier aveuglément.</div>
</div>

<div class="card small">Règle atelier : chaque étape se termine par une preuve, pas par une impression.</div>

<!--
Durée : 1 min.
Introduire le paradoxe performance/apprentissage observé dans la littérature sur l'IA générative en programmation : les agents améliorent la réussite immédiate mais peuvent créer une illusion de compétence si l'apprenant délègue le raisonnement. Ne pas dramatiser ; poser simplement le contrat : aujourd'hui on construit ET on vérifie ce que l'on comprend.
Question : « Comment sauriez-vous que vous avez vraiment compris une étape ? »
-->

---

<div class="kicker">Posture avec l'agent</div>
# Tuteur, pas prestataire

<div class="cols">
  <div class="card green"><h3>Mode tuteur</h3><p>« Explique le compromis chunk size / retrieval. »<br>« Quelle hypothèse cette erreur invalide-t-elle ? »</p></div>
  <div class="card red"><h3>Mode prestataire</h3><p>« Écris tout le code. »<br>« Fixe cette erreur. »<br>Copier sans lecture.</p></div>
</div>

<div class="card blue small">Geste attendu : prédire → demander → vérifier → expliquer.</div>

<!--
Durée : 1 min.
Nommer explicitement les deux postures. Le facilitateur peut interrompre si plusieurs participants utilisent l'agent comme prestataire. Phrase courte : « Demandez-lui d'abord de vous rendre capable de juger sa proposition. » Faire écrire une question “mode tuteur” avant le lancement de l’Étape 1 si le groupe semble novice avec les agents.
Signal : les prompts posent des questions de compréhension, pas seulement des demandes d'exécution.
-->

---

<div class="kicker">Étape 1 · 20 min</div>
# Étape 1 — Mission : valider la fondation

<div class="pipeline">
  <div class="pipebox active"><span class="icon">💬</span><span class="label">Chat baseline</span><div class="caption">Mastra + Albert</div></div>
  <div class="pipebox"><span class="icon">📄</span><span class="label">Corpus</span><div class="caption">pas encore</div></div>
  <div class="pipebox"><span class="icon">🔎</span><span class="label">Retrieval</span><div class="caption">pas encore</div></div>
  <div class="pipebox"><span class="icon">📚</span><span class="label">Citations</span><div class="caption">pas encore</div></div>
  <div class="pipebox"><span class="icon">🧪</span><span class="label">Éval</span><div class="caption">pas encore</div></div>
  <div class="pipebox"><span class="icon">✅</span><span class="label">Exit</span><div class="caption">agent répond</div></div>
</div>

<div class="card">Objectif : isoler les problèmes d'environnement avant les problèmes RAG.</div>

<!--
Durée : 1 min d'intro, puis lancement Étape 1.
Dire : « Pour l'instant, on ne cherche pas à lire l'ANSSI. On vérifie que la chaîne locale parle au modèle. » C'est une étape de confiance : si Étape 1 est instable, tout le reste sera impossible à diagnostiquer.
Signal de passage : plus de 80% avec Mastra Studio accessible et chat-agent fonctionnel.
-->

---

<div class="kicker">Étape 1 · Concept</div>
# Un agent qui parle n'est pas encore un RAG

<div class="cols">
  <div class="card"><h3>Chat baseline</h3><ul><li>Répond avec le modèle</li><li>Pas de corpus ANSSI</li><li>Pas de sources</li><li>Pas de retrieval</li></ul></div>
  <div class="card blue"><h3>RAG cible</h3><ul><li>Récupère des passages</li><li>Répond avec contexte</li><li>Cite source + page</li><li>Peut être évalué</li></ul></div>
</div>

<!--
Durée : 2 min si nécessaire, sinon slide rapide.
Cette distinction évite une confusion très fréquente : un LLM fluent donne l'impression de connaissance. Demander au chat-agent de préciser qu'il n'a pas encore accès aux guides ANSSI est un test pédagogique, pas seulement fonctionnel.
Question : « Qu'est-ce qui manque pour passer de la colonne gauche à la colonne droite ? »
-->

---

<div class="kicker">Étape 1 · Exit criteria</div>
# Étape 1 — Signal de sortie

- `node_modules/` présent
- `.env` avec `ALBERT_API_KEY` non vide
- `npm run dev` expose `http://localhost:4111`
- `chat-agent` répond en français

<div class="card orange small">Erreur fréquente : `.env` existe, mais la clé est vide ou l'agent tourne dans le mauvais dossier.</div>

<!--
Durée : 1 min avant travail, 1 min au moment de clôturer Étape 1.
Rappeler que l'on ne croit pas “ça devrait marcher” : on vérifie. Si la salle bloque massivement sur 401/403, traiter la clé Albert en plénière. Si plusieurs machines bloquent sur le port, donner une consigne unique.
Signal : critères observés, pas déclarés.
-->

---

<div class="kicker">Étape 1 · Débrief 5 min</div>
# Étape 1 — Debugger par couches

<div class="statement">Quelle vérification a isolé le problème le plus vite ?</div>

- Dépendances ?
- `.env` / clé API ?
- Serveur local / port ?
- Agent / modèle ?

<div class="card small">Message clé : on ne débugge pas le RAG tant que la fondation n'est pas stable.</div>

<!--
Durée : 5 min.
Demander 2 retours rapides, pas plus. Si un cas particulier est intéressant mais long, le mettre en parking. Faire émerger l'ordre de diagnostic : dépendances → environnement → serveur → agent → modèle. Clore en reliant à l’Étape 2 : maintenant que le modèle répond, on va lui donner un corpus.
Question principale affichée. Relance : « Quel check referiez-vous en premier demain ? »
-->

---

<div class="kicker">Étape 2 · 30 min</div>
# Étape 2 — Mission : transformer les PDFs en chunks

<div class="cols">
  <div class="card"><strong>Artefact</strong><br><code>data/chunks.json</code></div>
  <div class="card"><strong>Contrat</strong><br>17 PDFs représentés, métadonnées conservées</div>
</div>

- Extraire le texte des guides ANSSI
- Découper en chunks `500 / 50`
- Assumer un chunking naïf
- Préparer les citations futures

<!--
Durée : 1 min d'intro.
Insister : l'objectif critique n'est pas de produire “beaucoup de chunks”, mais de couvrir correctement le manifest et de garder les métadonnées. Les améliorations de chunking sont explicitement hors scope pour le moment.
Signal de passage : `chunks.json` existe, >=40 chunks, 17 PDFs représentés.
-->

---

<div class="kicker">Étape 2 · Modèle mental</div>
# Du PDF au chunk

<div class="pipeline">
  <div class="pipebox active"><span class="icon">📄</span><span class="label">PDF</span><div class="caption">mise en page</div></div>
  <div class="pipebox active"><span class="icon">📃</span><span class="label">Texte</span><div class="caption">structure perdue</div></div>
  <div class="pipebox active"><span class="icon">✂️</span><span class="label">Chunks</span><div class="caption">500 / 50</div></div>
  <div class="pipebox active"><span class="icon">🏷️</span><span class="label">Métadonnées</span><div class="caption">source + page</div></div>
  <div class="pipebox"><span class="icon">🔎</span><span class="label">Retrieval</span><div class="caption">plus tard</div></div>
  <div class="pipebox"><span class="icon">📚</span><span class="label">Citations</span><div class="caption">plus tard</div></div>
</div>

<div class="card orange small">Ce passage perd de l'information : structure, titres, tableaux, continuité logique.</div>

<!--
Durée : 2 min.
Faire comprendre que l'extraction PDF n'est pas neutre. Une page n'est pas qu'un texte linéaire : elle contient des titres, des encadrés, parfois des répétitions d'en-tête. Le chunking naïf simplifie tout cela pour rendre le système constructible.
Question : « Quelle information utile peut disparaître quand on passe d'un PDF à du texte brut ? »
-->

---

<div class="kicker">Étape 2 · Traçabilité</div>
# Le contrat de métadonnées

<div class="example">
{
  "text": "...",
  "source": "anssi_essentiels_zero_trust_1.0.pdf",
  "page": 7,
  "chunk_index": 3,
  "guide_id": "modele-zero-trust"
}
</div>

- `text` : contenu récupérable
- `source` + `page` : citation possible
- `chunk_index` : diagnostic et unicité
- `guide_id` : regroupement documentaire

<!--
Durée : 2 min.
Relier Étape 2 à l’Étape 5 : si les métadonnées sont perdues ici, les citations seront impossibles ou décoratives plus tard. C'est un point important : la qualité RAG se joue avant la génération.
Question : « Quelle clé est indispensable pour vérifier une citation ? » Réponse attendue : source/page, avec chunk_index utile pour diagnostiquer.
-->

---

<div class="kicker">Étape 2 · Choix volontaire</div>
# Chunking naïf : pourquoi on l'assume

<div class="cols">
  <div class="card green"><strong>Ce que ça rend facile</strong><ul><li>Rapide à construire</li><li>Comparable entre participants</li><li>Simple à diagnostiquer</li></ul></div>
  <div class="card orange"><strong>Ce que ça casse</strong><ul><li>Coupures arbitraires</li><li>Bruit d'en-tête / pied</li><li>Contexte fragmenté</li></ul></div>
</div>

<div class="card small">Défaut volontaire aujourd'hui = hypothèse d'amélioration demain.</div>

<!--
Durée : 2 min.
Cette slide est un amortisseur contre l'optimisation prématurée. Valider l'intuition des participants : oui, il existe de meilleurs chunkers. Mais le but est que tout le monde partage le même défaut pour pouvoir le discuter en Étape 6 et Module 4.
Phrase prête : « On ne corrige pas le chunking maintenant, on collecte ses symptômes. »
-->

---

<div class="kicker">Étape 2 · Débrief 10 min</div>
# Étape 2 — Compter ne suffit pas

<div class="statement">Qu'est-ce que la couverture manifest révèle que le simple count ne voit pas ?</div>

- 17 PDFs vraiment représentés ?
- En-têtes ou pieds récurrents ?
- Chunks coupés au mauvais endroit ?
- `guide_id` ambigu ou insuffisant ?

<!--
Durée : 10 min.
Faire parler 2-3 participants. Demander un exemple concret de défaut observé dans un chunk. Si quelqu'un propose une correction, la reformuler comme hypothèse Module 4. Clore sur la transition : ces chunks vont maintenant être transformés en vecteurs, donc les défauts textuels vont se propager dans l'index.
Signal : la salle comprend que la donnée préparée conditionne tout le reste.
-->

---

<div class="kicker">Étape 3 · 25 min</div>
# Étape 3 — Mission : rendre les chunks interrogeables

<div class="cols">
  <div class="card"><strong>Artefact</strong><br><code>data/index.db</code></div>
  <div class="card"><strong>Modèle</strong><br><code>openweight-embeddings</code> · 1024 dimensions</div>
</div>

- Embedder chaque chunk
- Stocker dans LibSQL
- Préserver les métadonnées
- Vérifier count, dimension, smoke query

<!--
Durée : 1 min d'intro.
Insister sur le mot “interrogeable” : un chunk brut est lisible par humain ; un embedding permet une recherche de similarité. Les participants n'ont pas besoin de théorie ML profonde, mais ils doivent comprendre les checks structurels.
Signal de passage : index créé, count égal au nombre de chunks, dimension 1024.
-->

---

<div class="kicker">Étape 3 · Modèle mental</div>
# Embeddings : coordonnées sémantiques, pas vérité

<div class="cols">
  <div class="card blue"><strong>Idée utile</strong><br>Des textes proches par le sens obtiennent des vecteurs proches.</div>
  <div class="card orange"><strong>Limite utile</strong><br>Proximité ne veut pas dire exactitude, preuve ou vérité.</div>
</div>

<div class="example center">question “Zero Trust” → cherche les points proches dans l'espace vectoriel</div>

<!--
Durée : 2 min.
Donner une analogie : l'embedding est une carte approximative du sens. Une carte peut aider à se repérer sans être le territoire. Le risque à prévenir : croire que les vecteurs comprennent ou garantissent la vérité.
Question : « Si deux chunks sont proches, qu'est-ce que cela prouve ? » Réponse : seulement une similarité calculée, pas une validité documentaire.
-->

---

<div class="kicker">Étape 3 · Robustesse</div>
# Index vectoriel : trois checks vitaux

<div class="cols-3">
  <div class="card"><strong>Count</strong><br><code>count == chunks.length</code></div>
  <div class="card"><strong>Dimension</strong><br><code>dimension == 1024</code></div>
  <div class="card"><strong>Métadonnées</strong><br><code>source</code>, <code>page</code>, <code>chunk_index</code></div>
</div>

<div class="card red small">Un index peut exister et être faux : IDs non uniques, ancien index, modèle incohérent.</div>

<!--
Durée : 2 min.
Faire sentir que l'existence d'un fichier DB n'est pas une preuve suffisante. Un `count` trop bas évoque souvent des collisions d'IDs. Une dimension inattendue signale un modèle différent. Des métadonnées absentes détruisent la traçabilité.
Question : « Si `count < chunks.length`, quelle hypothèse testez-vous d'abord ? »
-->

---

<div class="kicker">Étape 3 · Débrief 5 min</div>
# Étape 3 — Les erreurs silencieuses

<div class="statement">Quel problème aurait pu passer inaperçu sans check structurel ?</div>

- Batch size trop ambitieux ?
- IDs non uniques ?
- Index non réinitialisé ?
- Métadonnées perdues ?

<!--
Durée : 5 min.
Demander une seule observation par personne volontaire. Le point clé : certaines erreurs ne produisent pas de crash, seulement un système faux. C'est une leçon importante pour RAG en production.
Transition : l'index est prêt ; maintenant on va voir ce qu'il remonte quand on pose une question.
-->

---

<div class="kicker">Pause · 10 min</div>
# Pause — où en est la pipeline ?

<div class="pipeline">
  <div class="pipebox done"><span class="icon">✅</span><span class="label">Étape 1</span><div class="caption">baseline</div></div>
  <div class="pipebox done"><span class="icon">✅</span><span class="label">Étape 2</span><div class="caption">chunks</div></div>
  <div class="pipebox done"><span class="icon">✅</span><span class="label">Étape 3</span><div class="caption">index</div></div>
  <div class="pipebox active"><span class="icon">🔎</span><span class="label">Étape 4</span><div class="caption">retrieval</div></div>
  <div class="pipebox"><span class="icon">💬</span><span class="label">Étape 5</span><div class="caption">réponse</div></div>
  <div class="pipebox"><span class="icon">🧪</span><span class="label">Étape 6</span><div class="caption">éval</div></div>
</div>

<div class="card small">Après la pause, on passe de “préparer le corpus” à “interroger le corpus”.</div>

<!--
Durée : 1 min avant pause ou au retour.
Utiliser cette slide comme point de synchronisation. Si la salle est très fragmentée, identifier les participants qui doivent se raccrocher au minimum viable : chunks + index valides. Reprendre strictement à l'heure annoncée.
Signal : groupe prêt pour retrieval.
-->

---

<div class="kicker">Étape 4 · 25 min</div>
# Étape 4 — Mission : retrouver du contexte

<div class="cols">
  <div class="card"><strong>Artefact</strong><br><code>retrieve(query, k=5)</code></div>
  <div class="card"><strong>But</strong><br>Retourner les chunks candidats avec scores et métadonnées</div>
</div>

- Embedder la question
- Interroger l'index
- Retourner un top-5 trié
- Inspecter les chunks, pas seulement les scores

<!--
Durée : 1 min d'intro.
Clarifier : Étape 4 ne produit pas encore de réponse utilisateur. Il produit du contexte candidat. Le top-5 est un choix pédagogique qui rend visible le compromis signal/bruit.
Signal de passage : 3 requêtes test retournent 5 chunks non vides avec métadonnées, Zero Trust apparaît dans le top-5.
-->

---

<div class="kicker">Étape 4 · Modèle mental</div>
# La requête devient un vecteur

<div class="pipeline">
  <div class="pipebox active"><span class="icon">❓</span><span class="label">Question</span><div class="caption">langage naturel</div></div>
  <div class="pipebox active"><span class="icon">🧭</span><span class="label">Embedding</span><div class="caption">même modèle</div></div>
  <div class="pipebox active"><span class="icon">📍</span><span class="label">Similarité</span><div class="caption">cosinus</div></div>
  <div class="pipebox active"><span class="icon">🔎</span><span class="label">Top-k</span><div class="caption">5 chunks</div></div>
  <div class="pipebox"><span class="icon">💬</span><span class="label">Réponse</span><div class="caption">Étape 5</div></div>
  <div class="pipebox"><span class="icon">🧪</span><span class="label">Jugement</span><div class="caption">Étape 6</div></div>
</div>

<div class="card orange small">Si la question et les chunks n'utilisent pas le même modèle, les résultats deviennent difficiles à interpréter.</div>

<!--
Durée : 2 min.
Faire le lien avec Étape 3 : la même géométrie vectorielle doit s'appliquer aux chunks et à la question. Un mismatch de modèle est un bug conceptuel plus qu'un simple bug de code.
Question : « Pourquoi embedder aussi la question ? »
-->

---

<div class="kicker">Étape 4 · Limite clé</div>
# Top-k : liste de suspects, pas verdict

<div class="cols-3">
  <div class="card"><strong>Top-1</strong><br>Trop fragile</div>
  <div class="card blue"><strong>Top-5</strong><br>Compromis pédagogique</div>
  <div class="card"><strong>Top-50</strong><br>Trop bruyant</div>
</div>

<div class="card red small">Sans seuil, une question hors-corpus renvoie quand même des “meilleurs” chunks.</div>

<!--
Durée : 2 min.
La métaphore : une liste de suspects n'est pas un verdict. Le retrieval propose des candidats. Il ne sait pas toujours dire “je ne sais pas”. C'est particulièrement visible avec la question hors-corpus, qui doit quand même produire un top-k.
Phrase à faire dire : « score ≠ vérité ».
-->

---

<div class="kicker">Étape 4 · Débrief 5 min</div>
# Étape 4 — Que valent les scores ?

<div class="statement">Que signifie un top-5 sur une question hors corpus ?</div>

- Le système force un classement
- Le score mesure une proximité, pas une preuve
- Le chunk doit être lu
- L'absence de seuil est un choix naïf

<!--
Durée : 5 min.
Faire comparer rapidement une requête propre et une requête hors domaine. Ne pas entrer dans les solutions (seuil, reranking, query rewriting) ; les noter pour Module 4. Le message à faire émerger : retrieval est une étape probabiliste et inspectable, pas une vérité documentaire.
Transition : maintenant que le contexte remonte, on va le donner au modèle pour produire une réponse.
-->

---

<div class="kicker">Étape 5 · 30 min</div>
# Étape 5 — Mission : répondre avec preuves

<div class="cols">
  <div class="card"><strong>Artefact</strong><br>Point d'entrée RAG exécutable</div>
  <div class="card"><strong>Contrat</strong><br>Réponse française + citations <code>source/page</code></div>
</div>

- Récupérer le top-5
- Injecter le contexte
- Générer une réponse
- Citer chaque affirmation importante

<!--
Durée : 1 min d'intro.
C'est souvent le moment où les participants ressentent que “ça marche”. Prévenir immédiatement : on va juger non seulement la fluidité, mais l'ancrage et la traçabilité.
Signal de passage : question Zero Trust répondue en français avec au moins 2 citations cohérentes ; question hors-corpus traitée prudemment.
-->

---

<div class="kicker">Étape 5 · Orchestration</div>
# `retrieve -> generate`

<div class="pipeline">
  <div class="pipebox active"><span class="icon">❓</span><span class="label">Question</span><div class="caption">utilisateur</div></div>
  <div class="pipebox active"><span class="icon">🔎</span><span class="label">retrieve</span><div class="caption">top-5</div></div>
  <div class="pipebox active"><span class="icon">📚</span><span class="label">Contexte</span><div class="caption">chunks</div></div>
  <div class="pipebox active"><span class="icon">💬</span><span class="label">generate</span><div class="caption">LLM</div></div>
  <div class="pipebox active"><span class="icon">🏷️</span><span class="label">Citations</span><div class="caption">source/page</div></div>
  <div class="pipebox"><span class="icon">🧪</span><span class="label">Audit</span><div class="caption">Étape 6</div></div>
</div>

<div class="card small">La génération hérite directement de la qualité du retrieval.</div>

<!--
Durée : 1 min.
Montrer que la génération n'est pas magique : elle dépend de ce que Étape 4 lui donne. Si les chunks sont hors sujet, le modèle peut être fluide mais mal ancré. C'est le lien central avec l'évaluation.
Question : « Quel est le maillon le plus faible si la réponse est hors sujet ? » Réponse : ça dépend, il faut inspecter retrieval et prompt.
-->

---

<div class="kicker">Étape 5 · Prompt contract</div>
# Le contrat de réponse

- Répondre **uniquement** avec les passages fournis
- Citer chaque affirmation importante
- Utiliser un format stable : `[source: fichier, pN]`
- Dire explicitement quand le contexte manque

<div class="card orange small">Un format instable aujourd'hui rend l'évaluation de l’Étape 6 beaucoup plus difficile.</div>

<!--
Durée : 1 min.
Insister sur le caractère vérifiable du contrat. Les citations ne sont pas décoratives : elles rendent la réponse auditable. La règle “si le contexte manque, le dire” doit être testée avec une question hors-corpus.
Question : « Quelle consigne du prompt rend la réponse vérifiable ? »
-->

---

<div class="kicker">Étape 5 · Qualité</div>
# Citation probante vs citation décorative

<div class="cols">
  <div class="example bad"><strong>Décorative</strong><br>“Le modèle Zero Trust réduit les risques.” [source: guide.pdf, p7]<br><br><span class="small">La page citée ne soutient pas clairement l'affirmation.</span></div>
  <div class="example good"><strong>Probante</strong><br>“Le modèle repose sur la vérification continue des accès.” [source: zero_trust.pdf, p7]<br><br><span class="small">Le passage cité contient l'idée affirmée.</span></div>
</div>

<div class="card small">Présence d'une citation ≠ preuve que la citation soutient l'affirmation.</div>

<!--
Durée : 2 min.
Faire lire la différence. Une citation décorative satisfait parfois un test regex mais échoue à l'audit humain. C'est une transition directe vers les critères Étape 6. Éviter les longs exemples : le but est le geste d'audit, pas le contenu ANSSI exact.
Question : « Que faut-il comparer pour juger une citation ? » Réponse : affirmation ↔ chunk cité.
-->

---

<div class="kicker">Étape 5 · Débrief 10 min</div>
# Étape 5 — Fluide ou fidèle ?

<div class="statement">Avez-vous obtenu une belle réponse impossible à vérifier ?</div>

- Citations absentes ?
- Citations instables ?
- Citations qui ne soutiennent pas l'affirmation ?
- Hallucination sur la question hors-corpus ?

<!--
Durée : 8 min.
Demander explicitement un cas où la réponse était convaincante mais problématique. C'est souvent le moment le plus révélateur. Si la salle ne trouve rien, insister sur la question hors-corpus mots de passe. Clore : Étape 6 va formaliser ce jugement avec une grille, au lieu de rester dans l'impression. Si le groupe est en retard, réduire ce débrief à 5 minutes et garder la question hors-corpus comme preuve principale.
Signal : le groupe distingue fluidité, fidélité et traçabilité.
-->

---

<div class="kicker">Étape 6 · 20 min</div>
# Étape 6 — Mission : stresser la pipeline

<div class="cols">
  <div class="card"><strong>Artefacts</strong><br><code>data/eval-results.json</code><br><code>eval-findings.md</code></div>
  <div class="card"><strong>Objectif</strong><br>5 questions exécutées, 3 failles nommées</div>
</div>

- Lancer
- Observer
- Écrire
- Ne pas corriger

<!--
Durée : 30 sec d'intro.
Le changement de posture est crucial : on arrête de construire pour juger. Répéter que Étape 6 n'est pas une phase d'optimisation. Les participants doivent produire des preuves écrites qui serviront de point de départ au Module 4.
Signal de passage : `eval-findings.md` contient 5 résultats et 3 failles structurées avant la clôture de 02:50.
-->

---

<div class="kicker">Étape 6 · Règle</div>
# On n'optimise pas : on observe

<div class="statement">Une preuve avant une solution.</div>

- Pas de correction de chunking
- Pas de reranking improvisé
- Pas de seuil ajouté en urgence
- Une faille = un exemple + une cause probable

<div class="card orange small">Phrase prête : « C'est une très bonne amélioration — note-la pour Module 4, mais maintenant on documente la faille. »</div>

<!--
Durée : 1 min.
Cette slide sert à empêcher la dérive naturelle des profils techniques. Valider l'envie d'améliorer, puis recadrer vers l'observation. Une solution sans preuve risque de résoudre le mauvais problème.
Question : « Quelle preuve écrite aurez-vous à la fin de cette étape ? »
-->

---

<div class="kicker">Étape 6 · Grille</div>
# La grille : contexte / fidélité / complétude / citation

<div class="cols-4">
  <div class="card"><h3>Contexte</h3><p>Les chunks récupérés sont-ils utiles pour la question ?</p></div>
  <div class="card"><h3>Fidélité</h3><p>Chaque affirmation vient-elle vraiment des chunks fournis ?</p></div>
  <div class="card"><h3>Complétude</h3><p>La réponse couvre-t-elle les informations attendues du corpus ?</p></div>
  <div class="card"><h3>Citation</h3><p>La source citée soutient-elle l'affirmation exacte ?</p></div>
</div>

<div class="card small">Une réponse peut utiliser le bon corpus, rester incomplète, ou citer une page sans que la citation soit probante.</div>

<!--
Durée : 1 min.
Définir les quatre critères avec des mots simples. La recherche RAG distingue retrieval/context relevance, faithfulness, answer relevance/completeness et citation quality. Ne pas introduire les métriques RAGAS/RAGChecker ici : le but est d'abord de construire le jugement humain. Exemple oral : une citation décorative donne une page, mais cette page ne soutient pas l'affirmation exacte.
Signal : les participants nomment au moins un critère précis dans `eval-findings.md`.
-->

---

<div class="kicker">Étape 6 · Écriture des failles</div>
# Nommer une faille correctement

<div class="example">
- <strong>Type</strong> : citation décorative<br>
  <strong>Exemple</strong> : Q2 cite `guide.pdf p4`, mais le passage ne contient pas l'affirmation.<br>
  <strong>Hypothèse de cause</strong> : prompt trop permissif ou chunk hors sujet dans le top-5.
</div>

- Type nommé
- Exemple concret
- Hypothèse testable
- Piste Module 4, sans implémentation

<!--
Durée : 1 min.
Montrer la granularité attendue. Une faille doit être actionnable : ni trop vague, ni déjà transformée en solution. Le trio type/exemple/cause probable force les participants à relier symptôme et pipeline.
Question : « Cette faille permet-elle de décider quoi tester en Module 4 ? »
-->

---

<div class="kicker">Étape 6 · Débrief 5 min</div>
# Étape 6 — Quelles failles reviennent ?

<div class="statement">Quelle faille devient votre première hypothèse Module 4 ?</div>

- Hallucination hors-corpus ?
- Retrieval hors sujet ?
- Chunking bruité ?
- Citation fausse ou décorative ?

<!--
Durée : 4 min.
Récolter rapidement 3 failles au tableau. Pour chaque faille, demander un exemple concret et une cause probable. Ne pas chercher à résoudre. Le but est d'obtenir une cartographie initiale des problèmes les plus fréquents et de créer l'attente du Module 4.
Signal : au moins 3 failles collectives sont nommées.
-->

---

<div class="kicker">Transition Module 4</div>
# Des failles aux améliorations mesurables

<div class="pipeline">
  <div class="pipebox active"><span class="icon">⚠️</span><span class="label">Faille</span><div class="caption">observée</div></div>
  <div class="pipebox active"><span class="icon">🔍</span><span class="label">Cause</span><div class="caption">hypothèse</div></div>
  <div class="pipebox active"><span class="icon">🛠️</span><span class="label">Technique</span><div class="caption">candidate</div></div>
  <div class="pipebox active"><span class="icon">📏</span><span class="label">Métrique</span><div class="caption">succès</div></div>
  <div class="pipebox done"><span class="icon">✅</span><span class="label">Amélioration</span><div class="caption">mesurée</div></div>
  <div class="pipebox"><span class="icon">🔁</span><span class="label">Itérer</span><div class="caption">Module 4</div></div>
</div>

<div class="card small">Module 4 ne part pas de recettes génériques : il part de vos failles observées.</div>

<!--
Durée : 2 min.
Faire le pont explicitement. Les techniques de Module 4 — meilleur chunking, seuils, reranking, évaluation de faithfulness — doivent apparaître comme réponses à des symptômes, pas comme une liste d'outils à empiler.
Question : « Quelle métrique prouverait que votre première amélioration fonctionne ? »
-->

---

<div class="kicker">À conserver</div>
# Ce qu'il faut conserver

<div class="cols-4">
  <div class="card"><code>chunks.json</code><br><span class="small">données découpées</span></div>
  <div class="card"><code>index.db</code><br><span class="small">index local</span></div>
  <div class="card"><code>eval-results.json</code><br><span class="small">sorties brutes</span></div>
  <div class="card"><code>eval-findings.md</code><br><span class="small">analyse</span></div>
</div>

- Notes personnelles de débrief
- Idées placées en parking lot
- Questions non résolues

<!--
Durée : 1 min.
Rappeler les artefacts à ne pas supprimer. Ils forment la base du Module 4 et peuvent servir à comparer avant/après. Si nécessaire, demander aux participants de vérifier que `eval-findings.md` est bien sauvegardé.
Signal : chacun sait quels fichiers garder.
-->

---

<div class="kicker">Clôture</div>
# Construire → observer → nommer → améliorer

<div class="statement center">Vous avez maintenant un RAG fonctionnel — et surtout une première méthode pour juger ses limites.</div>

<div class="card blue center">Prochaine étape : transformer les failles documentées en améliorations mesurables.</div>

<!--
Durée : 2 min.
Clore en valorisant la démarche. Le résultat n'est pas seulement un mini-RAG : c'est une capacité à le critiquer. Remercier, annoncer Module 4, et demander éventuellement un retour à chaud : “ce qui vous a le plus surpris”.
Signal : fin du Module 3, transition claire vers Module 4.
-->
