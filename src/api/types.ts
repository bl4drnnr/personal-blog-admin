export type PostType = 'article' | 'project';

export interface PostListItem {
  id: string;
  slug: string;
  type: PostType;
  title: string;
  featured: boolean;
  published: boolean;
  publishedAt: string | null;
  updatedAt: string;
}

export interface PostList {
  items: PostListItem[];
  total: number;
  page: number;
  per: number;
}

export interface Post {
  id: string;
  type: PostType;
  slug: string;
  title: string;
  excerpt: string;
  contentMd: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  publishedAt: string | null;
  repoUrl: string | null;
  heroAssetId: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  readingTimeMin: number;
}

export interface PostInput {
  type: PostType;
  slug: string;
  title: string;
  excerpt: string;
  contentMd: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  repoUrl?: string;
  heroAssetId?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Asset {
  id: string;
  s3Key: string;
  /** Name the file was uploaded under; '' for assets stored before it was kept. */
  filename: string;
  url: string;
  contentType: string;
  sizeBytes: number;
  alt: string | null;
  createdAt: string;
}

export interface AssetList {
  items: Asset[];
  total: number;
  page: number;
  per: number;
}
