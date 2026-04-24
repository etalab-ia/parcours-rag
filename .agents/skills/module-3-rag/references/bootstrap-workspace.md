# Bootstrap workspace (sans clone manuel)

## Objectif

Préparer un workspace Module 3 **sans demander au participant de cloner le repo**.

Cette procédure est le point d'entrée quand le dossier courant ne contient pas encore
la structure attendue (`src/mastra/index.ts`, `corpus/anssi-essentiels/manifest.json`, etc.).

## Pré-requis minimaux

- Node 20+
- npm 10+
- Accès réseau sortant (GitHub raw + messervices.cyber.gouv.fr)

## Politique package manager (importante)

Dans ce bootstrap standalone, utiliser **npm/npx uniquement**.

- ✅ autorisé : `npm create`, `npm install`, `npm run`, `npx`
- ❌ interdit : `pnpm`, `pnpx`

Raison : réduire les frictions d'installation sur des postes atelier où pnpm n'est pas préinstallé.

## Procédure standard

1. **Créer le projet Mastra via npm** (quickstart officiel)

```bash
npm create mastra@latest
```

> Le CLI est interactif. Si l'agent ne peut pas piloter l'interactif, utiliser la
> procédure "fallback non-interactive" plus bas.

2. **Se placer dans le dossier généré**, puis installer les dépendances atelier

```bash
npm install @ai-sdk/openai-compatible @ai-sdk/provider @mastra/libsql @mastra/rag unpdf zod dotenv
npm install -D tsx
```

3. **Créer la structure atelier**

```bash
mkdir -p src/mastra/agents src/mastra/gateways src/mastra/rag corpus/anssi-essentiels data
```

4. **Récupérer les fichiers de base Module 3** (sans clone complet)

```bash
curl -fsSL https://raw.githubusercontent.com/etalab-ia/parcours-rag/main/.env.example -o .env.example
curl -fsSL https://raw.githubusercontent.com/etalab-ia/parcours-rag/main/src/mastra/index.ts -o src/mastra/index.ts
curl -fsSL https://raw.githubusercontent.com/etalab-ia/parcours-rag/main/src/mastra/agents/chat-agent.ts -o src/mastra/agents/chat-agent.ts
curl -fsSL https://raw.githubusercontent.com/etalab-ia/parcours-rag/main/src/mastra/gateways/albert.ts -o src/mastra/gateways/albert.ts
curl -fsSL https://raw.githubusercontent.com/etalab-ia/parcours-rag/main/corpus/anssi-essentiels/manifest.json -o corpus/anssi-essentiels/manifest.json
```

5. **Télécharger automatiquement les 17 PDFs du corpus**

Par défaut, les PDFs sont pris sur le site ANSSI (`manifest.url`).

- Source ANSSI (défaut) : `PARCOURS_RAG_CORPUS_SOURCE=anssi`
- Source GitHub raw : `PARCOURS_RAG_CORPUS_SOURCE=github`

```bash
export PARCOURS_RAG_CORPUS_SOURCE=anssi
```

```bash
node --input-type=module -e '
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const manifestPath = "corpus/anssi-essentiels/manifest.json";
const outDir = "corpus/anssi-essentiels";
const source = process.env.PARCOURS_RAG_CORPUS_SOURCE ?? "anssi";

function toUrl(entry) {
  if (source === "github") {
    const encoded = encodeURIComponent(entry.filename).replace(/%2F/g, "/");
    return `https://raw.githubusercontent.com/etalab-ia/parcours-rag/main/corpus/anssi-essentiels/${encoded}`;
  }
  return entry.url;
}

await mkdir(outDir, { recursive: true });
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

for (const entry of manifest) {
  const out = path.join(outDir, entry.filename);
  const res = await fetch(toUrl(entry));
  if (!res.ok) {
    throw new Error(`Download failed for ${entry.filename}: ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(out, buf);
  console.log(`downloaded: ${entry.filename} (${buf.length} bytes)`);
}
'
```

6. **Créer `.env` puis lancer Mastra**

```bash
cp .env.example .env
# éditer .env et renseigner ALBERT_API_KEY
npm run dev
```

## Vérifications minimales bootstrap

```bash
test -f src/mastra/index.ts
test -f src/mastra/agents/chat-agent.ts
test -f src/mastra/gateways/albert.ts
test -f corpus/anssi-essentiels/manifest.json
test "$(find corpus/anssi-essentiels -name '*.pdf' | wc -l | tr -d ' ')" -ge 17
curl -sf http://localhost:4111/api/agents | grep -q 'chat-agent'
```

## Fallback non-interactive (si `npm create mastra@latest` est bloqué)

Utiliser la procédure manuelle du skill `mastra` (`references/create-mastra.md`, section
"Automatic setup / manual installation"), puis reprendre à partir de l'étape 2 ci-dessus.

## Note packaging

Si le temps de téléchargement devient un sujet en atelier, publier un bundle
`anssi-essentiels.zip` versionné dans les Releases GitHub du workshop est une bonne
option : 1 requête HTTP au lieu de 17 et meilleure résilience si la source ANSSI est
momentanément indisponible.
