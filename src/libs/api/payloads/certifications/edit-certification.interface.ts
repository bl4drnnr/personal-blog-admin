export interface EditCertificationPayload {
  certificationId: string;
  certName?: string;
  certDescription?: string;
  certPicture?: string;
  certDocs?: string;
  obtainingDate?: Date;
  expirationDate?: Date;
  obtainedSkills?: Array<string>;
}
