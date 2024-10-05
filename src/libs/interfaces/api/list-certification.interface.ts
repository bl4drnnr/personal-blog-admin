export interface ListCertification {
  id: string;
  certName: string;
  certDescription: string;
  certPicture: string;
  certDocs: string;
  obtainingDate: Date;
  expirationDate: Date;
  obtainedSkills: Array<string>;
  isSelected: boolean;
  certLanguage: string;
  certCommonId: string;
  createdAt: Date;
  updatedAt: Date;
}
