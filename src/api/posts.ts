import { apiRequest } from './client';
import type { Post, PostInput, PostList, PostType } from './types';

export function listPosts(params: {
  type?: PostType;
  search?: string;
  page: number;
  per: number;
}): Promise<PostList> {
  const query = new URLSearchParams({ page: String(params.page), per: String(params.per) });
  if (params.type) {
    query.set('type', params.type);
  }
  if (params.search) {
    query.set('search', params.search);
  }
  return apiRequest<PostList>(`/admin/posts?${query}`);
}

export function getPost(id: string): Promise<Post> {
  return apiRequest<Post>(`/admin/posts/${id}`);
}

export function createPost(input: PostInput): Promise<Post> {
  return apiRequest<Post>('/admin/posts', { method: 'POST', body: input });
}

export function updatePost(id: string, input: PostInput): Promise<Post> {
  return apiRequest<Post>(`/admin/posts/${id}`, { method: 'PUT', body: input });
}

export function deletePost(id: string): Promise<void> {
  return apiRequest<void>(`/admin/posts/${id}`, { method: 'DELETE' });
}
