import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Method } from '@interfaces/methods.enum';
import { NotFoundPageData } from '@interfaces/not-found/not-found-page-data.interface';
import { Controller } from '@interfaces/controller.enum';
import { NotFoundEndpoint } from '@interfaces/not-found.enum';

@Injectable({
  providedIn: 'root'
})
export class NotFoundService {
  constructor(private readonly apiService: ApiService) {}

  // Not Found Page Settings Methods
  getNotFoundPageData(): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.NOT_FOUND,
      action: NotFoundEndpoint.GET_NOT_FOUND_PAGE_DATA
    });
  }

  getNotFoundPageDataAdmin(): Observable<NotFoundPageData> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.NOT_FOUND,
      action: NotFoundEndpoint.GET_NOT_FOUND_PAGE_DATA_ADMIN
    });
  }

  createNotFoundPage(payload: NotFoundPageData): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.NOT_FOUND,
      action: NotFoundEndpoint.CREATE_NOT_FOUND_PAGE,
      payload
    });
  }

  updateNotFoundPage(payload: NotFoundPageData): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.NOT_FOUND,
      action: NotFoundEndpoint.UPDATE_NOT_FOUND_PAGE,
      payload
    });
  }
}
