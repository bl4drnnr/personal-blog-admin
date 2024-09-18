export interface ListExperience {
  id: string;
  companyName: string;
  companyDescription: string;
  companyLink: string;
  companyLinkTitle: string;
  companyPicture: string;
  startDate: Date;
  endDate: Date;
  isSelected: boolean;
  createdAt: Date;
  updatedAt: Date;
  // @TODO
  // experiencePositions
}
