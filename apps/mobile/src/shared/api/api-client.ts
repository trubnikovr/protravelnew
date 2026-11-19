import { ApiRequestError, getApiErrorMessage } from './api-errors';
export { ApiRequestError } from './api-errors';
import { Platform } from 'react-native';
import { setConnectionUnavailable } from './connection-state';
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
  type StoredAuthSession,
} from './auth-session';
import { i18n } from '../i18n';

const developmentHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL = `http://${developmentHost}:3000/api/v1`;

type ApiResponseMeta = {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ApiEnvelope<T, TMeta extends object = object> = {
  data: T;
  meta?: ApiResponseMeta & TMeta;
};

type ApiErrorEnvelope = {
  error?: {
    code?: string;
    message?: string;
  };
  message?: string | string[];
};

function responseError(body: ApiErrorEnvelope | null, status: number) {
  const error = new ApiRequestError('', status, body?.error?.code);
  error.message = getApiErrorMessage(error);
  return error;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await send(path, options);
  if (response.status !== 401 || !getAuthSession()) {
    return readResponse<T>(response);
  }
  const refreshed = await refreshSession();
  if (!refreshed) return readResponse<T>(response);
  return readResponse<T>(await send(path, options));
}

export async function apiRequestWithMeta<T, TMeta extends object = object>(
  path: string,
  options: RequestInit = {},
): Promise<ApiEnvelope<T, TMeta>> {
  const response = await send(path, options);
  if (response.status !== 401 || !getAuthSession()) {
    return readEnvelope<T, TMeta>(response);
  }
  const refreshed = await refreshSession();
  if (!refreshed) return readEnvelope<T, TMeta>(response);
  return readEnvelope<T, TMeta>(await send(path, options));
}

// Search providers can take longer than ordinary data requests.
const REQUEST_TIMEOUT_MS = 60_000;

async function connectionFetch(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (options.signal?.aborted) controller.abort();
  options.signal?.addEventListener('abort', abort);
  const timeout = setTimeout(abort, REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    setConnectionUnavailable(response.status >= 500 && response.status < 600);
    return response;
  } catch (error) {
    if (options.signal?.aborted || error instanceof ApiRequestError) throw error;
    setConnectionUnavailable(false);
    throw new ApiRequestError(i18n.t('common.connectionUnavailable'), 0, 'CONNECTION_UNAVAILABLE');
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abort);
  }
}

async function send(path: string, options: RequestInit) {
  const accessToken = getAuthSession()?.accessToken;
  const response = await connectionFetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: options.credentials ?? 'include',
    headers: {
      Accept: 'application/json',
      'Accept-Language': i18n.resolvedLanguage ?? i18n.language ?? 'ru',
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });
  return response;
}

async function readResponse<T>(response: Response): Promise<T> {
  return (await readEnvelope<T>(response)).data;
}

async function readEnvelope<T, TMeta extends object = object>(
  response: Response,
): Promise<ApiEnvelope<T, TMeta>> {
  const body = await response.json().catch(() => null) as
    (ApiEnvelope<T, TMeta> & ApiErrorEnvelope) | null;
  if (!response.ok) throw responseError(body, response.status);
  if (!body || typeof body !== 'object' || !('data' in body)) {
    throw responseError(null, response.status);
  }
  return body;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  refreshPromise ??= performRefresh().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

async function performRefresh(): Promise<boolean> {
  const session = getAuthSession();
  if (!session) return false;
  const response = await connectionFetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ refreshToken: session.refreshToken }),
  });
  if (!response.ok) {
    if (response.status !== 401 && response.status !== 403) {
      throw responseError(await response.json().catch(() => null), response.status);
    }
    await clearAuthSession();
    return false;
  }
  const body = (await response.json()) as ApiEnvelope<
    Omit<StoredAuthSession, 'phone'>
  >;
  await saveAuthSession({ ...body.data, phone: session.phone });
  return true;
}
