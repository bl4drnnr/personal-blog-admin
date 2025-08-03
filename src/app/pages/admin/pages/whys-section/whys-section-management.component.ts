import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { WhysSectionService } from '@shared/services/whys-section.service';
import {
  WhysSection,
  CreateWhysSectionData,
  UpdateWhysSectionData,
  WhyBlock,
  FeatureItem
} from '@interfaces/whys-section/whys-section.interface';
import { GlobalMessageService } from '@shared/global-components-services/global-message.service';

@Component({
  selector: 'app-whys-section-management',
  templateUrl: './whys-section-management.component.html',
  styleUrls: ['./whys-section-management.component.scss']
})
export class WhysSectionManagementComponent
  extends BaseAdminComponent
  implements OnInit
{
  whysSections: WhysSection[] = [];

  // Form state
  showAddForm = false;
  editingWhysSection: WhysSection | null = null;

  // Form fields
  title = '';
  whyBlocks: WhyBlock[] = [];
  features: FeatureItem[] = [];
  featured = false;

  // Temporary fields for adding new items
  newWhyBlockText = '';
  newFeatureTitle = '';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private whysSectionService: WhysSectionService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadWhysSections();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Whys Section Management';
  }

  loadWhysSections(): void {
    this.whysSectionService.getWhysSections().subscribe({
      next: (sections) => {
        this.whysSections = sections;
      },
      error: (error) => {
        console.error('Error loading whys sections:', error);
        this.globalMessageService.handle({
          message: 'Failed to load whys sections. Please try again.',
          isError: true
        });
      }
    });
  }

  showAddDialog(): void {
    this.resetForm();
    this.showAddForm = true;
    this.editingWhysSection = null;
  }

  showEditDialog(whysSection: WhysSection): void {
    this.populateForm(whysSection);
    this.showAddForm = true;
    this.editingWhysSection = whysSection;
  }

  hideDialog(): void {
    this.showAddForm = false;
    this.editingWhysSection = null;
    this.resetForm();
  }

  resetForm(): void {
    this.title = '';
    this.whyBlocks = [];
    this.features = [];
    this.featured = false;
    this.newWhyBlockText = '';
    this.newFeatureTitle = '';
  }

  populateForm(whysSection: WhysSection): void {
    this.title = whysSection.title;
    this.whyBlocks = [...whysSection.whyBlocks];
    this.features = [...whysSection.features];
    this.featured = whysSection.featured;
  }

  addWhyBlock(): void {
    if (this.newWhyBlockText.trim()) {
      this.whyBlocks.push({ text: this.newWhyBlockText.trim() });
      this.newWhyBlockText = '';
    }
  }

  removeWhyBlock(index: number): void {
    this.whyBlocks.splice(index, 1);
  }

  addFeature(): void {
    if (this.newFeatureTitle.trim()) {
      this.features.push({ title: this.newFeatureTitle.trim() });
      this.newFeatureTitle = '';
    }
  }

  removeFeature(index: number): void {
    this.features.splice(index, 1);
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.globalMessageService.handle({
        message: 'Please fill in all required fields.',
        isError: true
      });
      return;
    }

    const data: CreateWhysSectionData | UpdateWhysSectionData = {
      title: this.title.trim(),
      whyBlocks: this.whyBlocks,
      features: this.features,
      featured: this.featured
    };

    if (this.editingWhysSection) {
      this.updateWhysSection(data as UpdateWhysSectionData);
    } else {
      this.createWhysSection(data as CreateWhysSectionData);
    }
  }

  createWhysSection(data: CreateWhysSectionData): void {
    this.whysSectionService.createWhysSection(data).subscribe({
      next: () => {
        this.globalMessageService.handle({
          message: 'Whys section created successfully!',
          isError: false
        });
        this.hideDialog();
        this.loadWhysSections();
      },
      error: (error) => {
        console.error('Error creating whys section:', error);
        this.globalMessageService.handle({
          message: 'Failed to create whys section. Please try again.',
          isError: true
        });
      }
    });
  }

  updateWhysSection(data: UpdateWhysSectionData): void {
    if (!this.editingWhysSection) return;

    this.whysSectionService
      .updateWhysSection(this.editingWhysSection.id, data)
      .subscribe({
        next: () => {
          this.globalMessageService.handle({
            message: 'Whys section updated successfully!',
            isError: false
          });
          this.hideDialog();
          this.loadWhysSections();
        },
        error: (error) => {
          console.error('Error updating whys section:', error);
          this.globalMessageService.handle({
            message: 'Failed to update whys section. Please try again.',
            isError: true
          });
        }
      });
  }

  onDelete(whysSection: WhysSection): void {
    if (
      confirm(
        `Are you sure you want to delete the whys section: "${whysSection.title}"?`
      )
    ) {
      this.whysSectionService.deleteWhysSection(whysSection.id).subscribe({
        next: () => {
          this.globalMessageService.handle({
            message: 'Whys section deleted successfully!',
            isError: false
          });
          this.loadWhysSections();
        },
        error: (error) => {
          console.error('Error deleting whys section:', error);
          this.globalMessageService.handle({
            message: 'Failed to delete whys section. Please try again.',
            isError: true
          });
        }
      });
    }
  }

  onToggleFeatured(whysSection: WhysSection): void {
    const data: UpdateWhysSectionData = {
      featured: !whysSection.featured
    };

    this.whysSectionService.updateWhysSection(whysSection.id, data).subscribe({
      next: () => {
        this.globalMessageService.handle({
          message: `Whys section ${data.featured ? 'featured' : 'unfeatured'} successfully!`,
          isError: false
        });
        this.loadWhysSections();
      },
      error: (error) => {
        console.error('Error toggling whys section featured status:', error);
        this.globalMessageService.handle({
          message:
            'Failed to update whys section featured status. Please try again.',
          isError: true
        });
      }
    });
  }

  isFormValid(): boolean {
    return (
      this.title.trim().length > 0 &&
      this.whyBlocks.length > 0 &&
      this.features.length > 0
    );
  }

  getFeaturedBadgeClass(whysSection: WhysSection): string {
    return whysSection.featured ? 'badge-featured' : 'badge-normal';
  }

  trackByWhysSection(index: number, whysSection: WhysSection): string {
    return whysSection.id;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
