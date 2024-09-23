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
import { ListExperiencesResponse } from '@responses/list-experiences.interface';
import { ListExperiencesPayload } from '@payloads/list-experiences.interface';
import { GetExperienceByIdPayload } from '@payloads/get-experience.interface';
import { ChangeExperienceSelectionStatusPayload } from '@payloads/change-experience-selection-status.interface';
import { ExperienceSelectionStatusChangedResponse } from '@responses/experience-selection-status-changed.interface';
import { DeleteExperiencePayload } from '@payloads/delete-experience.interface';
import { ExperienceDeletedResponse } from '@responses/experience-deleted.interface';
import { GetExperienceByIdResponse } from '@responses/get-experience-by-id.interface';
import { EditExperiencePayload } from '@payloads/edit-experience.interface';
import { EditExperienceResponse } from '@responses/edit-experience.interface';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  constructor(private readonly apiService: ApiService) {}

  getExperienceById(
    params: GetExperienceByIdPayload
  ): Observable<GetExperienceByIdResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.ABOUT_BLOG,
      action: ExperienceEndpoint.GET_EXPERIENCE_BY_ID,
      params
    });
  }

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

  listCertifications(
    params: ListExperiencesPayload
  ): Observable<ListExperiencesResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.ABOUT_BLOG,
      action: ExperienceEndpoint.LIST_EXPERIENCES,
      params
    });
  }

  changeExperienceSelectionStatus(
    payload: ChangeExperienceSelectionStatusPayload
  ): Observable<ExperienceSelectionStatusChangedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.ABOUT_BLOG,
      action: ExperienceEndpoint.CHANGE_EXPERIENCE_SELECTION_STATUS,
      payload
    });
  }

  deleteExperience(
    params: DeleteExperiencePayload
  ): Observable<ExperienceDeletedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.ABOUT_BLOG,
      action: ExperienceEndpoint.DELETE_EXPERIENCE,
      params
    });
  }

  editExperience(
    payload: EditExperiencePayload
  ): Observable<EditExperienceResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.ABOUT_BLOG,
      action: ExperienceEndpoint.UPDATE_EXPERIENCE,
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
