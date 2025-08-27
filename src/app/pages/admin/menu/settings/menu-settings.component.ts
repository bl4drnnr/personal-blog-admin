import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { MenuService } from '@shared/services/menu.service';
import { MenuPageData } from '@interfaces/menu/menu-page-data.interface';

@Component({
  selector: 'page-menu-settings',
  templateUrl: './menu-settings.component.html',
  styleUrls: ['./menu-settings.component.scss']
})
export class MenuSettingsComponent extends BaseAdminComponent implements OnInit {
  // Menu Page Content
  logoText = '';
  breadcrumbText = '';

  // Hero Section
  heroImageMainId: string = '';
  heroImageMainAlt = '';

  // SEO Meta Tags
  metaTitle = '';
  metaDescription = '';
  metaKeywords = '';

  // Open Graph
  ogTitle = '';
  ogDescription = '';
  ogImageId: string = '';

  // Structured Data (JSON)
  structuredDataJson = '';

  // Menu page ID for updates
  menuPageId: string = '';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private menuService: MenuService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadPageSettings();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Menu Page Settings';
  }

  private loadPageSettings(): void {
    this.menuService.getMenuPageSettings().subscribe({
      next: (response: MenuPageData) => {
        // Populate form fields with existing data
        this.menuPageId = response.id || '';
        this.logoText = response.logoText;
        this.breadcrumbText = response.breadcrumbText;
        this.heroImageMainId = response.heroImageMainId;
        this.heroImageMainAlt = response.heroImageMainAlt;
        this.metaTitle = response.metaTitle;
        this.metaDescription = response.metaDescription;
        this.metaKeywords = response.metaKeywords;
        this.ogTitle = response.ogTitle;
        this.ogDescription = response.ogDescription;
        this.ogImageId = response.ogImageId;
        this.structuredDataJson = response.structuredData
          ? JSON.stringify(response.structuredData, null, 2)
          : '';
      },
      error: (error) => {
        console.error('Error loading menu page settings:', error);
        // Keep form empty if page settings don't exist yet
      }
    });
  }

  savePageSettings(): void {
    // Parse structured data JSON if provided
    let structuredData = null;
    if (this.structuredDataJson && this.structuredDataJson.trim()) {
      try {
        structuredData = JSON.parse(this.structuredDataJson);
      } catch (error) {
        alert('Invalid JSON format in structured data field');
        return;
      }
    }

    const payload: MenuPageData = {
      id: this.menuPageId,
      logoText: this.logoText,
      breadcrumbText: this.breadcrumbText,
      heroImageMainId: this.heroImageMainId,
      heroImageMainAlt: this.heroImageMainAlt,
      metaTitle: this.metaTitle,
      metaDescription: this.metaDescription,
      metaKeywords: this.metaKeywords,
      ogTitle: this.ogTitle,
      ogDescription: this.ogDescription,
      ogImageId: this.ogImageId,
      structuredData: structuredData
    };

    const operation = this.menuPageId
      ? this.menuService.updateMenuPage(this.menuPageId, payload)
      : this.menuService.createMenuPage(payload);

    operation.subscribe({
      next: (response) => {
        alert('Menu page settings saved successfully!');

        // Update ID if this was a create operation
        if (!this.menuPageId && response.menuPage.id) {
          this.menuPageId = response.menuPage.id;
        }
      },
      error: () => {
        alert('Error saving menu page settings. Please try again.');
      }
    });
  }

  resetForm(): void {
    this.logoText = '';
    this.breadcrumbText = '';
    this.heroImageMainId = '';
    this.heroImageMainAlt = '';
    this.metaTitle = '';
    this.metaDescription = '';
    this.metaKeywords = '';
    this.ogTitle = '';
    this.ogDescription = '';
    this.ogImageId = '';
    this.structuredDataJson = '';
    this.loadPageSettings();
  }
}
