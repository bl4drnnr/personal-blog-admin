export interface GetArticleBySlugResponse {
  id: string;
  articleName: string;
  articleSlug: string;
  articleDescription: string;
  articleTags: Array<string>;
  articleContent: string;
  articleImage: string;
  articlePosted: boolean;
  userId: string;
  categoryId: string;
  category: { categoryName: string };
  createdAt: Date;
  updatedAt: Date;
}
