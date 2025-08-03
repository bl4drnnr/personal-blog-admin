import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { ChangelogService } from '@services/changelog.service';
import { UpdateChangelogPagePayload } from '@payloads/update-changelog-page.interface';

@Component({
  selector: 'page-changelog-settings',
  templateUrl: './changelog-settings.component.html',
  styleUrls: ['./changelog-settings.component.scss']
})
export class ChangelogSettingsComponent
  extends BaseAdminComponent
  implements OnInit
{
  // Footer Configuration
  footerText = '';

  // Hero Section
  heroTitle = '';
  heroImageMainId: string | null = null;
  heroImageSecondaryId: string | null = null;
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
  ogImageId: string | null = null;

  // Structured Data (JSON)
  structuredDataJson = '';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private changelogService: ChangelogService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    // In a real implementation, you would load current page settings here
    // For now, we'll just initialize with empty values
    this.loadPageSettings();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Changelog Settings';
  }

  private loadPageSettings(): void {
    this.changelogService.getChangelogPageSettings().subscribe({
      next: (response) => {
        // Populate form fields with existing data
        this.footerText = response.footerText || '';
        this.heroTitle = response.heroTitle || '';
        this.heroImageMainId = response.heroImageMainId || null;
        this.heroImageSecondaryId = response.heroImageSecondaryId || null;
        this.heroImageMainAlt = response.heroImageMainAlt || '';
        this.heroImageSecondaryAlt = response.heroImageSecondaryAlt || '';
        this.logoText = response.logoText || '';
        this.breadcrumbText = response.breadcrumbText || '';
        this.metaTitle = response.metaTitle || '';
        this.metaDescription = response.metaDescription || '';
        this.metaKeywords = response.metaKeywords || '';
        this.ogTitle = response.ogTitle || '';
        this.ogDescription = response.ogDescription || '';
        this.ogImageId = response.ogImageId || null;
        this.structuredDataJson = response.structuredData
          ? JSON.stringify(response.structuredData, null, 2)
          : '';

        console.log('Page settings loaded successfully');
      },
      error: (error) => {
        console.error('Error loading page settings:', error);
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
        console.error('Invalid JSON in structured data:', error);
        alert('Invalid JSON format in structured data field');
        return;
      }
    }

    const payload: UpdateChangelogPagePayload = {
      footerText: this.footerText || undefined,
      heroTitle: this.heroTitle || undefined,
      heroImageMainId: this.heroImageMainId || undefined,
      heroImageSecondaryId: this.heroImageSecondaryId || undefined,
      heroImageMainAlt: this.heroImageMainAlt || undefined,
      heroImageSecondaryAlt: this.heroImageSecondaryAlt || undefined,
      logoText: this.logoText || undefined,
      breadcrumbText: this.breadcrumbText || undefined,
      metaTitle: this.metaTitle || undefined,
      metaDescription: this.metaDescription || undefined,
      metaKeywords: this.metaKeywords || undefined,
      ogTitle: this.ogTitle || undefined,
      ogDescription: this.ogDescription || undefined,
      ogImageId: this.ogImageId || undefined,
      structuredData: structuredData
    };

    this.changelogService.updateChangelogPage(payload).subscribe({
      next: () => {
        alert('Changelog page settings updated successfully!');
      },
      error: () => {
        alert('Error updating page settings. Please try again.');
      }
    });
  }

  resetForm(): void {
    this.footerText = '';
    this.heroTitle = '';
    this.heroImageMainId = null;
    this.heroImageSecondaryId = null;
    this.heroImageMainAlt = '';
    this.heroImageSecondaryAlt = '';
    this.logoText = '';
    this.breadcrumbText = '';
    this.metaTitle = '';
    this.metaDescription = '';
    this.metaKeywords = '';
    this.ogTitle = '';
    this.ogDescription = '';
    this.ogImageId = null;
    this.structuredDataJson = '';
    this.loadPageSettings();
  }
}
