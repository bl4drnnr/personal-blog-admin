import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { IProject } from '@models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  constructor(private apiService: ApiService) {}

  typeOfContent = 'projects';

  createProject({ payload }: { payload: IProject }) {
    return this.apiService.basicContentEdition({
      method: 'POST',
      action: 'create',
      typeOfContent: this.typeOfContent,
      payload
    });
  }

  getProject({ id }: { id: string }) {
    return this.apiService.basicContentEdition({
      id,
      method: 'GET',
      action: 'get-by-id',
      typeOfContent: this.typeOfContent
    });
  }

  deleteProject({ id }: { id: string }) {
    return this.apiService.basicContentEdition({
      id,
      method: 'DELETE',
      action: 'delete',
      typeOfContent: this.typeOfContent
    });
  }

  editProject({ id, payload }: { id: string; payload: IProject }) {
    return this.apiService.basicContentEdition({
      id,
      payload,
      method: 'PATCH',
      action: 'update',
      typeOfContent: this.typeOfContent
    });
  }
}
