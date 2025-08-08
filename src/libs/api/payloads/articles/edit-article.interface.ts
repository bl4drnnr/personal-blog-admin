export interface EditArticlePayload {
  articleId: string;
  articleName?: string;
  articleDescription?: string;
  articleContent?: string;
  articleTags?: Array<string>;
  articlePictureId?: string;
}
