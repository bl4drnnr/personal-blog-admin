import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Controller } from '@interfaces/controller.enum';
import { Method } from '@interfaces/methods.enum';
import { SocialLinksEndpoint } from '@interfaces/social-links.enum';
import { AdminSocialLink } from '@interfaces/social-links/social-link.interface';
import { UpdateSocialLinksRequest } from '@payloads/update-social-link.interface';
import { SocialLinksUpdatedResponse } from '@responses/social-links-updated.interface';

@Injectable({
  providedIn: 'root'
})
export class SocialLinksService {
  constructor(private apiService: ApiService) {}

  getAdminSocialLinks(): Observable<Array<AdminSocialLink>> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.SOCIAL_LINKS,
      action: SocialLinksEndpoint.GET_SOCIAL_LINKS
    });
  }

  updateSocialLinks(
    payload: UpdateSocialLinksRequest
  ): Observable<SocialLinksUpdatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.SOCIAL_LINKS,
      action: SocialLinksEndpoint.UPDATE_SOCIAL_LINKS,
      payload
    });
  }
}
