export interface ListContactMessagesPayload {
  query?: string;
  page: string;
  pageSize: string;
  order: string;
  orderBy: string;
  status?: string; // 'read', 'unread', or empty for all
}
