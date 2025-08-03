export interface HomePageData {
  pageContent: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    marqueeLeftText: string;
    marqueeRightText: string;
    latestProjectsTitle: string;
    latestPostsTitle: string;
    whySectionTitle: string;
    faqSectionTitle: string;
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
  projects: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    slug: string;
    featured: boolean;
  }>;
  posts: Array<{
    id: string;
    title: string;
    description: string;
    excerpt: string;
    imageUrl: string;
    slug: string;
    featured: boolean;
  }>;
  faqQuestions: Array<{
    id: string;
    question: string;
    answer: string;
    sortOrder: number;
    featured: boolean;
    isActive: boolean;
  }>;
  whysSection?: {
    id: string;
    title: string;
    blocks: Array<{
      title: string;
      description: string;
      features: string[];
    }>;
    featured: boolean;
  };
}
