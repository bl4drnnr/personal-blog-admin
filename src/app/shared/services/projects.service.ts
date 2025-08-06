import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Controller } from '@interfaces/controller.enum';
import { Method } from '@interfaces/methods.enum';
import { ListProjectsPayload } from '@payloads/list-projects.interface';
import { ProjectsEndpoint } from '@interfaces/projects.enum';
import { ListProjectsResponse } from '@responses/list-projects.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  constructor(private readonly apiService: ApiService) {}

  listProjects(params: ListProjectsPayload): Observable<ListProjectsResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.PROJECTS,
      action: ProjectsEndpoint.LIST,
      params
    });
  }

  deleteProject(id: string): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.PROJECTS,
      action: ProjectsEndpoint.DELETE,
      params: { id }
    });
  }

  changePublishStatus(id: string): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.PROJECTS,
      action: ProjectsEndpoint.CHANGE_PUBLISH,
      params: { id }
    });
  }
}
