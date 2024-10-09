import { CreatedExperiencesInterface } from '@interfaces/created-experiences.interface';

export interface ExperienceCreatedResponse {
  createdExperiences: Array<CreatedExperiencesInterface>;
  message: string;
}
