export interface LicenseTileData {
  id?: string;
  licensePageId?: string;
  title: string;
  description: string;
  links: Array<{
    label: string;
    url: string;
  }>;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}
