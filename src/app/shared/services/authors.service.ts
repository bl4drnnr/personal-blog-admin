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
import { ListAuthorsResponse } from '@responses/list-authors.interface';
import { AuthorSelectionStatusChangedResponse } from '@responses/author-selection-status-changed.interface';
import { ChangeAuthorSelectionStatusPayload } from '@payloads/change-author-selection-status.interface';
import { DeleteAuthorPayload } from '@payloads/delete-author.interface';
import { AuthorDeletedResponse } from '@responses/author-deleted.interface';
import { EditAuthorPayload } from '@payloads/edit-author.interface';
import { AuthorUpdatedResponse } from '@responses/author-updated.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {
  constructor(private readonly apiService: ApiService) {}

  getAuthorById(params: GetAuthorByIdPayload): Observable<GetAuthorByIdResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.ABOUT_BLOG,
      action: AuthorsEndpoint.GET_AUTHOR_BY_ID,
      params
    });
  }

  createAuthor(payload: CreateAuthorPayload): Observable<AuthorCreatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.ABOUT_BLOG,
      action: AuthorsEndpoint.CREATE_AUTHOR,
      payload
    });
  }

  listAuthors(params: ListAuthorsPayload): Observable<ListAuthorsResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.ABOUT_BLOG,
      action: AuthorsEndpoint.LIST_AUTHORS,
      params
    });
  }

  changeAuthorSelectionStatus(
    payload: ChangeAuthorSelectionStatusPayload
  ): Observable<AuthorSelectionStatusChangedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.ABOUT_BLOG,
      action: AuthorsEndpoint.CHANGE_AUTHOR_SELECTION_STATUS,
      payload
    });
  }

  deleteAuthor(params: DeleteAuthorPayload): Observable<AuthorDeletedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.ABOUT_BLOG,
      action: AuthorsEndpoint.DELETE_AUTHOR,
      params
    });
  }

  editAuthor(payload: EditAuthorPayload): Observable<AuthorUpdatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.ABOUT_BLOG,
      action: AuthorsEndpoint.UPDATED_AUTHOR,
      payload
    });
  }
}
