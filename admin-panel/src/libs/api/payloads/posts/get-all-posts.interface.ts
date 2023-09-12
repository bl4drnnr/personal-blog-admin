import { Language } from '@interfaces/language.enum';
import { Order } from '@interfaces/order.type';
import { OrderBy } from '@interfaces/order-by.type';
import { PostType } from '@interfaces/post.type';

export interface GetAllPostsPayload {
  language: Language;
  page: number;
  pageSize: number;
  order: Order;
  orderBy: OrderBy;
  searchQuery: string;
  postTypes: PostType;
}
