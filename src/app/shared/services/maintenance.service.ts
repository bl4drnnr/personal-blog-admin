import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { MaintenanceResponse } from '@responses/maintenance.interface';
import { MaintenanceEndpoint } from '@interfaces/maintenance.enum';
import { UpdateMaintenancePayload } from '../../../libs/api/payloads/maintenance/update-maintenance.interface';
import { MaintenanceUpdatedResponse } from '@responses/maintenance-updated.interface';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  constructor(private readonly apiService: ApiService) {}

  getMaintenance(): Observable<MaintenanceResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.MAINTENANCE,
      action: MaintenanceEndpoint.ADMIN_MAINTENANCE
    });
  }

  updateMaintenance(
    payload: UpdateMaintenancePayload
  ): Observable<MaintenanceUpdatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.MAINTENANCE,
      action: MaintenanceEndpoint.ADMIN_MAINTENANCE,
      payload
    });
  }

  getMaintenanceStatus(): Observable<MaintenanceResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.MAINTENANCE,
      action: MaintenanceEndpoint.MAINTENANCE_STATUS
    });
  }
}
