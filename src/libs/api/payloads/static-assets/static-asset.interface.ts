export interface StaticAsset {
  id: string;
  name: string;
  s3Url: string;
  description?: string;
  assetType: 'icon' | 'projectPicture' | 'articlePicture' | 'staticAsset';
  createdAt: Date;
  updatedAt: Date;
}
