import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { PagesService } from '@shared/services/pages.service';
import { GlobalMessageService } from '@shared/global-components-services/global-message.service';
import {
  ContactPageData,
  ContactTileData
} from '@interfaces/pages/contact-page-data.interface';

@Component({
  selector: 'page-contact-page-management',
  templateUrl: './contact-page-management.component.html',
  styleUrls: ['./contact-page-management.component.scss']
})
export class ContactPageManagementComponent
  extends BaseAdminComponent
  implements OnInit
{
  contactPageData: ContactPageData | null = null;
  contactTiles: ContactTileData[] = [];

  // Tile form fields
  editingTileId: string | null = null;
  isAddingTile = false;
  tileForm = {
    title: '',
    content: '',
    link: '',
    iconAssetId: '',
    sortOrder: 1
  };

  // Form fields
  title = '';
  subtitle = '';
  description = '';
  footerText = '';
  heroImageMainId = '';
  heroImageSecondaryId = '';
  heroImageMainAlt = '';
  heroImageSecondaryAlt = '';
  logoText = '';
  breadcrumbText = '';
  heroTitle = '';
  heroDesc = '';
  carouselWords = '';
  submitButtonText = '';
  successMessage = '';
  errorMessage = '';
  metaTitle = '';
  metaDescription = '';
  metaKeywords = '';
  ogTitle = '';
  ogDescription = '';
  ogImageId = '';
  structuredData = '';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private pagesService: PagesService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadContactPageData();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Contact Page Management';
  }

  private loadContactPageData(): void {
    this.pagesService.getAdminContactPageData().subscribe({
      next: (data: ContactPageData) => {
        this.contactPageData = data;
        this.populateForm(data);
      },
      error: (error) => {
        console.error('Error loading contact page data:', error);
        this.globalMessageService.handle({
          message: 'Failed to load contact page data. Please try again.',
          isError: true
        });
      }
    });
  }

  private populateForm(data: ContactPageData): void {
    // Basic fields
    this.title = data.title || '';
    this.subtitle = data.subtitle || '';
    this.description = data.description || '';
    this.footerText = data.footerText || '';
    this.logoText = data.logoText || '';
    this.breadcrumbText = data.breadcrumbText || '';
    this.heroTitle = data.heroTitle || '';
    this.heroDesc = data.heroDesc || '';
    this.carouselWords = data.carouselWords || '';
    this.submitButtonText = data.submitButtonText || '';
    this.successMessage = data.successMessage || '';
    this.errorMessage = data.errorMessage || '';

    // Image fields
    this.heroImageMainId = data.heroImageMainId || '';
    this.heroImageSecondaryId = data.heroImageSecondaryId || '';
    this.heroImageMainAlt = data.heroImageMainAlt || '';
    this.heroImageSecondaryAlt = data.heroImageSecondaryAlt || '';

    // SEO fields
    this.metaTitle = data.metaTitle || '';
    this.metaDescription = data.metaDescription || '';
    this.metaKeywords = data.metaKeywords || '';
    this.ogTitle = data.ogTitle || '';
    this.ogDescription = data.ogDescription || '';
    this.ogImageId = data.ogImageId || '';
    this.structuredData = data.structuredData
      ? JSON.stringify(data.structuredData, null, 2)
      : '';

    // Contact tiles
    this.contactTiles = data.contactTiles || [];
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const updateData: any = {
        title: this.title,
        subtitle: this.subtitle,
        description: this.description,
        footerText: this.footerText,
        heroImageMainId: this.heroImageMainId,
        heroImageSecondaryId: this.heroImageSecondaryId,
        heroImageMainAlt: this.heroImageMainAlt,
        heroImageSecondaryAlt: this.heroImageSecondaryAlt,
        logoText: this.logoText,
        breadcrumbText: this.breadcrumbText,
        heroTitle: this.heroTitle,
        heroDesc: this.heroDesc,
        carouselWords: this.carouselWords,
        submitButtonText: this.submitButtonText,
        successMessage: this.successMessage,
        errorMessage: this.errorMessage,
        metaTitle: this.metaTitle,
        metaDescription: this.metaDescription,
        metaKeywords: this.metaKeywords,
        ogTitle: this.ogTitle,
        ogDescription: this.ogDescription,
        ogImageId: this.ogImageId
      };

      // Parse structured data if it's provided
      if (this.structuredData && this.structuredData.trim()) {
        try {
          updateData.structuredData = JSON.parse(this.structuredData);
        } catch (error) {
          this.globalMessageService.handle({
            message: 'Invalid JSON format in structured data field.',
            isError: true
          });
          return;
        }
      }

      this.pagesService.updateContactPage(updateData).subscribe({
        next: () => {
          this.globalMessageService.handle({
            message: 'Contact page updated successfully!',
            isError: false
          });
          this.loadContactPageData(); // Reload to get fresh data
        },
        error: (error) => {
          console.error('Error updating contact page:', error);
          this.globalMessageService.handle({
            message: 'Failed to update contact page. Please try again.',
            isError: true
          });
        }
      });
    }
  }

  isFormValid(): boolean {
    // Only require title field
    return this.title.trim().length > 0;
  }

  onReset(): void {
    if (this.contactPageData) {
      this.populateForm(this.contactPageData);
      this.globalMessageService.handle({
        message: 'Form reset to original values.',
        isError: false
      });
    }
  }

  // Contact Tiles Management Methods
  startAddTile(): void {
    this.isAddingTile = true;
    this.editingTileId = null;
    this.tileForm = {
      title: '',
      content: '',
      link: '',
      iconAssetId: '',
      sortOrder: this.contactTiles.length + 1
    };
  }

  startEditTile(tile: ContactTileData): void {
    this.editingTileId = tile.id || null;
    this.isAddingTile = false;
    this.tileForm = {
      title: tile.title,
      content: tile.content,
      link: tile.link,
      iconAssetId: tile.iconAssetId || '',
      sortOrder: tile.sortOrder
    };
  }

  cancelTileForm(): void {
    this.isAddingTile = false;
    this.editingTileId = null;
    this.tileForm = {
      title: '',
      content: '',
      link: '',
      iconAssetId: '',
      sortOrder: 1
    };
  }

  saveTile(): void {
    if (!this.isTileFormValid()) {
      this.globalMessageService.handle({
        message: 'Please fill in all required tile fields.',
        isError: true
      });
      return;
    }

    if (this.isAddingTile) {
      this.createTile();
    } else if (this.editingTileId) {
      this.updateTile();
    }
  }

  private createTile(): void {
    this.pagesService.createContactTile(this.tileForm).subscribe({
      next: () => {
        this.globalMessageService.handle({
          message: 'Contact tile created successfully!',
          isError: false
        });
        this.loadContactPageData();
        this.cancelTileForm();
      },
      error: (error) => {
        console.error('Error creating contact tile:', error);
        this.globalMessageService.handle({
          message: 'Failed to create contact tile. Please try again.',
          isError: true
        });
      }
    });
  }

  private updateTile(): void {
    if (!this.editingTileId) return;

    this.pagesService
      .updateContactTile({ ...this.tileForm, id: this.editingTileId })
      .subscribe({
        next: () => {
          this.globalMessageService.handle({
            message: 'Contact tile updated successfully!',
            isError: false
          });
          this.loadContactPageData();
          this.cancelTileForm();
        },
        error: (error) => {
          console.error('Error updating contact tile:', error);
          this.globalMessageService.handle({
            message: 'Failed to update contact tile. Please try again.',
            isError: true
          });
        }
      });
  }

  deleteTile(tileId: string): void {
    if (!confirm('Are you sure you want to delete this contact tile?')) {
      return;
    }

    this.pagesService.deleteContactTile(tileId).subscribe({
      next: () => {
        this.globalMessageService.handle({
          message: 'Contact tile deleted successfully!',
          isError: false
        });
        this.loadContactPageData();
      },
      error: (error) => {
        console.error('Error deleting contact tile:', error);
        this.globalMessageService.handle({
          message: 'Failed to delete contact tile. Please try again.',
          isError: true
        });
      }
    });
  }

  moveTileUp(index: number): void {
    if (index > 0) {
      const tileIds = this.contactTiles.map((tile) => tile.id!);
      [tileIds[index - 1], tileIds[index]] = [tileIds[index], tileIds[index - 1]];
      this.reorderTiles(tileIds);
    }
  }

  moveTileDown(index: number): void {
    if (index < this.contactTiles.length - 1) {
      const tileIds = this.contactTiles.map((tile) => tile.id!);
      [tileIds[index], tileIds[index + 1]] = [tileIds[index + 1], tileIds[index]];
      this.reorderTiles(tileIds);
    }
  }

  private reorderTiles(tileIds: string[]): void {
    this.pagesService.reorderContactTiles(tileIds).subscribe({
      next: (updatedTiles) => {
        this.contactTiles = updatedTiles;
        this.globalMessageService.handle({
          message: 'Contact tiles reordered successfully!',
          isError: false
        });
      },
      error: (error) => {
        console.error('Error reordering contact tiles:', error);
        this.globalMessageService.handle({
          message: 'Failed to reorder contact tiles. Please try again.',
          isError: true
        });
      }
    });
  }

  protected isTileFormValid(): boolean {
    return (
      this.tileForm.title.trim().length > 0 &&
      this.tileForm.content.trim().length > 0 &&
      this.tileForm.link.trim().length > 0 &&
      this.tileForm.iconAssetId.trim().length > 0
    );
  }
}
