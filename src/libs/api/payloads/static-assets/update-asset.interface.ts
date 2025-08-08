export interface UpdateAssetPayload {
  id: string;
  name?: string;
  description?: string;
  assetType?: 'icon' | 'projectPicture' | 'articlePicture' | 'staticAsset';
}
