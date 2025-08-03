import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api.service';
import {
  CreateFaqData,
  Faq,
  FaqResponse,
  GetFaqsParams,
  UpdateFaqData
} from '@interfaces/faq/faq.interface';
import { Controller } from '@interfaces/controller.enum';
import { FaqEndpoint } from '@interfaces/faq.enum';
import { Method } from '@interfaces/methods.enum';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  constructor(private apiProxyService: ApiService) {}

  getFaqs(params: GetFaqsParams): Observable<FaqResponse> {
    return this.apiProxyService.apiProxyRequest({
      controller: Controller.FAQ,
      action: FaqEndpoint.GET_FAQS,
      method: Method.GET,
      params
    });
  }

  getFaqById(id: string): Observable<Faq> {
    return this.apiProxyService.apiProxyRequest({
      controller: Controller.FAQ,
      action: FaqEndpoint.GET_FAQ_BY_ID,
      method: Method.GET,
      params: { id }
    });
  }

  createFaq(payload: CreateFaqData): Observable<Faq> {
    return this.apiProxyService.apiProxyRequest({
      controller: Controller.FAQ,
      action: FaqEndpoint.CREATE_FAQ,
      method: Method.POST,
      payload
    });
  }

  updateFaq(id: string, payload: UpdateFaqData): Observable<Faq> {
    return this.apiProxyService.apiProxyRequest({
      controller: Controller.FAQ,
      action: FaqEndpoint.UPDATE_FAQ,
      method: Method.PUT,
      params: { id },
      payload
    });
  }

  deleteFaq(id: string): Observable<{ message: string }> {
    return this.apiProxyService.apiProxyRequest({
      controller: Controller.FAQ,
      action: FaqEndpoint.DELETE_FAQ,
      method: Method.DELETE,
      params: { id }
    });
  }

  updateSortOrder(
    payload: Array<{ id: string; sortOrder: number }>
  ): Observable<{ message: string }> {
    return this.apiProxyService.apiProxyRequest({
      controller: Controller.FAQ,
      action: FaqEndpoint.UPDATE_SORT_ORDER,
      method: Method.PUT,
      payload
    });
  }
}
