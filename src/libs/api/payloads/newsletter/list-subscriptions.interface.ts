export interface ListSubscriptionsPayload {
  query?: string;
  page: string;
  pageSize: string;
  order: string;
  orderBy: string;
  status?: string; // 'confirmed', 'unconfirmed', or empty for all
}
