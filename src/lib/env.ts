/** Read a Vite env var, throwing when it is missing. */
export function requireEnv(name: string): string {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value as string;
}

export const API_URL = requireEnv('VITE_API_URL');
