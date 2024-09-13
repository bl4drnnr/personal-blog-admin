import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { AuthorsEndpoint } from '@interfaces/authors.enum';
import { ListAuthorsPayload } from '@payloads/list-authors.interface';
import { CreateAuthorPayload } from '@payloads/create-author.interface';
import { Observable } from 'rxjs';
import { AuthorCreatedResponse } from '@responses/author-created.interface';
import { GetAuthorByIdPayload } from '@payloads/get-author-by-id.interface';
import { GetAuthorByIdResponse } from '@responses/get-author-by-id.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {
  constructor(private readonly apiService: ApiService) {}

  getAuthorById(
    params: GetAuthorByIdPayload
  ): Observable<GetAuthorByIdResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.ABOUT_BLOG,
      action: AuthorsEndpoint.GET_AUTHOR_BY_ID,
      params
    });
  }

  createAuthor(
    payload: CreateAuthorPayload
  ): Observable<AuthorCreatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.ABOUT_BLOG,
      action: AuthorsEndpoint.CREATE_AUTHOR,
      payload
    });
  }

  listAuthors(params: ListAuthorsPayload) {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.ABOUT_BLOG,
      action: AuthorsEndpoint.LIST_AUTHORS,
      params
    });
  }
}
