import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Controller } from '@interfaces/controller.enum';
import { Method } from '@interfaces/methods.enum';
import { ArticlesEndpoint } from '@interfaces/articles.enum';
import { ListArticlesResponse } from '@responses/list-articles.interface';
import { ListArticlesPayload } from '@payloads/list-articles.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  constructor(private readonly apiService: ApiService) {}

  listArticles(params: ListArticlesPayload): Observable<ListArticlesResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.ARTICLES,
      action: ArticlesEndpoint.LIST,
      params
    });
  }

  deleteArticle(id: string): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.ARTICLES,
      action: ArticlesEndpoint.DELETE,
      params: { id }
    });
  }

  changePublishStatus(id: string): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.ARTICLES,
      action: ArticlesEndpoint.CHANGE_PUBLISH,
      params: { id }
    });
  }
}
