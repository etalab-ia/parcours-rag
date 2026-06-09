# Observations — pipeline RAG de référence sur le corpus ANSSI

**Run de référence** : pipeline construite dans `reference/`, exécutée sur le corpus `corpus/anssi-essentiels/` (17 PDFs, 55 chunks), embeddings `openweight-embeddings` (BAAI/bge-m3, 1024d) + chat `openweight-large` (gpt-oss-120b) via Albert API.

Ces observations alimentent directement : (1) la rédaction des hints et vérifications Étapes 2–6, (2) les débriefs collectifs, et (3) le pont vers Module 4.

## 1. Profil du corpus — trouvailles inattendues

| Attendu (design doc §Étape 2) | Observé | Conséquence |
|---|---|---|
| ≥500 chunks | **55 chunks** (chunking page-par-page, token 500 / overlap 50) | L'exit criterion Étape 2 doit être revu à la baisse. Proposer « ≥40 chunks » (plancher sûr) ou plutôt « chaque PDF produit ≥1 chunk avec `text`/`source`/`page` ». |
| Guide « Mots de passe ANSSI » présent | **Absent** | La question canonique du design doc (« Quelles sont les règles d'hygiène des mots de passe selon l'ANSSI ? ») est en réalité **hors corpus**. Parfaite matière pour le profil « piège » de Étape 6 — voir Q3 ci-dessous. |

Les guides « Les Essentiels » sont des fiches format poster de 1 à 2 pages, à puces denses. C'est un corpus *court* et *hétérogène*, pas un corpus narratif.

## 2. Comportement du chunking naïf (token 500 / overlap 50, page-par-page)

- **55 chunks, 324–1896 caractères.** Distribution : 2–4 chunks par guide selon le nombre de pages PDF (1–2 p) et la densité textuelle.
- **Chunks quasi-dupliqués dans le top-5.** Les PDFs 2 pages produisent parfois des p1 et p2 avec embeddings très proches — mêmes scores à ±0.001. Exemple Q2 Migration : top-2 sont tous deux `migration p1` avec score **0.724 identique**. Moins fréquent qu'avec un chunking trop agressif, mais observable sur 2 des 5 questions.
- **Cause probable** : les en-têtes/pieds identiques (« www.cyber.gouv.fr / conseil.technique@ssi.gouv.fr LES ESSENTIELS [titre] V[x] ([date]) ») occupent ~80 caractères par chunk — signal sémantique commun à toutes les pages d'un même guide.
- **Conséquence pédagogique** : c'est une faille *observable à l'œil nu*. Parfait matériau Étape 2/Étape 6. À mentionner explicitement dans les pièges pédagogiques Étape 2.

## 3. Comportement du retrieval (top-5, cosine, pas de seuil)

Distribution empirique des scores observée :

| Profil de question | Score top-1 observé | Interprétation |
|---|---|---|
| Question topique bien ciblée (Zero Trust, Migration) | 0.60–0.76 | Fort match |
| Question topique moyenne (IGC seul, sélection logiciel libre) | 0.50–0.60 | Match honorable |
| Question ambiguë / transverse (comptes admin) | 0.54–0.57 | Match faible |
| Question hors corpus (mots de passe) | **0.57–0.59** | **Score tangentiel — indiscernable d'une question moyenne !** |
| Greeting non-technique (« Bonjour, comment vas-tu ? ») | 0.38–0.43 | Seul profil clairement bas |

**Leçon** : un seuil à 0.55–0.60 ne séparerait PAS les questions hors-corpus des questions transverses. C'est le cœur de la discussion Étape 5/Étape 6 sur les garde-fous.

## 4. Résultats par question d'éval

### Q1 — Zero Trust (facile) ✓

- **Retrieval** : 2/5 chunks du bon guide (scores 0.623 + 0.560), puis 3 chunks tangentiels (architecture 0.476, migration 0.457, Windows membre 0.447). Le guide Zero Trust ne produit que 4 chunks au total ; le top-5 force 3 chunks hors sujet dans le contexte.
- **Génération** : malgré le bruit, très bonne. Réponse structurée, cite 5 fois « Modèle Zero Trust ». Couvre les 3 piliers (sujet, contexte, ressource).
- **Statut** : happy path fidèle. C'est la démo qui rassure les participants au Étape 4. À noter pour Étape 4 : le top-5 est plus grand que le nombre de chunks pertinents — phénomène récurrent sur ce petit corpus.

### Q2 — Migration stratégique + technique (moyenne) ✓

- **Retrieval** : 2/5 chunks du guide migration (scores 0.724 **identiques**, = quasi-doublon), puis 3 chunks tangentiels (Windows membre 0.612, fuites données 0.609, architecture 0.602).
- **Génération** : les DEUX volets sont correctement synthétisés. Tableau stratégique + tableau technique, citations précises.
- **Statut** : démo de la synthèse multi-chunk réussie. Idéal pour Étape 5. Les chunks dupliqués passent inaperçus côté génération.

### Q3 — Mots de passe (piège) ✗✗✗ — **la démo choc**

- **Retrieval** : **aucun** chunk d'un guide dédié aux mots de passe (il n'en existe pas). Top-5 = `architecture_securisee` (0.586), `hygiene_telephones_mobiles` (0.582), `bdd_relationnelles` (0.572), `fuites_données` (0.567), `migration` (0.560). 5 guides différents, tous tangentiels.
- **Génération** : **hallucination spectaculaire**. Le modèle produit un tableau en 5 domaines :
  1. *Authentification forte* — cite BDD p1/p2 ✓ (présent dans le chunk)
  2. *Gestion des comptes privilégiés* — cite BDD p1/p2 ✓ (présent)
  3. *Qualité du mot de passe (longueur, complexité, dictionnaire, renouvellement)* — référence : **« Implicite dans les recommandations »** ⚠️ (le modèle reconnaît qu'il l'invente)
  4. *Stockage et transmission* — référence : **« Déduit du principe général »** ⚠️ (id.)
  5. *Supervision et audit* — cite BDD p1/p2 ✓ (présent)
- **Matériel pédagogique** : c'est la démo parfaite de l'hallucination RAG. Le modèle AVOUE ses inventions dans sa propre colonne « Référence ». Les participants peuvent pointer du doigt les lignes 3 et 4 sans aide du facilitateur.
- **Statut** : ancre le pont vers Module 4 (garde-fous, seuil de score, prompt « si le contexte est insuffisant, dis-le »).

### Q4 — Serveur Windows (ambiguë) ✗ — sous-optimal mais instructif

- **Retrieval** : 5/5 chunks des guides Windows. Les **3 variantes sont touchées** (membre AD DS + autonome + contrôleur de domaine), scores 0.714–0.755. Retrieval quasi-parfait côté couverture.
- **Génération** : réponse très détaillée (~60 lignes), mais **ne signale pas l'ambiguïté**. Mélange des mesures spécifiques aux serveurs membres (LAPS, domaine) avec des mesures de serveur autonome (pare-feu local) et contrôleur de domaine sans les attribuer clairement. Participant attentif peut détecter des incohérences.
- **Matériel pédagogique** : démo de la faille « réponse plausible mais contextuellement confuse ». Le retrieval fait son travail — c'est le **prompt de génération** qui manque d'instructions sur la gestion d'ambiguïté. Parfait pour introduire query rewriting / clarification question au Module 4.

### Q5 — Comptes administrateur (multi-document) ✓

- **Retrieval** : **5 guides distincts touchés** (CMS 0.568, migration 0.555, BDD 0.553, fuites données 0.531, architecture 0.523). Bonne diversité trans-document.
- **Génération** : bonne synthèse trans-document, cite correctement 3+ guides. Tableau structuré.
- **Matériel pédagogique** : démo réussie de la synthèse multi-doc. Contraste avec l'échec Q3 : quand le sujet existe dans le corpus (même éclaté), le retrieval + le LLM le trouvent. Quand le sujet est absent (Q3), le LLM invente.

## 5. Synthèse des 3+ failles observables en Étape 6

| # | Faille | Question(s) qui la révèle(nt) | Piste Module 4 |
|---|---|---|---|
| 1 | **Hallucination** sur question hors-corpus (pas de garde-fou) | Q3 | Prompt « je ne sais pas », seuil de score, classification de la requête |
| 2 | **Chunks dupliqués** saturent le top-5 (p1/p2 d'un même guide) | Q1, Q2, Q5 | MMR, dédoublonnage sémantique, reranker |
| 3 | **Pas de détection d'ambiguïté** — réponse mélange contextes | Q4 | Query rewriting, agent qui pose des clarifications |
| 4 | **Citations non vérifiées** — le modèle peut citer un chunk pour une affirmation qui n'y figure pas | Q3 (`Déduit`, `Implicite`) | Évaluation de fidélité (faithfulness) au Module 4 |
| 5 | **Pollution par headers/footers** réduit la diversité du top-k | toutes | Nettoyage au chunking, metadata filter |

L'exit criterion Étape 6 (« ≥3 failles observées avec exemples concrets ») est largement atteignable — un participant attentif en trouvera 4–5 sans effort.

## 6. Implications pour les PR de détail (Étapes 1–6)

- **PR #5 (Étape 1+Étape 2)** : revoir l'exit criterion Étape 2 (≥40 chunks, pas ≥500). Mentionner explicitement le piège « chunks quasi-dupliqués par page » et la pollution d'en-tête/pied.
- **PR #6 (Étape 3–Étape 5)** : Étape 3 stats attendues ~55 chunks / 55 vecteurs en dimension 1024. Étape 4 : utiliser Q1 et Q2 comme questions de smoke test. Étape 5 : la question canonique « mots de passe ANSSI » fonctionne MAL — à remplacer par Q1 Zero Trust pour la démo en Étape 5.
- **PR #7 (hint ladder)** : pas d'impact direct ; les hints restent du même format.
- Le **design doc** (§Étape 2 « Exit » et §Étape 5 « Exit ») a deux erreurs factuelles à corriger en douceur — mais ce n'est pas dans la portée de cette PR.
