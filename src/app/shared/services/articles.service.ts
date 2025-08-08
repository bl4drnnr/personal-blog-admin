import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Controller } from '@interfaces/controller.enum';
import { Method } from '@interfaces/methods.enum';
import { ArticlesEndpoint } from '@interfaces/articles.enum';
import { ListArticlesResponse } from '@responses/list-articles.interface';
import { ListArticlesPayload } from '@payloads/list-articles.interface';
import { ArticleDetailInterface } from '@interfaces/api/article-detail.interface';
import { EditArticlePayload } from '@payloads/edit-article.interface';

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

  changeFeaturedStatus(id: string): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.ARTICLES,
      action: ArticlesEndpoint.CHANGE_FEATURED,
      params: { id }
    });
  }

  getPostBySlug(slug: string): Observable<ArticleDetailInterface> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.ARTICLES,
      action: ArticlesEndpoint.GET_POST,
      params: { slug }
    });
  }

  updateArticle(payload: EditArticlePayload): Observable<ArticleDetailInterface> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.ARTICLES,
      action: ArticlesEndpoint.EDIT,
      payload
    });
  }
}
