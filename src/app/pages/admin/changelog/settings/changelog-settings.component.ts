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
  loading = false;

  // Basic Page Content
  title = '';
  content = '';
  footerText = '';

  // Hero Section
  heroTitle = '';
  heroImageMain = '';
  heroImageSecondary = '';
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
  ogImage = '';

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
    // This would typically load existing page settings from an API
    // For now, we'll leave the form empty for new configuration
    console.log('Loading page settings...');
  }

  savePageSettings(): void {
    this.loading = true;

    // Parse structured data JSON if provided
    let structuredData = null;
    if (this.structuredDataJson && this.structuredDataJson.trim()) {
      try {
        structuredData = JSON.parse(this.structuredDataJson);
      } catch (error) {
        console.error('Invalid JSON in structured data:', error);
        alert('Invalid JSON format in structured data field');
        this.loading = false;
        return;
      }
    }

    const payload: UpdateChangelogPagePayload = {
      title: this.title || undefined,
      content: this.content || undefined,
      footerText: this.footerText || undefined,
      heroTitle: this.heroTitle || undefined,
      heroImageMain: this.heroImageMain || undefined,
      heroImageSecondary: this.heroImageSecondary || undefined,
      heroImageMainAlt: this.heroImageMainAlt || undefined,
      heroImageSecondaryAlt: this.heroImageSecondaryAlt || undefined,
      logoText: this.logoText || undefined,
      breadcrumbText: this.breadcrumbText || undefined,
      metaTitle: this.metaTitle || undefined,
      metaDescription: this.metaDescription || undefined,
      metaKeywords: this.metaKeywords || undefined,
      ogTitle: this.ogTitle || undefined,
      ogDescription: this.ogDescription || undefined,
      ogImage: this.ogImage || undefined,
      structuredData: structuredData
    };

    this.changelogService.updateChangelogPage(payload).subscribe({
      next: (response) => {
        console.log('Page settings updated:', response);
        alert('Changelog page settings updated successfully!');
        this.loading = false;
      },
      error: (error) => {
        console.error('Error updating page settings:', error);
        alert('Error updating page settings. Please try again.');
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.title = '';
    this.content = '';
    this.footerText = '';
    this.heroTitle = '';
    this.heroImageMain = '';
    this.heroImageSecondary = '';
    this.heroImageMainAlt = '';
    this.heroImageSecondaryAlt = '';
    this.logoText = '';
    this.breadcrumbText = '';
    this.metaTitle = '';
    this.metaDescription = '';
    this.metaKeywords = '';
    this.ogTitle = '';
    this.ogDescription = '';
    this.ogImage = '';
    this.structuredDataJson = '';
    this.loadPageSettings();
  }
}
