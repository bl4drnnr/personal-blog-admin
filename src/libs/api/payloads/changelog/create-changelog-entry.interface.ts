export interface CreateChangelogEntryPayload {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: string[];
  sortOrder?: number;
}
