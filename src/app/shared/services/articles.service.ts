import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { CreateArticlePayload } from '@payloads/create-article.interface';
import { Observable } from 'rxjs';
import { ArticlesEndpoint } from '@interfaces/articles.enum';
import { ArticleCreatedResponse } from '@responses/article-created.interface';
import { GetBySlugPayload } from '@payloads/get-by-slug.interface';
import { GetArticleBySlugResponse } from '@responses/get-article-by-slug.interface';
import { DeleteArticlePayload } from '@payloads/delete-article.interface';
import { ArticleDeletedResponse } from '@responses/article-deleted.interface';
import { ListArticlesPayload } from '@payloads/list-articles.interface';
import { ListArticlesResponse } from '@responses/list-articles.interface';
import { EditArticlePayload } from '@payloads/edit-article.interface';
import { ArticleEditedResponse } from '@responses/article-edited.interface';
import { ChangePublishArticleStatusPayload } from '@payloads/change-publish-article-status.interface';
import { ArticlePublishedResponse } from '@responses/article-published.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  constructor(private readonly apiService: ApiService) {}

  getArticleBySlug(params: GetBySlugPayload): Observable<GetArticleBySlugResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.ARTICLES,
      action: ArticlesEndpoint.GET_BY_SLUG,
      params
    });
  }

  createArticle(payload: CreateArticlePayload): Observable<ArticleCreatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.ARTICLES,
      action: ArticlesEndpoint.CREATE,
      payload
    });
  }

  changePublishArticleStatus(
    params: ChangePublishArticleStatusPayload
  ): Observable<ArticlePublishedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.ARTICLES,
      action: ArticlesEndpoint.CHANGE_PUBLISH,
      params
    });
  }

  deleteArticle(params: DeleteArticlePayload): Observable<ArticleDeletedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.ARTICLES,
      action: ArticlesEndpoint.DELETE,
      params
    });
  }

  editArticle(payload: EditArticlePayload): Observable<ArticleEditedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.ARTICLES,
      action: ArticlesEndpoint.EDIT,
      payload
    });
  }

  listArticles(params: ListArticlesPayload): Observable<ListArticlesResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.ARTICLES,
      action: ArticlesEndpoint.LIST,
      params
    });
  }
}
