export interface ChangelogEntryResponse {
  id: string;
  changelogPageId: string;
  version: string;
  date: string;
  title: string;
  description: string;
  changes: string[];
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
