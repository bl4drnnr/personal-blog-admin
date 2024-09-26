import { ExperiencePositionInterface } from '@interfaces/experience-position.interface';

export interface FullExperience {
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
  experiencePositions: Array<ExperiencePositionInterface>;
}
