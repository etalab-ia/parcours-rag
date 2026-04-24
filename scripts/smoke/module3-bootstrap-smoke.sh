#!/usr/bin/env bash
set -euo pipefail

# Clean-room smoke test for Module 3 bootstrap flow (npm-only).
#
# Usage:
#   scripts/smoke/module3-bootstrap-smoke.sh [--corpus-source anssi|github] [--workdir <dir>] [--keep]

CORPUS_SOURCE="anssi"
WORKDIR=""
KEEP_WORKDIR="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --corpus-source)
      CORPUS_SOURCE="$2"
      shift 2
      ;;
    --workdir)
      WORKDIR="$2"
      shift 2
      ;;
    --keep)
      KEEP_WORKDIR="true"
      shift
      ;;
    *)
      echo "Unknown arg: $1" >&2
      exit 1
      ;;
  esac
done

if [[ "$CORPUS_SOURCE" != "anssi" && "$CORPUS_SOURCE" != "github" ]]; then
  echo "--corpus-source must be one of: anssi, github" >&2
  exit 1
fi

ROOT_START=$(date +%s)

if [[ -z "$WORKDIR" ]]; then
  WORKDIR=$(mktemp -d /tmp/parcours-rag-smoke.XXXXXX)
else
  mkdir -p "$WORKDIR"
fi

PROJECT_DIR="$WORKDIR/module3-smoke-$(date +%s)"
mkdir -p "$WORKDIR"

if [[ "$KEEP_WORKDIR" != "true" ]]; then
  trap 'rm -rf "$WORKDIR"' EXIT
fi

log_step() {
  printf "\n==> %s\n" "$1"
}

measure() {
  local label="$1"
  shift
  local t0 t1
  t0=$(date +%s)
  "$@"
  t1=$(date +%s)
  printf "    [%s] %ss\n" "$label" "$((t1 - t0))"
}

log_step "Create Mastra project (npm create mastra@latest --default --no-example)"
measure "create" npm create mastra@latest -- --project-name "$PROJECT_DIR" --default --no-example

cd "$PROJECT_DIR"

log_step "Install workshop dependencies"
measure "deps" npm install @ai-sdk/openai-compatible @ai-sdk/provider @mastra/libsql @mastra/rag unpdf zod dotenv
measure "dev-deps" npm install -D tsx

log_step "Prepare workshop filesystem"
mkdir -p src/mastra/agents src/mastra/gateways src/mastra/rag corpus/anssi-essentiels data

log_step "Fetch starter files from GitHub"
measure "fetch-starter" bash -lc '
  curl -fsSL https://raw.githubusercontent.com/etalab-ia/parcours-rag/main/.env.example -o .env.example
  curl -fsSL https://raw.githubusercontent.com/etalab-ia/parcours-rag/main/src/mastra/index.ts -o src/mastra/index.ts
  curl -fsSL https://raw.githubusercontent.com/etalab-ia/parcours-rag/main/src/mastra/agents/chat-agent.ts -o src/mastra/agents/chat-agent.ts
  curl -fsSL https://raw.githubusercontent.com/etalab-ia/parcours-rag/main/src/mastra/gateways/albert.ts -o src/mastra/gateways/albert.ts
  curl -fsSL https://raw.githubusercontent.com/etalab-ia/parcours-rag/main/corpus/anssi-essentiels/manifest.json -o corpus/anssi-essentiels/manifest.json
'

log_step "Download ANSSI corpus PDFs ($CORPUS_SOURCE)"
measure "corpus" node --input-type=module -e '
  import { mkdir, readFile, writeFile } from "node:fs/promises";
  import path from "node:path";

  const source = process.env.CORPUS_SOURCE;
  const manifestPath = "corpus/anssi-essentiels/manifest.json";
  const outDir = "corpus/anssi-essentiels";

  await mkdir(outDir, { recursive: true });
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  function toUrl(entry) {
    if (source === "github") {
      const encoded = encodeURIComponent(entry.filename).replace(/%2F/g, "/");
      return `https://raw.githubusercontent.com/etalab-ia/parcours-rag/main/corpus/anssi-essentiels/${encoded}`;
    }
    return entry.url;
  }

  for (const entry of manifest) {
    const out = path.join(outDir, entry.filename);
    const url = toUrl(entry);
    let ok = false;
    let lastErr;

    for (let i = 1; i <= 4; i++) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        await writeFile(out, buf);
        ok = true;
        break;
      } catch (err) {
        lastErr = err;
        await new Promise((r) => setTimeout(r, 300 * i));
      }
    }

    if (!ok) {
      throw new Error(`Failed ${entry.filename}: ${String(lastErr)}`);
    }
  }
'

log_step "Run validations"
test -f src/mastra/index.ts
test -f src/mastra/agents/chat-agent.ts
test -f src/mastra/gateways/albert.ts
test -f corpus/anssi-essentiels/manifest.json
test "$(find corpus/anssi-essentiels -name '*.pdf' | wc -l | tr -d ' ')" -ge 17

if lsof -iTCP:4111 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "    [warn] Port 4111 already in use; skipping dev endpoint smoke check."
else
  log_step "Smoke-check Mastra endpoint"
  cp .env.example .env
  ALBERT_API_KEY="test-key" npm run dev >/tmp/parcours-rag-smoke-dev.log 2>&1 &
  DEV_PID=$!
  trap 'kill "$DEV_PID" >/dev/null 2>&1 || true' EXIT

  ok="false"
  for _ in $(seq 1 45); do
    if curl -sf http://localhost:4111/api/agents | grep -q 'chat-agent'; then
      ok="true"
      break
    fi
    sleep 1
  done

  kill "$DEV_PID" >/dev/null 2>&1 || true
  wait "$DEV_PID" 2>/dev/null || true

  if [[ "$ok" != "true" ]]; then
    echo "Mastra endpoint check failed. See /tmp/parcours-rag-smoke-dev.log" >&2
    exit 1
  fi
fi

ROOT_END=$(date +%s)
echo
echo "✅ Smoke test passed"
echo "Workspace: $PROJECT_DIR"
echo "Corpus source: $CORPUS_SOURCE"
echo "Total elapsed: $((ROOT_END - ROOT_START))s"

