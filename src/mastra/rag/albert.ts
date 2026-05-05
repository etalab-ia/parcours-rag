const DEFAULT_ALBERT_BASE_URL = "https://albert.api.etalab.gouv.fr/v1";

export function getAlbertBaseUrl(): string {
  return process.env.ALBERT_BASE_URL?.trim() || DEFAULT_ALBERT_BASE_URL;
}

export function requireAlbertApiKey(): string {
  const apiKey = process.env.ALBERT_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("ALBERT_API_KEY is missing. Configure it in .env before running RAG scripts.");
  }
  return apiKey;
}
