export interface EditArticlePayload {
  articleId: string;
  articleName?: string;
  articleDescription?: string;
  articleContent?: string;
  articleTags?: Array<string>;
  articlePicture?: string;
  categoryId?: string;
}
