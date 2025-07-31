import { CertificateResponse } from './certificate.interface';

export interface CertificateCreatedResponse {
  message: string;
  certificate: CertificateResponse;
}
