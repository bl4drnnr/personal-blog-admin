export interface CreateArticlePayload {
  articleName: string;
  articleDescription: string;
  articleTags: Array<string>;
  articleContent: string;
  categoryId: string;
}
