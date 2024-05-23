export interface ListArticleInterface {
  id: string;
  articleDescription: string;
  articleImage: string;
  articleName: string;
  articleSlug: string;
  articleTags: Array<string>;
  articlePosted: boolean;
  category: { categoryName: string };
}
