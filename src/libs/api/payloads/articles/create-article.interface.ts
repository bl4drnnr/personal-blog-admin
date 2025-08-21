export interface CreateArticlePayload {
  articleName: string;
  articleDescription: string;
  articleContent: string;
  articleTags: Array<string>;
  articleMetaKeywords: string;
  articlePictureId: string;
  articleExcerpt: string;
  articlePublished: boolean;
}
