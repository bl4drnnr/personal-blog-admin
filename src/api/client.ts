import { API_URL } from '@/lib/env';
import { getAccessToken, setAccessToken } from './token-store';

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`API responded ${status}`);
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  /** multipart uploads: pass FormData as body and set this */
  formData?: FormData;
  /** internal: prevents infinite refresh recursion */
  _retried?: boolean;
}

async function rawRequest(path: string, options: RequestOptions): Promise<Response> {
  const headers: Record<string, string> = {};
  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let body: BodyInit | undefined;
  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }

  return fetch(`${API_URL}/api${path}`, {
    method: options.method ?? 'GET',
    headers,
    body,
    credentials: 'include', // send the refresh cookie on /auth/* calls
  });
}

/** Attempts a token refresh via the HttpOnly cookie. Returns true on success. */
async function tryRefresh(): Promise<boolean> {
  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    setAccessToken(null);
    return false;
  }
  const data = (await res.json()) as { accessToken: string };
  setAccessToken(data.accessToken);
  return true;
}

/**
 * Authenticated JSON request. On a 401 it refreshes the access token once and
 * retries; a second failure clears the session and throws.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let res = await rawRequest(path, options);

  if (res.status === 401 && !options._retried) {
    if (await tryRefresh()) {
      res = await rawRequest(path, { ...options, _retried: true });
    }
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    throw new ApiError(res.status, payload);
  }
  return payload as T;
}

/** Unauthenticated request for the login flow (no refresh-retry). */
export async function authRequest<T>(path: string, body: unknown, tempToken?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (tempToken) {
    headers.Authorization = `Bearer ${tempToken}`;
  }
  const res = await fetch(`${API_URL}/api${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    credentials: 'include',
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    throw new ApiError(res.status, payload);
  }
  return payload as T;
}

export async function authGet<T>(path: string, tempToken: string): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: { Authorization: `Bearer ${tempToken}` },
    credentials: 'include',
  });
  if (!res.ok) {
    throw new ApiError(res.status, await res.text());
  }
  return res.json() as Promise<T>;
}

export { tryRefresh };
