import { access } from "node:fs/promises";
import { resolve } from "node:path";
import "./load-env";
import { chunksPath, indexDbPath, projectRoot } from "./paths";

type CheckLevel = "ok" | "warn" | "fail";

interface CheckResult {
  label: string;
  level: CheckLevel;
  detail: string;
  fix?: string;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function printResult(result: CheckResult): void {
  const icon = result.level === "ok" ? "✅" : result.level === "warn" ? "⚠️" : "❌";
  console.log(`${icon} ${result.label}: ${result.detail}`);
  if (result.fix) {
    console.log(`   ↳ Fix: ${result.fix}`);
  }
}

async function run(): Promise<void> {
  const envPath = resolve(projectRoot, ".env");

  const checks: CheckResult[] = [];

  checks.push({
    label: "Working directory",
    level: "ok",
    detail: process.cwd(),
  });

  checks.push({
    label: "Project root",
    level: "ok",
    detail: projectRoot,
  });

  const envExists = await fileExists(envPath);
  checks.push({
    label: ".env",
    level: envExists ? "ok" : "fail",
    detail: envExists ? `found at ${envPath}` : "missing",
    fix: envExists ? undefined : "cp .env.example .env && renseigner ALBERT_API_KEY",
  });

  const apiKey = process.env.ALBERT_API_KEY?.trim();
  checks.push({
    label: "ALBERT_API_KEY",
    level: apiKey ? "ok" : "fail",
    detail: apiKey ? "configured" : "missing or empty",
    fix: apiKey ? undefined : "éditer .env et ajouter une clé API Albert valide",
  });

  const chunksExists = await fileExists(chunksPath);
  checks.push({
    label: "Chunks file",
    level: chunksExists ? "ok" : "warn",
    detail: chunksExists ? `found at ${chunksPath}` : "data/chunks.json not found",
    fix: chunksExists ? undefined : "npm run rag:build-chunks",
  });

  const dbExists = await fileExists(indexDbPath);
  checks.push({
    label: "Vector index DB",
    level: dbExists ? "ok" : "warn",
    detail: dbExists ? `found at ${indexDbPath}` : "data/index.db not found",
    fix: dbExists ? undefined : "npm run rag:build-index",
  });

  checks.forEach(printResult);

  const hasFailure = checks.some((c) => c.level === "fail");
  if (hasFailure) {
    process.exitCode = 1;
  }
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`❌ rag:doctor crashed: ${message}`);
  process.exit(1);
});
