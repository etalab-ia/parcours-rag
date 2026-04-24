#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

const manifest = JSON.parse(
  await readFile(new URL("../../corpus/anssi-essentiels/manifest.json", import.meta.url), "utf8")
);

async function downloadWithRetry(url, retries = 4) {
  let lastErr;
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      return buf.length;
    } catch (err) {
      lastErr = err;
      if (i < retries) await new Promise((r) => setTimeout(r, 300 * i));
    }
  }
  throw lastErr;
}

async function bench(label, toUrl) {
  const t0 = performance.now();
  let totalBytes = 0;

  for (const entry of manifest) {
    const start = performance.now();
    const size = await downloadWithRetry(toUrl(entry));
    const dt = (performance.now() - start) / 1000;
    totalBytes += size;
    console.log(`${label}\t${entry.filename}\t${size}\t${dt.toFixed(2)}s`);
  }

  const totalSec = (performance.now() - t0) / 1000;
  console.log(
    `${label}\tTOTAL\t${totalBytes}\t${totalSec.toFixed(2)}s\t${(
      totalBytes /
      1024 /
      1024
    ).toFixed(2)} MiB`
  );
}

console.log(`FILES\t${manifest.length}`);

await bench("ANSSI", (entry) => entry.url);
await bench("GITHUB_RAW", (entry) => {
  const encoded = encodeURIComponent(entry.filename).replace(/%2F/g, "/");
  return `https://raw.githubusercontent.com/etalab-ia/parcours-rag/main/corpus/anssi-essentiels/${encoded}`;
});

