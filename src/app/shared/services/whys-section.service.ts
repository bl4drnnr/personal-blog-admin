import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api.service';
import {
  CreateWhysSectionData,
  UpdateWhysSectionData,
  WhysSection
} from '@interfaces/whys-section/whys-section.interface';
import { Controller } from '@interfaces/controller.enum';
import { WhysSectionEndpoint } from '@interfaces/whys-section.enum';
import { Method } from '@interfaces/methods.enum';

@Injectable({
  providedIn: 'root'
})
export class WhysSectionService {
  constructor(private apiProxyService: ApiService) {}

  getWhysSections(): Observable<WhysSection[]> {
    return this.apiProxyService.apiProxyRequest({
      controller: Controller.HOME,
      action: WhysSectionEndpoint.GET_WHYS_SECTIONS,
      method: Method.GET
    });
  }

  createWhysSection(payload: CreateWhysSectionData): Observable<WhysSection> {
    return this.apiProxyService.apiProxyRequest({
      controller: Controller.HOME,
      action: WhysSectionEndpoint.CREATE_WHYS_SECTION,
      method: Method.POST,
      payload
    });
  }

  updateWhysSection(
    id: string,
    payload: UpdateWhysSectionData
  ): Observable<WhysSection> {
    return this.apiProxyService.apiProxyRequest({
      controller: Controller.HOME,
      action: WhysSectionEndpoint.UPDATE_WHYS_SECTION,
      method: Method.PUT,
      params: { id },
      payload
    });
  }

  deleteWhysSection(id: string): Observable<{ message: string }> {
    return this.apiProxyService.apiProxyRequest({
      controller: Controller.HOME,
      action: WhysSectionEndpoint.DELETE_WHYS_SECTION,
      method: Method.DELETE,
      params: { id }
    });
  }
}
