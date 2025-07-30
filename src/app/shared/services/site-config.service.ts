import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { SiteConfigEndpoint } from '@interfaces/site-config.enum';
import { UpdateSiteConfigPayload } from '@payloads/update-site-config.interface';
import { SiteConfigUpdatedResponse } from '@responses/site-config-updated.interface';
import { SiteConfigResponse } from '@responses/site-config.interface';

@Injectable({
  providedIn: 'root'
})
export class SiteConfigService {
  constructor(private readonly apiService: ApiService) {}

  getSiteConfig(): Observable<SiteConfigResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.SITE_CONFIG,
      action: SiteConfigEndpoint.GET_CONFIG
    });
  }

  updateSiteConfig(
    payload: UpdateSiteConfigPayload
  ): Observable<SiteConfigUpdatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.SITE_CONFIG,
      action: SiteConfigEndpoint.UPDATE_CONFIG,
      payload
    });
  }
}
