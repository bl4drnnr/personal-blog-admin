import { authGet, authRequest } from './client';
import { setAccessToken } from './token-store';

export interface LoginResponse {
  mfaRequired?: boolean;
  mfaSetupRequired?: boolean;
  tempToken: string;
}

interface TokenResponse {
  accessToken: string;
}

export interface MfaEnrollment {
  otpauthUrl: string;
  qrDataUrl: string;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return authRequest<LoginResponse>('/auth/login', { email, password });
}

export function getMfaEnrollment(tempToken: string): Promise<MfaEnrollment> {
  return authGet<MfaEnrollment>('/auth/mfa/setup', tempToken);
}

export async function enableMfa(tempToken: string, code: string): Promise<void> {
  const { accessToken } = await authRequest<TokenResponse>('/auth/mfa/enable', { code }, tempToken);
  setAccessToken(accessToken);
}

export async function verifyMfa(tempToken: string, code: string): Promise<void> {
  const { accessToken } = await authRequest<TokenResponse>('/auth/mfa/verify', { code }, tempToken);
  setAccessToken(accessToken);
}
