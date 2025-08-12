export interface UpdateMaintenancePayload {
  isActive?: boolean;
  message?: string;
  fromDate?: string;
  toDate?: string;
  heroImageId?: string;
  heroTitle?: string;
  footerText?: string;
  title?: string;
}
