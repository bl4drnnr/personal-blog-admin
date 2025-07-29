import { ChangelogEntryResponse } from './changelog-entry.interface';

export interface ChangelogEntryUpdatedResponse {
  message: string;
  entry: ChangelogEntryResponse;
}
