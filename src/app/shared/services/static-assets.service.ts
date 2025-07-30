import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { StaticAssetsEndpoint } from '@interfaces/static-assets.enum';
import { UploadFilePayload } from '@payloads/upload-file.interface';
import { UploadBase64Payload } from '@payloads/upload-base64.interface';
import { StaticAsset } from '@payloads/static-asset.interface';
import { StaticAssetDeletedResponse } from '@responses/static-asset-deleted.interface';
import { PaginatedStaticAssetsResponse } from '@responses/paginated-static-assets.interface';
import { SearchAssetsQuery } from '@payloads/search-assets.interface';

@Injectable({
  providedIn: 'root'
})
export class StaticAssetsService {
  constructor(private readonly apiService: ApiService) {}

  getStaticAssets(
    params: SearchAssetsQuery
  ): Observable<PaginatedStaticAssetsResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.STATIC_ASSETS,
      action: StaticAssetsEndpoint.GET_ASSETS,
      params
    });
  }

  deleteStaticAsset(id: string): Observable<StaticAssetDeletedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.STATIC_ASSETS,
      action: StaticAssetsEndpoint.DELETE_ASSET,
      params: { id }
    });
  }

  uploadFile(payload: UploadFilePayload): Observable<StaticAsset> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.STATIC_ASSETS,
      action: StaticAssetsEndpoint.UPLOAD_FILE,
      payload
    });
  }

  uploadBase64Image(payload: UploadBase64Payload): Observable<StaticAsset> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.STATIC_ASSETS,
      action: StaticAssetsEndpoint.UPLOAD_BASE64,
      payload
    });
  }
}
