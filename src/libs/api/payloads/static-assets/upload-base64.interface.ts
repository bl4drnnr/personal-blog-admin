export interface UploadBase64Payload {
  name: string;
  base64Image: string;
  description?: string;
  assetType: 'icon' | 'projectPicture' | 'articlePicture' | 'staticAsset';
}
