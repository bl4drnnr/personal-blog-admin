import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { ChangelogService } from '@services/changelog.service';
import { ChangelogEntryResponse } from '@responses/changelog-entry.interface';
import { CreateChangelogEntryPayload } from '@payloads/create-changelog-entry.interface';
import { UpdateChangelogEntryPayload } from '@payloads/update-changelog-entry.interface';
import { LoaderService } from '@shared/loader.service';

@Component({
  selector: 'page-changelog-entries',
  templateUrl: './changelog-entries.component.html',
  styleUrls: ['./changelog-entries.component.scss']
})
export class ChangelogEntriesComponent extends BaseAdminComponent implements OnInit {
  changeLogEntries: ChangelogEntryResponse[] = [];
  isEditing = false;
  editingEntryId: string | null = null;
  showForm = false;

  // Form data
  version = '';
  date = '';
  title = '';
  description = '';
  changes: string[] = [''];
  sortOrder = '0';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private changelogService: ChangelogService,
    public loaderService: LoaderService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadEntries();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Changelog Entries';
  }

  private resetForm(): void {
    this.version = '';
    this.date = '';
    this.title = '';
    this.description = '';
    this.changes = [''];
    this.sortOrder = '0';
  }

  addChange(): void {
    this.changes.push('');
  }

  removeChange(index: number): void {
    if (this.changes.length > 1) {
      this.changes.splice(index, 1);
    }
  }

  loadEntries(): void {
    this.changelogService.getChangelogEntries().subscribe({
      next: (response) => {
        this.changeLogEntries = response;
      },
      error: () => {
        this.changeLogEntries = [];
      }
    });
  }

  showCreateForm(): void {
    this.showForm = true;
    this.isEditing = false;
    this.editingEntryId = null;
    this.resetForm();
  }

  showEditForm(entry: ChangelogEntryResponse): void {
    this.showForm = true;
    this.isEditing = true;
    this.editingEntryId = entry.id;

    this.version = entry.version;
    this.date = entry.date;
    this.title = entry.title;
    this.description = entry.description;
    this.sortOrder = entry.sortOrder.toString();
    this.changes = [...entry.changes];
  }

  cancelForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.editingEntryId = null;
    this.resetForm();
  }

  saveEntry(): void {
    if (this.isFormValid()) {
      const filteredChanges = this.changes.filter((c) => c.trim());

      const payload = {
        version: this.version,
        date: this.date,
        title: this.title,
        description: this.description,
        changes: filteredChanges,
        sortOrder: parseInt(this.sortOrder) || 0
      };

      if (this.isEditing && this.editingEntryId) {
        this.updateEntry(this.editingEntryId, payload);
      } else {
        this.createEntry(payload);
      }
    }
  }

  protected isFormValid(): boolean {
    return !!(
      this.version &&
      this.date &&
      this.title &&
      this.description &&
      this.changes.some((c) => c.trim())
    );
  }

  private createEntry(payload: CreateChangelogEntryPayload): void {
    this.changelogService.createChangelogEntry(payload).subscribe({
      next: () => {
        this.loadEntries();
        this.cancelForm();
      },
      error: (error) => {
        console.error('Error creating entry:', error);
      }
    });
  }

  private updateEntry(entryId: string, payload: UpdateChangelogEntryPayload): void {
    this.changelogService.updateChangelogEntry(entryId, payload).subscribe({
      next: () => {
        this.loadEntries();
        this.cancelForm();
      },
      error: (error) => {
        console.error('Error updating entry:', error);
      }
    });
  }

  deleteEntry(entryId: string): void {
    if (confirm('Are you sure you want to delete this changelog entry?')) {
      this.changelogService.deleteChangelogEntry(entryId).subscribe({
        next: () => {
          this.loadEntries();
        },
        error: (error) => {
          console.error('Error deleting entry:', error);
        }
      });
    }
  }

  trackByEntryId(index: number, entry: ChangelogEntryResponse): string {
    return entry.id;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
