import { PostType } from '@interfaces/post.type';

export interface Post {
  slug: string;
  title: string;
  description: string;
  type: Array<PostType>;
  searchTags: Array<string>;
  createdAt: string;
}
