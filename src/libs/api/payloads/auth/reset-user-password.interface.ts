export interface ResetUserPasswordPayload {
  password: string;
  hash: string;
  mfaCode: string;
  language?: string;
}
