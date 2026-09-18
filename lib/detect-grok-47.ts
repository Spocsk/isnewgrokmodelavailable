export type StatusSource = "xai" | "docs";

export type GrokStatus = {
  available: boolean | null;
  checkedAt: string;
  source: StatusSource | null;
  modelId: string | null;
  error: string | null;
};

type ModelRecord = {
  id: string;
  aliases?: string[];
};

const XAI_MODEL_URL = "https://api.x.ai/v1/models/grok-4.7";
const XAI_MODELS_URL = "https://api.x.ai/v1/models";
const DOCS_URL = "https://docs.x.ai/developers/models/grok-4.7";
const TIMEOUT_MS = 2000;

const GROK_47_ID = /^(grok-4\.7|grok-4-7)([.-]|$)/i;

function isGrok47Id(id: string): boolean {
  return GROK_47_ID.test(id);
}

function recordMatches(model: ModelRecord): boolean {
  if (isGrok47Id(model.id)) {
    return true;
  }
  return (model.aliases ?? []).some(isGrok47Id);
}

function asModelRecord(value: unknown): ModelRecord | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  if (!("id" in value) || typeof value.id !== "string") {
    return null;
  }
  const aliases =
    "aliases" in value && Array.isArray(value.aliases)
      ? value.aliases.filter((alias): alias is string => typeof alias === "string")
      : undefined;
  return { id: value.id, aliases };
}

function modelsFromListPayload(payload: unknown): ModelRecord[] {
  if (typeof payload !== "object" || payload === null) {
    return [];
  }
  const lists: unknown[] = [];
  if ("data" in payload && Array.isArray(payload.data)) {
    lists.push(...payload.data);
  }
  if ("models" in payload && Array.isArray(payload.models)) {
    lists.push(...payload.models);
  }
  return lists
    .map(asModelRecord)
    .filter((model): model is ModelRecord => model !== null);
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
): Promise<Response> {
  return fetch(url, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

function status(partial: Omit<GrokStatus, "checkedAt">): GrokStatus {
  return {
    ...partial,
    checkedAt: new Date().toISOString(),
  };
}

async function detectFromXai(apiKey: string): Promise<GrokStatus> {
  const headers = { Authorization: `Bearer ${apiKey}` };

  const byId = await fetchWithTimeout(XAI_MODEL_URL, { headers });

  if (byId.ok) {
    const payload: unknown = await byId.json();
    const model = asModelRecord(payload);
    return status({
      available: true,
      source: "xai",
      modelId: model?.id ?? "grok-4.7",
      error: null,
    });
  }

  if (byId.status === 404) {
    const listResponse = await fetchWithTimeout(XAI_MODELS_URL, { headers });
    if (!listResponse.ok) {
      throw new Error("xAI model list unreachable");
    }
    const payload: unknown = await listResponse.json();
    const hit = modelsFromListPayload(payload).find(recordMatches);
    return status({
      available: Boolean(hit),
      source: "xai",
      modelId: hit?.id ?? null,
      error: null,
    });
  }

  if (byId.status === 401 || byId.status === 403) {
    throw new Error("xAI API key rejected");
  }

  throw new Error(`xAI catalogue: HTTP ${byId.status}`);
}

async function detectFromDocs(): Promise<GrokStatus> {
  const response = await fetchWithTimeout(DOCS_URL, {
    method: "GET",
    redirect: "manual",
    headers: { "User-Agent": "grok-47-status/1.0" },
  });

  const redirectedAway =
    response.status >= 300 &&
    response.status < 400 &&
    !response.headers.get("location")?.includes("grok-4.7");

  if (response.status === 404 || redirectedAway) {
    return status({
      available: false,
      source: "docs",
      modelId: null,
      error: null,
    });
  }

  if (response.status === 200) {
    const landedOnModelPage =
      response.url.includes("/models/grok-4.7") ||
      response.url.endsWith("/grok-4.7");
    return status({
      available: landedOnModelPage,
      source: "docs",
      modelId: landedOnModelPage ? "grok-4.7" : null,
      error: null,
    });
  }

  throw new Error(`xAI docs: HTTP ${response.status}`);
}

export async function detectGrok47(): Promise<GrokStatus> {
  const apiKey = process.env.XAI_API_KEY?.trim();

  try {
    if (apiKey) {
      return await detectFromXai(apiKey);
    }
    return await detectFromDocs();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Catalogue unreachable";
    return status({
      available: null,
      source: apiKey ? "xai" : "docs",
      modelId: null,
      error: message,
    });
  }
}
