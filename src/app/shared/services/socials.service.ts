import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { SocialEndpoint } from '@interfaces/socials.enum';
import { Observable } from 'rxjs';
import { CreateSocialPayload } from '@payloads/create-social.interface';
import { SocialCreatedResponse } from '@responses/social-created.interface';
import { UpdateSocialPayload } from '@payloads/update-social.interface';
import { SocialUpdatedResponse } from '@responses/social-updated.interface';
import { DeleteSocialPayload } from '@payloads/delete-social.interface';
import { SocialDeletedResponse } from '@responses/social-deleted.interface';

@Injectable({
  providedIn: 'root'
})
export class SocialsService {
  constructor(private readonly apiService: ApiService) {}

  createSocial(payload: CreateSocialPayload): Observable<SocialCreatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.ABOUT_BLOG,
      action: SocialEndpoint.CREATE,
      payload
    });
  }

  updateSocial(payload: UpdateSocialPayload): Observable<SocialUpdatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.ABOUT_BLOG,
      action: SocialEndpoint.UPDATE,
      payload
    });
  }

  deleteSocial(params: DeleteSocialPayload): Observable<SocialDeletedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.ABOUT_BLOG,
      action: SocialEndpoint.DELETE,
      params
    });
  }
}
