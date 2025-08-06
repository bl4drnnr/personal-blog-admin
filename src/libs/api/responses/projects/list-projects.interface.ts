import { ListProjectInterface } from '@interfaces/list-project.interface';

export interface ListProjectsResponse {
  count: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  rows: Array<ListProjectInterface>;
}
