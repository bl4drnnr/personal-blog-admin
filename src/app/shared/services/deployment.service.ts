import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { ControlEndpoint } from '@interfaces/control.enum';
import { DeploymentResponse } from '@responses/deployment-response.interface';

@Injectable({
  providedIn: 'root'
})
export class DeploymentService {
  constructor(private readonly apiService: ApiService) {}

  triggerDeployment(): Observable<DeploymentResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.CONTROL,
      action: ControlEndpoint.TRIGGER_DEPLOYMENT
    });
  }
}
