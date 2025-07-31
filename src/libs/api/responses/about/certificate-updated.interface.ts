import { CertificateResponse } from './certificate.interface';

export interface CertificateUpdatedResponse {
  message: string;
  certificate: CertificateResponse;
}
