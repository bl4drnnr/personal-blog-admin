import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { PrivacyService } from '@services/privacy.service';
import { PrivacySectionData } from '@interfaces/privacy/privacy-section-data.interface';

@Component({
  selector: 'page-privacy-sections',
  templateUrl: './privacy-sections.component.html',
  styleUrls: ['./privacy-sections.component.scss']
})
export class PrivacySectionsComponent extends BaseAdminComponent implements OnInit {
  sections: PrivacySectionData[] = [];
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  editingSection: PrivacySectionData | null = null;

  // Form fields
  title = '';
  content = '';
  sortOrderStr = '0';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private privacyService: PrivacyService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadSections();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Privacy Sections';
  }

  loadSections(): void {
    this.privacyService.getPrivacySections().subscribe({
      next: (sections) => {
        this.sections = sections;
      },
      error: (error) => {
        console.error('Error loading privacy sections:', error);
      }
    });
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.editingSection = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(section: PrivacySectionData): void {
    this.modalMode = 'edit';
    this.editingSection = section;
    this.populateForm(section);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
    this.editingSection = null;
  }

  resetForm(): void {
    this.title = '';
    this.content = '';
    this.sortOrderStr = '0';
  }

  populateForm(section: PrivacySectionData): void {
    this.title = section.title;
    this.content = section.content || '';
    this.sortOrderStr = (section.sortOrder || 0).toString();
  }

  saveSection(): void {
    if (!this.title.trim()) {
      alert('Section title is required');
      return;
    }

    const payload: PrivacySectionData = {
      title: this.title.trim(),
      content: this.content.trim(),
      sortOrder: parseInt(this.sortOrderStr) || 0
    };

    if (this.modalMode === 'create') {
      this.privacyService.createPrivacySection(payload).subscribe({
        next: () => {
          this.loadSections();
          this.closeModal();
          alert('Privacy section created successfully!');
        },
        error: (error) => {
          console.error('Error creating privacy section:', error);
          alert('Error creating privacy section. Please try again.');
        }
      });
    } else {
      this.privacyService
        .updatePrivacySection(this.editingSection!.id!, payload)
        .subscribe({
          next: () => {
            this.loadSections();
            this.closeModal();
            alert('Privacy section updated successfully!');
          },
          error: (error) => {
            console.error('Error updating privacy section:', error);
            alert('Error updating privacy section. Please try again.');
          }
        });
    }
  }

  deleteSection(section: PrivacySectionData): void {
    if (
      confirm(
        `Are you sure you want to delete the privacy section "${section.title}"? This action cannot be undone.`
      )
    ) {
      this.privacyService.deletePrivacySection(section.id!).subscribe({
        next: () => {
          this.loadSections();
          alert('Privacy section deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting privacy section:', error);
          alert('Error deleting privacy section. Please try again.');
        }
      });
    }
  }

  getContentPreview(content: string): string {
    if (!content) return '';
    // Strip HTML tags for preview and limit to 150 characters
    const textOnly = content.replace(/<[^>]*>/g, '');
    return textOnly.length > 150 ? textOnly.substring(0, 150) + '...' : textOnly;
  }
}
