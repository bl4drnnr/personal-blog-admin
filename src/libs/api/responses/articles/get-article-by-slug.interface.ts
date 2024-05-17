export interface GetArticleBySlugResponse {
  id: string;
  articleName: string;
  articleSlug: string;
  articleDescription: string;
  articleTags: Array<string>;
  articleContent: string;
  articleImage: string;
  userId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}
