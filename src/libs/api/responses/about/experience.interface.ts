export interface ExperienceResponse {
  id: string;
  title: string;
  description: string;
  companyName: string;
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
