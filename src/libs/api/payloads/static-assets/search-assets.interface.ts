export interface SearchAssetsQuery {
  search?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
}
