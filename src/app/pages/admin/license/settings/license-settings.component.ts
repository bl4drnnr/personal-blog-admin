import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { LicenseService } from '@services/license.service';
import { LicensePageData } from '@interfaces/license/license-page-data.interface';
import { StaticAssetsService } from '@services/static-assets.service';
import { StaticAsset } from '@payloads/static-asset.interface';

@Component({
  selector: 'page-license-settings',
  templateUrl: './license-settings.component.html',
  styleUrls: ['./license-settings.component.scss']
})
export class LicenseSettingsComponent extends BaseAdminComponent implements OnInit {
  licenseData: LicensePageData = {};

  // Form fields
  title = '';
  licenseDate = '';
  paragraphs: string[] = [];
  paragraphInput = '';
  additionalInfoTitle = '';
  additionalInfoParagraphs: string[] = [];
  additionalInfoInput = '';
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
    private licenseService: LicenseService,
    private staticAssetsService: StaticAssetsService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadLicenseData();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | License Settings';
  }

  loadLicenseData(): void {
    this.licenseService.getLicensePageDataAdmin().subscribe({
      next: (response) => {
        // The admin endpoint returns flat data structure with IDs
        this.licenseData = response;
        this.populateForm();
      },
      error: (error) => {
        console.error('Error loading license data:', error);
      }
    });
  }

  populateForm(): void {
    this.title = this.licenseData.title || '';
    this.licenseDate = this.licenseData.licenseDate || '';
    this.paragraphs = [...(this.licenseData.paragraphs || [])];
    this.additionalInfoTitle = this.licenseData.additionalInfoTitle || '';
    this.additionalInfoParagraphs = [
      ...(this.licenseData.additionalInfoParagraphs || [])
    ];
    this.footerText = this.licenseData.footerText || '';

    // Layout fields
    this.logoText = this.licenseData.logoText || '';
    this.breadcrumbText = this.licenseData.breadcrumbText || '';
    this.heroTitle = this.licenseData.heroTitle || '';
    this.heroImageMainId = this.licenseData.heroImageMainId || '';
    this.heroImageSecondaryId = this.licenseData.heroImageSecondaryId || '';
    this.heroImageMainAlt = this.licenseData.heroImageMainAlt || '';
    this.heroImageSecondaryAlt = this.licenseData.heroImageSecondaryAlt || '';

    // SEO fields
    this.metaTitle = this.licenseData.metaTitle || '';
    this.metaDescription = this.licenseData.metaDescription || '';
    this.metaKeywords = this.licenseData.metaKeywords || '';
    this.ogTitle = this.licenseData.ogTitle || '';
    this.ogDescription = this.licenseData.ogDescription || '';
    this.ogImageId = this.licenseData.ogImageId || '';
    this.structuredDataStr = this.licenseData.structuredData
      ? JSON.stringify(this.licenseData.structuredData, null, 2)
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

  // Paragraph management
  addParagraph(): void {
    const paragraph = this.paragraphInput.trim();
    if (paragraph) {
      this.paragraphs.push(paragraph);
      this.paragraphInput = '';
    }
  }

  removeParagraph(index: number): void {
    this.paragraphs.splice(index, 1);
  }

  // Additional info paragraph management
  addAdditionalInfoParagraph(): void {
    const paragraph = this.additionalInfoInput.trim();
    if (paragraph) {
      this.additionalInfoParagraphs.push(paragraph);
      this.additionalInfoInput = '';
    }
  }

  removeAdditionalInfoParagraph(index: number): void {
    this.additionalInfoParagraphs.splice(index, 1);
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

  saveLicenseSettings(): void {
    let structuredData: object | undefined;
    try {
      structuredData = this.structuredDataStr
        ? JSON.parse(this.structuredDataStr)
        : undefined;
    } catch (error) {
      alert('Invalid JSON in structured data field');
      return;
    }

    const payload: LicensePageData = {
      title: this.title || undefined,
      licenseDate: this.licenseDate || undefined,
      paragraphs: this.paragraphs.length > 0 ? this.paragraphs : undefined,
      additionalInfoTitle: this.additionalInfoTitle || undefined,
      additionalInfoParagraphs:
        this.additionalInfoParagraphs.length > 0
          ? this.additionalInfoParagraphs
          : undefined,
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

    this.licenseService.updateLicensePage(payload).subscribe({
      next: () => {
        alert('License settings saved successfully!');
        this.loadLicenseData();
      },
      error: (error) => {
        console.error('Error saving license settings:', error);
        alert('Error saving license settings. Please try again.');
      }
    });
  }
}
