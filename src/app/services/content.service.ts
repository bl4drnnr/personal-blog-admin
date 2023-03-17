import { Inject, Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { IPost } from '@models/post.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  constructor(@Inject(ApiService) private apiService: ApiService) {}

  setTypeOfContent(typeOfContent: 'posts' | 'projects') {
    this.typeOfContent = typeOfContent;
  }

  private typeOfContent: string;

  listItems({
    language,
    page,
    pageSize,
    order,
    orderBy,
    searchQuery,
    postTypes
  }: {
    language: string;
    page: number;
    pageSize: number;
    order: string;
    orderBy: string;
    searchQuery: string;
    postTypes: string;
  }) {
    return this.apiService.basicContentEdition({
      method: 'GET',
      action: 'all',
      typeOfContent: this.typeOfContent,
      language,
      page,
      pageSize,
      order,
      orderBy,
      searchQuery,
      postTypes
    });
  }

  createItem({ payload }: { payload: IPost }) {
    return this.apiService.basicContentEdition({
      method: 'POST',
      action: 'create',
      typeOfContent: this.typeOfContent,
      payload
    });
  }

  getItem({ id }: { id: string }) {
    return this.apiService.basicContentEdition({
      id,
      method: 'GET',
      action: 'get-by-id',
      typeOfContent: this.typeOfContent
    });
  }

  deleteItem({ id }: { id: string }) {
    return this.apiService.basicContentEdition({
      id,
      method: 'DELETE',
      action: 'delete',
      typeOfContent: this.typeOfContent
    });
  }

  editItem({ id, payload }: { id: string; payload: IPost }) {
    return this.apiService.basicContentEdition({
      id,
      payload,
      method: 'PATCH',
      action: 'update',
      typeOfContent: this.typeOfContent
    });
  }
}
