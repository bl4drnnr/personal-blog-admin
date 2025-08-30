import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Controller } from '@interfaces/controller.enum';
import { Method } from '@interfaces/methods.enum';
import { CopyrightEndpoint } from '@interfaces/copyright.enum';
import {
  CopyrightData,
  UpdateCopyrightDataRequest,
  UpdateCopyrightDataResponse
} from '@interfaces/copyright/copyright-data.interface';

@Injectable({
  providedIn: 'root'
})
export class CopyrightService {
  constructor(private apiService: ApiService) {}

  getCopyrightData(): Observable<CopyrightData> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.COPYRIGHT,
      action: CopyrightEndpoint.GET_COPYRIGHT_DATA
    });
  }

  updateCopyrightData(
    payload: UpdateCopyrightDataRequest
  ): Observable<UpdateCopyrightDataResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.COPYRIGHT,
      action: CopyrightEndpoint.UPDATE_COPYRIGHT_DATA,
      payload
    });
  }
}
