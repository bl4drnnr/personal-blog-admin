export interface CertificateData {
  id?: string;
  name: string;
  issuedDate: string;
  expirationDate?: string;
  logoId?: string; // For editing forms
  logo?: string; // For display (S3 URL)
  description?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
