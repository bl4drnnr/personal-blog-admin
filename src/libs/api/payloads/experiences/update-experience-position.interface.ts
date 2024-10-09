export interface UpdateExperiencePositionPayload {
  experiencePositionId: string;
  positionTitle?: string;
  positionDescription?: string;
  positionStartDate?: Date;
  positionEndDate?: Date;
}
