export interface ContactTileData {
  id?: string;
  title: string;
  content: string;
  link: string;
  iconAssetId?: string;
  iconUrl?: string | null;
  sortOrder: number;
}

export interface ContactPageData {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  heroImageMainId: string;
  heroImageSecondaryId: string;
  heroImageMainAlt: string;
  heroImageSecondaryAlt: string;
  logoText: string;
  breadcrumbText: string;
  heroTitle: string;
  heroDesc: string;
  carouselWords: string;
  submitButtonText: string;
  successMessage: string;
  errorMessage: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImageId: string;
  structuredData: any;
  contactTiles?: ContactTileData[];
}
