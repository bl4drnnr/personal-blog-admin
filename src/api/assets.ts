import { apiRequest } from './client';
import type { Asset, AssetList } from './types';

export function listAssets(params: {
  search?: string;
  page: number;
  per: number;
}): Promise<AssetList> {
  const query = new URLSearchParams({ page: String(params.page), per: String(params.per) });
  if (params.search) {
    query.set('search', params.search);
  }
  return apiRequest<AssetList>(`/admin/assets?${query}`);
}

export function uploadAsset(file: File, alt: string): Promise<Asset> {
  const formData = new FormData();
  formData.append('file', file);
  if (alt) {
    formData.append('alt', alt);
  }
  return apiRequest<Asset>('/admin/assets', { method: 'POST', formData });
}

export function deleteAsset(id: string): Promise<void> {
  return apiRequest<void>(`/admin/assets/${id}`, { method: 'DELETE' });
}
