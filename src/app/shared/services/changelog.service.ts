import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { ChangelogEndpoint } from '@interfaces/changelog.enum';
import { CreateChangelogEntryPayload } from '@payloads/create-changelog-entry.interface';
import { UpdateChangelogEntryPayload } from '@payloads/update-changelog-entry.interface';
import { UpdateChangelogPagePayload } from '@payloads/update-changelog-page.interface';
import { ChangelogEntryCreatedResponse } from '@responses/changelog-entry-created.interface';
import { ChangelogEntryUpdatedResponse } from '@responses/changelog-entry-updated.interface';
import { ChangelogEntryDeletedResponse } from '@responses/changelog-entry-deleted.interface';
import { ChangelogPageUpdatedResponse } from '@responses/changelog-page-updated.interface';
import { ChangelogEntryResponse } from '@responses/changelog-entry.interface';

@Injectable({
  providedIn: 'root'
})
export class ChangelogService {
  constructor(private readonly apiService: ApiService) {}

  getChangelogEntries(): Observable<ChangelogEntryResponse[]> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.CHANGELOG,
      action: ChangelogEndpoint.GET_ENTRIES
    });
  }

  createChangelogEntry(
    payload: CreateChangelogEntryPayload
  ): Observable<ChangelogEntryCreatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.CHANGELOG,
      action: ChangelogEndpoint.CREATE_ENTRY,
      payload
    });
  }

  updateChangelogEntry(
    entryId: string,
    payload: UpdateChangelogEntryPayload
  ): Observable<ChangelogEntryUpdatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.CHANGELOG,
      action: ChangelogEndpoint.UPDATE_ENTRY,
      payload: { ...payload, id: entryId }
    });
  }

  deleteChangelogEntry(entryId: string): Observable<ChangelogEntryDeletedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.CHANGELOG,
      action: ChangelogEndpoint.DELETE_ENTRY,
      params: { id: entryId }
    });
  }

  updateChangelogPage(
    payload: UpdateChangelogPagePayload
  ): Observable<ChangelogPageUpdatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.CHANGELOG,
      action: ChangelogEndpoint.UPDATE_PAGE,
      payload
    });
  }
}
