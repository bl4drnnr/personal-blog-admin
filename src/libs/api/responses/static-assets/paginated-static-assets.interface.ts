import { StaticAsset } from '@payloads/static-asset.interface';

export interface PaginatedStaticAssetsResponse {
  assets: StaticAsset[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
