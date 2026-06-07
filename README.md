# Parcours RAG — Atelier ALLiaNCE

Starter du bootcamp RAG de l'ALLiaNCE (DINUM). Construit un RAG local en 3h sur le
corpus des guides ANSSI « Les Essentiels », piloté par votre agent de codage.

## Public

**Module 3** : profils techniques, en présentiel, 20 places.

## Stack

- **Mastra** (TypeScript) — framework agents + RAG
- **LibSQL** — store vectoriel intégré (pas de Docker requis)
- **Albert API** (DINUM, souverain) — chat (`openweight-large`) + embeddings (`openweight-embeddings`, bge-m3 1024d)

## Prérequis

- Node 20+
- Un agent de codage (Claude Code, Cursor…)
- Une clé API Albert → [albert.api.etalab.gouv.fr](https://albert.api.etalab.gouv.fr)

## Installation via skills.sh (sans clone manuel)

Mode recommandé pour les participants : installer les skills puis laisser l'agent
bootstrapper le workspace atelier (Mastra + corpus) automatiquement.

Installer depuis le dossier `skills/` du repo pour récupérer tous les skills Parcours RAG
(Module 3 aujourd'hui, Module 4 ensuite) en une seule commande :

```bash
npx skills add https://github.com/etalab-ia/parcours-rag/tree/main/skills
```

Le skill du Module 3 est exposé sous le nom `parcours-rag/module3`.

Ensuite, dans votre agent :

```text
/parcours-rag/module3
```

Selon l'agent, il peut aussi apparaître sous la forme `/parcours-rag-module3`.

Le skill lance d'abord un bootstrap workspace basé sur `npm create mastra@latest`
puis déroule les checkpoints CP1 → CP6. Si le skill `mastra` n'est pas installé,
il l'installe automatiquement au début du bootstrap.

### Smoke tests (clean-room)

```bash
# End-to-end bootstrap smoke test (npm-only)
scripts/smoke/module3-bootstrap-smoke.sh --corpus-source anssi

# Compare corpus download time by source
node scripts/smoke/benchmark-corpus-sources.mjs
```

### Backlog (post-MVP)

- 📦 Packaging optimisation: publish `anssi-essentiels.zip` as a versioned GitHub Release asset,
  then let bootstrap download/extract a single archive (fallback to per-file download if unavailable).

## Démarrage local (mode repo)

Si vous travaillez directement dans ce repo, utilisez le flux historique ci-dessous.

## Démarrage (checkpoint 1)

```bash
pnpm install
cp .env.example .env
# éditer .env et renseigner ALBERT_API_KEY
pnpm dev
```

Ouvrir [http://localhost:4111](http://localhost:4111) — Mastra Studio doit afficher
l'agent `chat-agent`. Posez-lui une question pour vérifier que la connexion à
Albert fonctionne.


## Scan des vulnérabilités de dépendances

Le projet utilise OWASP CVE Lite CLI pour scanner le lockfile JavaScript/TypeScript avant de partager du code :

```bash
pnpm security:scan:js
```

Le hook Husky `pre-push` exécute ce scan avec un seuil `--fail-on high`. Les vulnérabilités faibles restent visibles pour la revue, mais seules les vulnérabilités de sévérité haute ou critique bloquent le push.

## Comment suivre le workshop

Le parcours est piloté par le *skill* `parcours-rag/module3` (installé via skills.sh
ou présent dans ce repo sous `skills/parcours-rag-module3/`).
Demandez à votre agent de codage de lancer le workshop :

```
/parcours-rag/module3
```

Si votre agent ne propose pas ce nom exact, essayez aussi :

```
/parcours-rag-module3
```

Votre agent vous guidera checkpoint par checkpoint. Le facilitateur orchestre la
discussion collective entre chaque checkpoint.

## Structure

```
parcours-rag/
├── corpus/anssi-essentiels/   Corpus pré-téléchargé (15 guides ANSSI, 17 PDFs)
├── src/mastra/                Code Mastra — vous travaillez ici
│   ├── agents/                Agents (chat, puis RAG)
│   ├── gateways/              Gateway Albert (chat + embeddings)
│   └── index.ts               Entrée Mastra
├── skills/parcours-rag-module3/ Skill qui pilote l'atelier
├── design/                    Document de conception (lecture utile pour les formateurs)
└── README.md
```

## Feuille de route Module 3

| # | Checkpoint | Durée |
|---|---|---|
| 1 | Setup + chat baseline | 20 min |
| 2 | Ingestion & chunking | 30 min |
| 3 | Embeddings & index vectoriel | 25 min |
| 4 | Retrieval | 25 min |
| 5 | Génération avec citations | 30 min |
| 6 | Éval + analyse de failles | 20 min |

## Licence

MIT — voir [LICENSE](LICENSE).
