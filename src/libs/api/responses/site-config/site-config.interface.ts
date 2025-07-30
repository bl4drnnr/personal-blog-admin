export interface SiteConfigResponse {
  siteName: string;
  siteDescription: string;
  siteAuthor: string;
  siteUrl: string;
  defaultImage: string;
  keywords: string;
  socialMedia?: {
    linkedin?: string;
    github?: string;
    [key: string]: string | undefined;
  };
  organization?: {
    name: string;
    url: string;
    logo?: string;
  };
}
