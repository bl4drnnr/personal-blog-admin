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
  createdAt: Date;
  updatedAt: Date;
}
