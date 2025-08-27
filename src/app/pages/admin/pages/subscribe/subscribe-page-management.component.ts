import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { NewslettersService } from '@shared/services/newsletters.service';
import { GlobalMessageService } from '@shared/global-components-services/global-message.service';
import { SubscribePageData } from '@interfaces/pages/subscribe-page-data.interface';

@Component({
  selector: 'page-subscribe-page-management',
  templateUrl: './subscribe-page-management.component.html',
  styleUrls: ['./subscribe-page-management.component.scss']
})
export class SubscribePageManagementComponent
  extends BaseAdminComponent
  implements OnInit
{
  subscribePageData: SubscribePageData | null = null;

  // Form fields
  title = '';
  subtitle = '';
  description = '';
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
  emailPlaceholder = '';
  privacyText = '';
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
    private newslettersService: NewslettersService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadSubscribePageData();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Subscribe Page Management';
  }

  private loadSubscribePageData(): void {
    this.newslettersService.getAdminSubscribePageData().subscribe({
      next: (data: SubscribePageData) => {
        this.subscribePageData = data;
        this.populateForm(data);
      },
      error: (error) => {
        console.error('Error loading subscribe page data:', error);
        this.globalMessageService.handle({
          message: 'Failed to load subscribe page data. Please try again.',
          isError: true
        });
      }
    });
  }

  private populateForm(data: SubscribePageData): void {
    // Basic fields
    this.title = data.title || '';
    this.subtitle = data.subtitle || '';
    this.description = data.description || '';
    this.logoText = data.logoText || '';
    this.breadcrumbText = data.breadcrumbText || '';
    this.heroTitle = data.heroTitle || '';
    this.heroDesc = data.heroDesc || '';
    this.carouselWords = data.carouselWords || '';
    this.submitButtonText = data.submitButtonText || '';
    this.successMessage = data.successMessage || '';
    this.errorMessage = data.errorMessage || '';
    this.emailPlaceholder = data.emailPlaceholder || '';
    this.privacyText = data.privacyText || '';

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
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const updateData: any = {
        title: this.title,
        subtitle: this.subtitle,
        description: this.description,
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
        emailPlaceholder: this.emailPlaceholder,
        privacyText: this.privacyText,
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

      this.newslettersService.updateSubscribePage(updateData).subscribe({
        next: () => {
          this.globalMessageService.handle({
            message: 'Subscribe page updated successfully!',
            isError: false
          });
          this.loadSubscribePageData(); // Reload to get fresh data
        },
        error: (error) => {
          console.error('Error updating subscribe page:', error);
          this.globalMessageService.handle({
            message: 'Failed to update subscribe page. Please try again.',
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
    if (this.subscribePageData) {
      this.populateForm(this.subscribePageData);
      this.globalMessageService.handle({
        message: 'Form reset to original values.',
        isError: false
      });
    }
  }
}
