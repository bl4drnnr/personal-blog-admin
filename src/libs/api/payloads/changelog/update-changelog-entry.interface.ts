export interface UpdateChangelogEntryPayload {
  id?: string;
  version?: string;
  date?: string;
  title?: string;
  description?: string;
  changes?: string[];
  sortOrder?: number;
}
