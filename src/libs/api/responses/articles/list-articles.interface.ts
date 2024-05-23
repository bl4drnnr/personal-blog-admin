import { ListArticleInterface } from '@interfaces/list-article.interface';

export interface ListArticlesResponse {
  count: number;
  rows: Array<ListArticleInterface>;
}
