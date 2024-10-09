import { CreateExperiencePositionPayload } from '@payloads/create-experience-position.interface';

export interface CreateExperienceInterface {
  companyName: string;
  companyDescription: string;
  companyLink: string;
  companyLinkTitle: string;
  companyPicture: string;
  authorId: string;
  obtainedSkills: Array<string>;
  experienceLanguage: string;
  startDate: Date;
  endDate?: Date;
  authorName?: string;
  experiencePositions?: Array<CreateExperiencePositionPayload>;
}
