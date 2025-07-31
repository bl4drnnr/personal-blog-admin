import { PositionData } from './position-data.interface';

export interface ExperienceData {
  id?: string;
  title?: string;
  description?: string;
  companyName?: string;
  order?: number;
  positions?: PositionData[];
}
