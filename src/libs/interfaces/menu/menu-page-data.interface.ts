export interface MenuPageData {
  id?: string;
  footerText: string;
  heroImageMainId: string;
  heroImageMainAlt: string;
  logoText: string;
  breadcrumbText: string;

  // SEO Meta Tags
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;

  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogImageId: string;

  // Structured Data (JSON)
  structuredData?: any;
}
