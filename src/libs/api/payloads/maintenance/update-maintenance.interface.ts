export interface UpdateMaintenancePayload {
  isActive?: boolean;
  message?: string;
  fromDate?: string;
  toDate?: string;
  heroImageId?: string;
  heroTitle?: string;
  title?: string;
}
