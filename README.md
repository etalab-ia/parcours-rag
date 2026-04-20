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
- `pnpm`
- Un agent de codage (Letta Code, Claude Code, Cursor…)
- Une clé API Albert → [albert.api.etalab.gouv.fr](https://albert.api.etalab.gouv.fr)

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

## Comment suivre le workshop

Le parcours est piloté par un *skill* installé dans ce repo (`.skills/module-3-rag/`).
Demandez à votre agent de codage de lancer le workshop :

```
/module-3-rag
```

Votre agent vous guidera checkpoint par checkpoint. Le facilitateur orchestre la
discussion collective entre chaque checkpoint.

## Structure

```
parcours-rag/
├── corpus/anssi-essentiels/   Corpus pré-téléchargé (30 guides PDF)
├── src/mastra/                Code Mastra — vous travaillez ici
│   ├── agents/                Agents (chat, puis RAG)
│   ├── gateways/              Gateway Albert (chat + embeddings)
│   └── index.ts               Entrée Mastra
├── .skills/module-3-rag/      Skill qui pilote l'atelier
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
