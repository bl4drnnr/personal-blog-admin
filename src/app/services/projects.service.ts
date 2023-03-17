import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { IProject } from '@models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  constructor(private apiService: ApiService) {}

  createProject({ payload }: { payload: IProject }) {
    //
  }

  getProject({ id }: { id: string }) {
    //
  }

  deleteProject({ id }: { id: string }) {
    //
  }

  editProject({ id, payload }: { id: string; payload: IProject }) {
    //
  }
}
