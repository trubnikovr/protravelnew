import { Configuration, ResponseError } from "./generated/v1/runtime";

const API_URL = (
  window.__PROTRAVEL_CONFIG__?.apiUrl ??
  import.meta.env.VITE_API_URL ??
  "http://localhost:3000"
).replace(/\/$/, "");

export interface ApiEnvelope<T> {
  data: T;
  meta: Record<string, unknown>;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function createApiConfiguration(
  getAccessToken?: () => string | null
): Configuration {
  return new Configuration({
    basePath: API_URL,
    accessToken: getAccessToken
      ? async () => getAccessToken() ?? ""
      : undefined,
  });
}

export async function normalizeApiError(error: unknown): Promise<ApiError> {
  if (error instanceof ResponseError) {
    const body = (await error.response
      .clone()
      .json()
      .catch(() => null)) as {
      error?: { code?: string; message?: string; details?: unknown };
    } | null;
    throw new ApiError(
      error.response.status,
      body?.error?.code ?? "HTTP_ERROR",
      body?.error?.message ?? "Не удалось выполнить запрос",
      body?.error?.details
    );
  }
  if (error instanceof ApiError) throw error;
  throw new ApiError(
    0,
    "NETWORK_ERROR",
    "Не удалось подключиться к API",
    error
  );
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  token?: string | null
): Promise<T> {
  return (await apiEnvelopeRequest<T>(path, init, token)).data;
}

export async function apiEnvelopeRequest<T>(
  path: string,
  init: RequestInit = {},
  token?: string | null
): Promise<ApiEnvelope<T>> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: { code?: string; message?: string; details?: unknown };
    } | null;
    throw new ApiError(
      response.status,
      body?.error?.code ?? "HTTP_ERROR",
      body?.error?.message ?? "Не удалось выполнить запрос",
      body?.error?.details
    );
  }
  if (response.status === 204) {
    return { data: undefined as T, meta: {} };
  }
  return (await response.json()) as ApiEnvelope<T>;
}
