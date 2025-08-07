import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { AboutService } from '@services/about.service';
import { AboutPageData } from '@interfaces/about/about-page-data.interface';

@Component({
  selector: 'page-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent extends BaseAdminComponent implements OnInit {
  // About Page Content
  title = '';
  content = '';
  footerText = '';

  // Hero Section
  heroTitle = '';
  heroImageMainId: string = '';
  heroImageSecondaryId: string = '';
  heroImageMainAlt = '';
  heroImageSecondaryAlt = '';

  // Navigation
  logoText = '';
  breadcrumbText = '';

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

  // About page ID for updates
  aboutPageId: string = '';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private aboutService: AboutService
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
    return 'Personal Blog | About Page Settings';
  }

  private loadPageSettings(): void {
    this.aboutService.getAboutPageSettings().subscribe({
      next: (response: AboutPageData) => {
        // Populate form fields with existing data - now matches interface directly
        this.aboutPageId = response.id;
        this.title = response.title;
        this.content = response.content;
        this.footerText = response.footerText;
        this.heroTitle = response.heroTitle;
        this.heroImageMainId = response.heroImageMainId;
        this.heroImageSecondaryId = response.heroImageSecondaryId;
        this.heroImageMainAlt = response.heroImageMainAlt;
        this.heroImageSecondaryAlt = response.heroImageSecondaryAlt;
        this.logoText = response.logoText;
        this.breadcrumbText = response.breadcrumbText;
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
        console.error('Error loading about page settings:', error);
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

    const payload: AboutPageData = {
      id: this.aboutPageId,
      title: this.title,
      content: this.content,
      footerText: this.footerText,
      heroTitle: this.heroTitle,
      heroImageMainId: this.heroImageMainId,
      heroImageSecondaryId: this.heroImageSecondaryId,
      heroImageMainAlt: this.heroImageMainAlt,
      heroImageSecondaryAlt: this.heroImageSecondaryAlt,
      logoText: this.logoText,
      breadcrumbText: this.breadcrumbText,
      metaTitle: this.metaTitle,
      metaDescription: this.metaDescription,
      metaKeywords: this.metaKeywords,
      ogTitle: this.ogTitle,
      ogDescription: this.ogDescription,
      ogImageId: this.ogImageId,
      structuredData: structuredData
    };

    const operation = this.aboutPageId
      ? this.aboutService.updateAboutPage(this.aboutPageId, payload)
      : this.aboutService.createAboutPage(payload);

    operation.subscribe({
      next: (response) => {
        alert('About page settings saved successfully!');

        // Update ID if this was a create operation
        if (!this.aboutPageId && response.aboutPage.id) {
          this.aboutPageId = response.aboutPage.id;
        }
      },
      error: () => {
        alert('Error saving about page settings. Please try again.');
      }
    });
  }

  resetForm(): void {
    this.title = '';
    this.content = '';
    this.footerText = '';
    this.heroTitle = '';
    this.heroImageMainId = '';
    this.heroImageSecondaryId = '';
    this.heroImageMainAlt = '';
    this.heroImageSecondaryAlt = '';
    this.logoText = '';
    this.breadcrumbText = '';
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
