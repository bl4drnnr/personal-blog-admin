import { PositionData } from './position-data.interface';

export interface ExperienceData {
  id?: string;
  companyName: string;
  logoId?: string; // For editing forms
  companyLogo?: string; // For display (S3 URL)
  companyWebsite?: string;
  order?: number;
  positions?: PositionData[];
  createdAt?: Date;
  updatedAt?: Date;
}
