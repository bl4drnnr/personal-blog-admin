import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { IPost } from '@models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(private apiService: ApiService) {}

  typeOfContent = 'posts';

  listPosts({
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

  createPost({ payload }: { payload: IPost }) {
    return this.apiService.basicContentEdition({
      method: 'POST',
      action: 'create',
      typeOfContent: this.typeOfContent,
      payload
    });
  }

  getPost({ id }: { id: string }) {
    return this.apiService.basicContentEdition({
      id,
      method: 'GET',
      action: 'get-by-id',
      typeOfContent: this.typeOfContent
    });
  }

  deletePost({ id }: { id: string }) {
    return this.apiService.basicContentEdition({
      id,
      method: 'DELETE',
      action: 'delete',
      typeOfContent: this.typeOfContent
    });
  }

  editPost({ id, payload }: { id: string; payload: IPost }) {
    return this.apiService.basicContentEdition({
      id,
      payload,
      method: 'PATCH',
      action: 'update',
      typeOfContent: this.typeOfContent
    });
  }
}
