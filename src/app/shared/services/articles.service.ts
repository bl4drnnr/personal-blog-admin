import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { CreateArticlePayload } from '@payloads/create-article.interface';
import { Observable } from 'rxjs';
import { ArticlesEndpoint } from '@interfaces/articles.enum';
import { ArticleCreatedResponse } from '@responses/article-created.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  constructor(private readonly apiService: ApiService) {}

  createArticle(
    payload: CreateArticlePayload
  ): Observable<ArticleCreatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.ARTICLES,
      action: ArticlesEndpoint.CREATE,
      payload
    });
  }
}
