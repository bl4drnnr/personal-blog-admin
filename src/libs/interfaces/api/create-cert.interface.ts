export interface CreateCertInterface {
  certName: string;
  certDescription: string;
  certPicture: string;
  certDocs: string;
  obtainingDate: Date;
  expirationDate: Date;
  obtainedSkills: Array<string>;
  certLanguage: string;
  authorId: string;
  authorName?: string;
}
