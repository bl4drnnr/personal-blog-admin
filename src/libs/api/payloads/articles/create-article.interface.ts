export interface CreateArticlePayload {
  articleName: string;
  articleDescription: string;
  articleTags: Array<string>;
  articleContent: string;
  articlePicture: string;
  categoryId: string;
}
