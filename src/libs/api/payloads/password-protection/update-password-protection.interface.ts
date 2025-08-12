export interface UpdatePasswordProtectionPayload {
  isActive?: boolean;
  password?: string;
  durationHours?: number;
  heroImageId?: string;
  heroTitle?: string;
  footerText?: string;
}
