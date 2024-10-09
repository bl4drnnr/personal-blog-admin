import { ListAuthor } from '@interfaces/list-author.interface';

export interface ListAuthorsResponse {
  count: number;
  rows: Array<ListAuthor>;
}
