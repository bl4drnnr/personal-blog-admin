export interface ExperienceResponse {
  id: string;
  companyName: string;
  logoId: string; // For editing forms
  companyLogo: string; // For display (S3 URL)
  companyWebsite?: string;
  order: number;
  positions?: PositionResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PositionResponse {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  order: number;
  experienceId: string;
  createdAt: Date;
  updatedAt: Date;
}
