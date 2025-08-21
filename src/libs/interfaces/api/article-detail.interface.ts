export interface ArticleDetailInterface {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  excerpt: string;
  featuredImageId: string;
  tags: string[];
  metaKeywords: string;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
