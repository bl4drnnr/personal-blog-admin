import { ExperiencePositionInterface } from '@interfaces/experience-position.interface';

export interface GetExperienceByIdResponse {
  id: string;
  companyName: string;
  companyDescription: string;
  companyLink: string;
  companyLinkTitle: string;
  companyPicture: string;
  startDate: Date;
  endDate: Date;
  isSelected: boolean;
  experienceLanguage: string;
  experienceCommonId: string;
  obtainedSkills: Array<string>;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  experiencePositions: Array<ExperiencePositionInterface>;
}
