import { ListExperience } from '@interfaces/list-experience.interface';

export interface ListExperiencesResponse {
  count: number;
  rows: Array<ListExperience>;
}
