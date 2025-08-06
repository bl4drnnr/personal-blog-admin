export interface ProjectsPageData {
  pageContent: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
  };
  layoutData: {
    footerText: string;
    heroImageMainId: string;
    heroImageSecondaryId: string;
    heroImageMainAlt: string;
    heroImageSecondaryAlt: string;
    logoText: string;
    breadcrumbText: string;
    heroTitle: string;
  };
  seoData: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImageId: string;
    structuredData?: object;
  };
}
