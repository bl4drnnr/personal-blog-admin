import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { CreatePostPayload } from '@payloads/create-post.interface';
import { Observable } from 'rxjs';
import { PostCreatedResponse } from '@responses/post-created.interface';
import { PostsEndpoint } from '@interfaces/posts.enum';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(private readonly apiService: ApiService) {}

  createPost(payload: CreatePostPayload): Observable<PostCreatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.POSTS,
      action: PostsEndpoint.CREATE,
      payload
    });
  }
}
