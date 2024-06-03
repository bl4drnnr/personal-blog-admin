import { ArticleInterface } from '@payloads/article.interface';

export interface CreateArticlePayload {
  articles: Array<ArticleInterface>;
}
