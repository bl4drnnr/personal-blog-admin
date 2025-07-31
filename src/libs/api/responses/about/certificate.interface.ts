export interface CertificateResponse {
  id: string;
  title: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
