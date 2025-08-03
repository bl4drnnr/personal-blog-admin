import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { PrivacyService } from '@services/privacy.service';
import { PrivacyPageData } from '@interfaces/privacy/privacy-page-data.interface';
import { StaticAssetsService } from '@services/static-assets.service';
import { StaticAsset } from '@payloads/static-asset.interface';

@Component({
  selector: 'page-privacy-settings',
  templateUrl: './privacy-settings.component.html',
  styleUrls: ['./privacy-settings.component.scss']
})
export class PrivacySettingsComponent extends BaseAdminComponent implements OnInit {
  privacyData: PrivacyPageData = {};
  isLoading = true;

  // Form fields
  title = '';
  lastUpdated = '';
  cookiePolicyTitle = '';
  footerText = '';

  // Layout fields
  logoText = '';
  breadcrumbText = '';
  heroTitle = '';
  heroImageMainId = '';
  heroImageSecondaryId = '';
  heroImageMainAlt = '';
  heroImageSecondaryAlt = '';
  heroImageMainPreview = '';
  heroImageSecondaryPreview = '';

  // SEO fields
  metaTitle = '';
  metaDescription = '';
  metaKeywords = '';
  ogTitle = '';
  ogDescription = '';
  ogImageId = '';
  ogImagePreview = '';
  structuredDataStr = '';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private privacyService: PrivacyService,
    private staticAssetsService: StaticAssetsService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadPrivacyData();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Privacy Settings';
  }

  loadPrivacyData(): void {
    this.privacyService.getPrivacyPageDataAdmin().subscribe({
      next: (response) => {
        this.privacyData = response;
        this.populateForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading privacy data:', error);
        this.isLoading = false;
      }
    });
  }

  populateForm(): void {
    this.title = this.privacyData.title || '';
    this.lastUpdated = this.privacyData.lastUpdated || '';
    this.cookiePolicyTitle = this.privacyData.cookiePolicyTitle || '';
    this.footerText = this.privacyData.footerText || '';

    // Layout fields
    this.logoText = this.privacyData.logoText || '';
    this.breadcrumbText = this.privacyData.breadcrumbText || '';
    this.heroTitle = this.privacyData.heroTitle || '';
    this.heroImageMainId = this.privacyData.heroImageMainId || '';
    this.heroImageSecondaryId = this.privacyData.heroImageSecondaryId || '';
    this.heroImageMainAlt = this.privacyData.heroImageMainAlt || '';
    this.heroImageSecondaryAlt = this.privacyData.heroImageSecondaryAlt || '';

    // SEO fields
    this.metaTitle = this.privacyData.metaTitle || '';
    this.metaDescription = this.privacyData.metaDescription || '';
    this.metaKeywords = this.privacyData.metaKeywords || '';
    this.ogTitle = this.privacyData.ogTitle || '';
    this.ogDescription = this.privacyData.ogDescription || '';
    this.ogImageId = this.privacyData.ogImageId || '';
    this.structuredDataStr = this.privacyData.structuredData
      ? JSON.stringify(this.privacyData.structuredData, null, 2)
      : '';

    // Load image previews
    this.loadImagePreviews();
  }

  loadImagePreviews(): void {
    if (this.heroImageMainId) {
      this.staticAssetsService.findById(this.heroImageMainId).subscribe({
        next: (asset) => (this.heroImageMainPreview = asset.s3Url),
        error: () => (this.heroImageMainPreview = '')
      });
    }

    if (this.heroImageSecondaryId) {
      this.staticAssetsService.findById(this.heroImageSecondaryId).subscribe({
        next: (asset) => (this.heroImageSecondaryPreview = asset.s3Url),
        error: () => (this.heroImageSecondaryPreview = '')
      });
    }

    if (this.ogImageId) {
      this.staticAssetsService.findById(this.ogImageId).subscribe({
        next: (asset) => (this.ogImagePreview = asset.s3Url),
        error: () => (this.ogImagePreview = '')
      });
    }
  }

  // Asset selection handlers
  onHeroMainAssetSelected(asset: StaticAsset | null): void {
    if (asset) {
      this.heroImageMainId = asset.id;
      this.heroImageMainPreview = asset.s3Url;
    } else {
      this.heroImageMainId = '';
      this.heroImageMainPreview = '';
    }
  }

  onHeroSecondaryAssetSelected(asset: StaticAsset | null): void {
    if (asset) {
      this.heroImageSecondaryId = asset.id;
      this.heroImageSecondaryPreview = asset.s3Url;
    } else {
      this.heroImageSecondaryId = '';
      this.heroImageSecondaryPreview = '';
    }
  }

  onOgImageAssetSelected(asset: StaticAsset | null): void {
    if (asset) {
      this.ogImageId = asset.id;
      this.ogImagePreview = asset.s3Url;
    } else {
      this.ogImageId = '';
      this.ogImagePreview = '';
    }
  }

  savePrivacySettings(): void {
    let structuredData: object | undefined;
    try {
      structuredData = this.structuredDataStr
        ? JSON.parse(this.structuredDataStr)
        : undefined;
    } catch (error) {
      alert('Invalid JSON in structured data field');
      return;
    }

    const payload: PrivacyPageData = {
      title: this.title || undefined,
      lastUpdated: this.lastUpdated || undefined,
      cookiePolicyTitle: this.cookiePolicyTitle || undefined,
      footerText: this.footerText || undefined,
      logoText: this.logoText || undefined,
      breadcrumbText: this.breadcrumbText || undefined,
      heroTitle: this.heroTitle || undefined,
      heroImageMainId: this.heroImageMainId || undefined,
      heroImageSecondaryId: this.heroImageSecondaryId || undefined,
      heroImageMainAlt: this.heroImageMainAlt || undefined,
      heroImageSecondaryAlt: this.heroImageSecondaryAlt || undefined,
      metaTitle: this.metaTitle || undefined,
      metaDescription: this.metaDescription || undefined,
      metaKeywords: this.metaKeywords || undefined,
      ogTitle: this.ogTitle || undefined,
      ogDescription: this.ogDescription || undefined,
      ogImageId: this.ogImageId || undefined,
      structuredData: structuredData
    };

    this.privacyService.updatePrivacyPage(payload).subscribe({
      next: () => {
        alert('Privacy settings saved successfully!');
        this.loadPrivacyData();
      },
      error: (error) => {
        console.error('Error saving privacy settings:', error);
        alert('Error saving privacy settings. Please try again.');
      }
    });
  }
}
