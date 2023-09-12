import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { PostsEndpoint } from '@interfaces/posts.enum';
import { GetAllPostsPayload } from '@payloads/get-all-posts.interface';
import { Observable } from 'rxjs';
import { AllPostsInterface } from '@responses/all-posts.interface';
import { Post } from '@interfaces/post.interface';
import { GetPostBySlugPayload } from '@payloads/get-post-by-slug.interface';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(private apiService: ApiService) {}

  getAllPosts(params: GetAllPostsPayload): Observable<AllPostsInterface> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.POSTS,
      action: PostsEndpoint.GET_ALL_POSTS,
      params
    });
  }

  getPostBySlug(params: GetPostBySlugPayload): Observable<Post> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.POSTS,
      action: PostsEndpoint.GET_BY_SLUG,
      params
    });
  }
}
