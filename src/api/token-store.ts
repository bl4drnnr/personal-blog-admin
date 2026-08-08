/**
 * The access token lives in memory only — never localStorage — so it cannot be
 * read by injected scripts. The refresh token is an HttpOnly cookie the browser
 * sends automatically; a page reload re-derives the access token from it.
 */
let accessToken: string | null = null;
const listeners = new Set<(token: string | null) => void>();

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
  for (const listener of listeners) {
    listener(token);
  }
}

export function onAccessTokenChange(listener: (token: string | null) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
