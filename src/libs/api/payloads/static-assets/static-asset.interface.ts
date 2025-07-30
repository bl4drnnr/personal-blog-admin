export interface StaticAsset {
  id: string;
  name: string;
  s3Url: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
