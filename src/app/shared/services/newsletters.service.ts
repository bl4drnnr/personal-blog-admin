import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { SubscribePageData } from '@interfaces/pages/subscribe-page-data.interface';
import { Controller } from '@interfaces/controller.enum';
import { NewslettersEndpoint } from '@interfaces/newsletters.enum';
import { Method } from '@interfaces/methods.enum';
import { ListSubscriptionsPayload } from '@payloads/list-subscriptions.interface';
import { ListSubscriptionsResponse } from '@responses/list-subscriptions.interface';

@Injectable({
  providedIn: 'root'
})
export class NewslettersService {
  constructor(private apiService: ApiService) {}

  getAdminSubscribePageData(): Observable<SubscribePageData> {
    return this.apiService.apiProxyRequest({
      controller: Controller.NEWSLETTERS,
      action: NewslettersEndpoint.GET_ADMIN_SUBSCRIBE_PAGE,
      method: Method.GET
    });
  }

  updateSubscribePage(data: any): Observable<any> {
    return this.apiService.apiProxyRequest({
      controller: Controller.NEWSLETTERS,
      action: NewslettersEndpoint.UPDATE_SUBSCRIBE_PAGE,
      method: Method.PUT,
      payload: data
    });
  }

  listSubscriptions(
    params: ListSubscriptionsPayload
  ): Observable<ListSubscriptionsResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.NEWSLETTERS,
      action: NewslettersEndpoint.LIST_SUBSCRIPTIONS,
      params
    });
  }

  deleteSubscription(id: string): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.NEWSLETTERS,
      action: NewslettersEndpoint.DELETE_SUBSCRIPTION,
      params: { id }
    });
  }
}
