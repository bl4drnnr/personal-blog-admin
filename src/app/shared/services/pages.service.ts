import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Method } from '@interfaces/methods.enum';
import { HomePageData } from '@interfaces/pages/home-page-data.interface';
import { UpdateHomePageData } from '@interfaces/pages/update-home-page-data.interface';
import { PagesEndpoint } from '@interfaces/pages.enum';
import { Controller } from '@interfaces/controller.enum';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  constructor(private readonly apiService: ApiService) {}

  getAdminHomePageData(): Observable<HomePageData> {
    return this.apiService.apiProxyRequest({
      controller: Controller.PAGES,
      action: PagesEndpoint.GET_ADMIN_HOME_PAGE_DATA,
      method: Method.GET
    });
  }

  updateHomePage(data: UpdateHomePageData): Observable<any> {
    return this.apiService.apiProxyRequest({
      controller: Controller.PAGES,
      action: PagesEndpoint.UPDATE_HOME_PAGE,
      method: Method.PUT,
      payload: data
    });
  }
}
