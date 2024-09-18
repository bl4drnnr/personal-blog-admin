import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { ExperienceEndpoint } from '@interfaces/experience.enum';
import { CreateExperiencePositionPayload } from '@payloads/create-experience-position.interface';
import { Observable } from 'rxjs';
import { ExperiencePositionCreatedResponse } from '@responses/experience-position-created.interface';
import { UpdateExperiencePositionPayload } from '@payloads/update-experience-position.interface';
import { ExperiencePositionUpdatedResponse } from '@responses/experience-position-updated.interface';
import { DeleteExperiencePositionPayload } from '@payloads/delete-experience-position.interface';
import { ExperiencePositionDeletedResponse } from '@responses/experience-position-deleted.interface';
import { CreateExperiencePayload } from '@payloads/create-experience.interface';
import { ExperienceCreatedResponse } from '@responses/experience-created.interface';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  constructor(private readonly apiService: ApiService) {}

  createExperience(
    payload: CreateExperiencePayload
  ): Observable<ExperienceCreatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.ABOUT_BLOG,
      action: ExperienceEndpoint.CREATE_EXPERIENCE,
      payload
    });
  }

  createExperiencePosition(
    payload: CreateExperiencePositionPayload
  ): Observable<ExperiencePositionCreatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.ABOUT_BLOG,
      action: ExperienceEndpoint.CREATE_EXPERIENCE_POSITION,
      payload
    });
  }

  updateExperiencePosition(
    payload: UpdateExperiencePositionPayload
  ): Observable<ExperiencePositionUpdatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.ABOUT_BLOG,
      action: ExperienceEndpoint.UPDATE_EXPERIENCE_POSITION,
      payload
    });
  }

  deleteExperiencePosition(
    params: DeleteExperiencePositionPayload
  ): Observable<ExperiencePositionDeletedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.ABOUT_BLOG,
      action: ExperienceEndpoint.DELETE_EXPERIENCE_POSITION,
      params
    });
  }
}
