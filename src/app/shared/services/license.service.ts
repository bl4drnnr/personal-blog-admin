import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Method } from '@interfaces/methods.enum';
import { LicensePageData } from '@interfaces/license/license-page-data.interface';
import { LicenseTileData } from '@interfaces/license/license-tile-data.interface';
import { Controller } from '@interfaces/controller.enum';
import { LicenseEndpoint } from '@interfaces/license.enum';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {
  constructor(private readonly apiService: ApiService) {}

  // License Page Settings Methods
  getLicensePageData(): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.LICENSE,
      action: LicenseEndpoint.GET_LICENSE_PAGE_DATA
    });
  }

  getLicensePageDataAdmin(): Observable<LicensePageData> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.LICENSE,
      action: LicenseEndpoint.GET_LICENSE_PAGE_DATA_ADMIN
    });
  }

  updateLicensePage(payload: LicensePageData): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.LICENSE,
      action: LicenseEndpoint.UPDATE_LICENSE_PAGE,
      payload
    });
  }

  // License Tiles Methods
  getLicenseTiles(): Observable<LicenseTileData[]> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.LICENSE,
      action: LicenseEndpoint.GET_LICENSE_TILES
    });
  }

  createLicenseTile(payload: LicenseTileData): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.LICENSE,
      action: LicenseEndpoint.CREATE_LICENSE_TILE,
      payload
    });
  }

  updateLicenseTile(id: string, payload: LicenseTileData): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.LICENSE,
      action: LicenseEndpoint.UPDATE_LICENSE_TILE,
      params: { id },
      payload
    });
  }

  deleteLicenseTile(id: string): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.LICENSE,
      action: LicenseEndpoint.DELETE_LICENSE_TILE,
      params: { id }
    });
  }
}
