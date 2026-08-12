import { apiRequest } from './client';
import { setAccessToken } from './token-store';

export interface SocialLink {
  label: string;
  url: string;
}

export interface SiteConfig {
  heroTitle: string;
  heroIntroMd: string;
  socialLinks: SocialLink[];
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  footerText: string;
}

export interface Position {
  id: string;
  company: string;
  companyUrl: string | null;
  title: string;
  description: string;
  location: string;
  logoAssetId: string | null;
  startDate: string;
  endDate: string | null;
  bullets: string[];
  skills: string[];
  sortOrder: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  logoAssetId: string | null;
  startDate: string;
  endDate: string | null;
  notes: string;
  sortOrder: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  description: string;
  logoAssetId: string | null;
  issuedDate: string;
  expiresDate: string | null;
  credentialUrl: string | null;
  sortOrder: number;
}

export interface AboutData {
  about: {
    fullName: string;
    avatarAssetId: string | null;
    profileMd: string;
    location: string;
    contactEmail: string;
    seoTitle: string | null;
    seoDescription: string | null;
  };
  positions: Position[];
  education: Education[];
  certifications: Certification[];
}

export interface AboutInput {
  fullName: string;
  profileMd: string;
  location: string;
  contactEmail: string;
  avatarAssetId?: string;
  seoTitle?: string;
  seoDescription?: string;
}

// --- config ---
export const getSiteConfig = () => apiRequest<SiteConfig>('/config');
export const updateSiteConfig = (input: SiteConfig) =>
  apiRequest<SiteConfig>('/admin/config', { method: 'PUT', body: input });

// --- maintenance mode (deploy switch, separate from the config form) ---
export interface MaintenanceState {
  enabled: boolean;
}

export const getMaintenance = () => apiRequest<MaintenanceState>('/maintenance');
export const updateMaintenance = (enabled: boolean) =>
  apiRequest<MaintenanceState>('/admin/maintenance', { method: 'PUT', body: { enabled } });

// --- about ---
export const getAbout = () => apiRequest<AboutData>('/admin/about');
export const updateAbout = (input: AboutInput) =>
  apiRequest<AboutData['about']>('/admin/about', { method: 'PUT', body: input });

// --- CV collections (generic over the three entity kinds) ---
export type CvKind = 'positions' | 'education' | 'certifications';

export const createCvEntry = <T>(kind: CvKind, input: unknown) =>
  apiRequest<T>(`/admin/${kind}`, { method: 'POST', body: input });
export const updateCvEntry = <T>(kind: CvKind, id: string, input: unknown) =>
  apiRequest<T>(`/admin/${kind}/${id}`, { method: 'PUT', body: input });
export const deleteCvEntry = (kind: CvKind, id: string) =>
  apiRequest<void>(`/admin/${kind}/${id}`, { method: 'DELETE' });

// --- account ---
/**
 * Changing the password revokes the old session server-side, so the response
 * carries a replacement access token (and rotates the refresh cookie). Storing
 * it keeps this tab signed in; any other tab or device holding the old tokens
 * is logged out.
 */
export const changePassword = async (currentPassword: string, newPassword: string) => {
  const { accessToken } = await apiRequest<{ accessToken: string }>('/admin/password', {
    method: 'PUT',
    body: { currentPassword, newPassword },
  });
  setAccessToken(accessToken);
};
