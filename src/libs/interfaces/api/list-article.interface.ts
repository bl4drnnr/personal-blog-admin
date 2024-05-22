export interface ListArticleInterface {
  id: string;
  articleDescription: string;
  articleImage: string;
  articleName: string;
  articleSlug: string;
  articleTags: Array<string>;
  category: { categoryName: string };
}
