export enum StaticAssetsEndpoint {
  GET_ASSETS = 'admin/assets',
  GET_ASSET_BY_ID = 'admin/assets/:id',
  CREATE_ASSET = 'admin/assets/create',
  UPDATE_ASSET = 'admin/assets/:id/update',
  DELETE_ASSET = 'admin/assets/delete',
  UPLOAD_FILE = 'admin/assets/upload-file',
  UPLOAD_BASE64 = 'admin/assets/upload-base64',
  UPDATE_FILE = 'admin/assets/:id/update-file'
}
