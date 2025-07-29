import { ChangelogEntryResponse } from './changelog-entry.interface';

export interface ChangelogEntryCreatedResponse {
  message: string;
  entry: ChangelogEntryResponse;
}
