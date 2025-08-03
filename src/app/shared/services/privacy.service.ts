import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Method } from '@interfaces/methods.enum';
import { PrivacyPageData } from '@interfaces/privacy/privacy-page-data.interface';
import { PrivacySectionData } from '@interfaces/privacy/privacy-section-data.interface';
import { Controller } from '@interfaces/controller.enum';
import { PrivacyEndpoint } from '@interfaces/privacy.enum';

@Injectable({
  providedIn: 'root'
})
export class PrivacyService {
  constructor(private readonly apiService: ApiService) {}

  // Privacy Page Settings Methods
  getPrivacyPageData(): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.PRIVACY,
      action: PrivacyEndpoint.GET_PRIVACY_PAGE_DATA
    });
  }

  getPrivacyPageDataAdmin(): Observable<PrivacyPageData> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.PRIVACY,
      action: PrivacyEndpoint.GET_PRIVACY_PAGE_DATA_ADMIN
    });
  }

  updatePrivacyPage(payload: PrivacyPageData): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.PRIVACY,
      action: PrivacyEndpoint.UPDATE_PRIVACY_PAGE,
      payload
    });
  }

  // Privacy Sections Methods
  getPrivacySections(): Observable<PrivacySectionData[]> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.PRIVACY,
      action: PrivacyEndpoint.GET_PRIVACY_SECTIONS
    });
  }

  createPrivacySection(payload: PrivacySectionData): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.PRIVACY,
      action: PrivacyEndpoint.CREATE_PRIVACY_SECTION,
      payload
    });
  }

  updatePrivacySection(id: string, payload: PrivacySectionData): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.PRIVACY,
      action: PrivacyEndpoint.UPDATE_PRIVACY_SECTION,
      params: { id },
      payload
    });
  }

  deletePrivacySection(id: string): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.PRIVACY,
      action: PrivacyEndpoint.DELETE_PRIVACY_SECTION,
      params: { id }
    });
  }
}
