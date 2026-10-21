import {Platform} from 'react-native';
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
  type StoredAuthSession,
} from './auth-session';

const developmentHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL = `http://${developmentHost}:3000/api/v1`;

type ApiEnvelope<T> = {
  data: T;
};

type ApiErrorEnvelope = {
  error?: {
    code?: string;
    message?: string;
  };
  message?: string | string[];
};

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
  }
}

function resolveErrorMessage(body: ApiErrorEnvelope): string {
  if (body.error?.message) {
    return body.error.message;
  }
  if (Array.isArray(body.message)) {
    return body.message.join(', ');
  }
  return body.message ?? 'Не удалось выполнить запрос';
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

async function send(path: string, options: RequestInit) {
  const accessToken = getAuthSession()?.accessToken;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: options.credentials ?? 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {}),
      ...options.headers,
    },
  });
  return response;
}

async function readResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as ApiEnvelope<T> & ApiErrorEnvelope;
  if (!response.ok) {
    throw new ApiRequestError(
      resolveErrorMessage(body),
      response.status,
      body.error?.code,
    );
  }
  return body.data;
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
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Accept: 'application/json'},
    body: JSON.stringify({refreshToken: session.refreshToken}),
  });
  if (!response.ok) {
    await clearAuthSession();
    return false;
  }
  const body = (await response.json()) as ApiEnvelope<
    Omit<StoredAuthSession, 'phone'>
  >;
  await saveAuthSession({...body.data, phone: session.phone});
  return true;
}
