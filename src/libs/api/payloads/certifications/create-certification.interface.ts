export interface CreateCertificationPayload {
  certName: string;
  certDescription: string;
  certPicture: string;
  certDocs: FormData;
  obtainingDate: Date;
  expirationDate: Date;
  obtainedSkills: Array<string>;
  authorId: string;
}
