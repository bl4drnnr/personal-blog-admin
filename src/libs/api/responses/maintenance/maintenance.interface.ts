export interface MaintenanceResponse {
  isActive: boolean;
  message: string;
  fromDate?: Date;
  toDate?: Date;
  heroImageId: string;
  heroTitle: string;
  title: string;
  metaTitle: string;
  isPermanent: boolean;
}
