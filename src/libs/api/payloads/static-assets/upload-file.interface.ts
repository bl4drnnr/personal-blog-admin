export interface UploadFilePayload {
  name: string;
  base64File: string;
  description?: string;
  assetType: 'icon' | 'projectPicture' | 'articlePicture' | 'staticAsset';
}
