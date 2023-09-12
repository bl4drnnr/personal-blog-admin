import { Post } from '@interfaces/post.interface';

export interface AllPostsInterface {
  count: number;
  rows: Array<Post>;
}
