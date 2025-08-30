export interface UpdateSocialLinksRequest {
  socialLinks: Array<{
    url: string;
    alt: string;
    iconId: string;
  }>;
}
