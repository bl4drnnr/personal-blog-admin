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
