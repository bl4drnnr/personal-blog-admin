import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { PagesService } from '@shared/services/pages.service';
import { HomePageData } from '@interfaces/pages/home-page-data.interface';
import { UpdateHomePageData } from '@interfaces/pages/update-home-page-data.interface';
import { GlobalMessageService } from '@shared/global-components-services/global-message.service';

@Component({
  selector: 'app-home-page-management',
  templateUrl: './home-page-management.component.html',
  styleUrls: ['./home-page-management.component.scss']
})
export class HomePageManagementComponent
  extends BaseAdminComponent
  implements OnInit
{
  homePageData: HomePageData | null = null;

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
  marqueeLeftText = '';
  marqueeRightText = '';
  latestProjectsTitle = '';
  latestPostsTitle = '';
  whySectionTitle = '';
  faqSectionTitle = '';
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
    this.loadHomePageData();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Home Page Management';
  }

  private loadHomePageData(): void {
    this.pagesService.getAdminHomePageData().subscribe({
      next: (data: HomePageData) => {
        this.homePageData = data;
        this.populateForm(data);
      },
      error: (error) => {
        console.error('Error loading home page data:', error);
        this.globalMessageService.handle({
          message: 'Failed to load home page data. Please try again.',
          isError: true
        });
      }
    });
  }

  private populateForm(data: HomePageData): void {
    // Page Content
    this.title = data.pageContent.title || '';
    this.subtitle = data.pageContent.subtitle || '';
    this.description = data.pageContent.description || '';

    // Layout Data
    this.footerText = data.layoutData.footerText || '';
    this.heroImageMainId = data.layoutData.heroImageMainId || '';
    this.heroImageSecondaryId = data.layoutData.heroImageSecondaryId || '';
    this.heroImageMainAlt = data.layoutData.heroImageMainAlt || '';
    this.heroImageSecondaryAlt = data.layoutData.heroImageSecondaryAlt || '';
    this.logoText = data.layoutData.logoText || '';
    this.breadcrumbText = data.layoutData.breadcrumbText || '';
    this.heroTitle = data.layoutData.heroTitle || '';

    // Section Titles
    this.marqueeLeftText = data.pageContent.marqueeLeftText || '';
    this.marqueeRightText = data.pageContent.marqueeRightText || '';
    this.latestProjectsTitle = data.pageContent.latestProjectsTitle || '';
    this.latestPostsTitle = data.pageContent.latestPostsTitle || '';
    this.whySectionTitle = data.pageContent.whySectionTitle || '';
    this.faqSectionTitle = data.pageContent.faqSectionTitle || '';

    // SEO Data
    this.metaTitle = data.seoData.metaTitle || '';
    this.metaDescription = data.seoData.metaDescription || '';
    this.metaKeywords = data.seoData.metaKeywords || '';
    this.ogTitle = data.seoData.ogTitle || '';
    this.ogDescription = data.seoData.ogDescription || '';
    this.ogImageId = data.seoData.ogImageId || '';
    this.structuredData = data.seoData.structuredData
      ? JSON.stringify(data.seoData.structuredData, null, 2)
      : '';
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const updateData: UpdateHomePageData = {
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
        marqueeLeftText: this.marqueeLeftText,
        marqueeRightText: this.marqueeRightText,
        latestProjectsTitle: this.latestProjectsTitle,
        latestPostsTitle: this.latestPostsTitle,
        whySectionTitle: this.whySectionTitle,
        faqSectionTitle: this.faqSectionTitle,
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

      this.pagesService.updateHomePage(updateData).subscribe({
        next: () => {
          this.globalMessageService.handle({
            message: 'Home page updated successfully!',
            isError: false
          });
          this.loadHomePageData(); // Reload to get fresh data
        },
        error: (error) => {
          console.error('Error updating home page:', error);
          this.globalMessageService.handle({
            message: 'Failed to update home page. Please try again.',
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
    if (this.homePageData) {
      this.populateForm(this.homePageData);
      this.globalMessageService.handle({
        message: 'Form reset to original values.',
        isError: false
      });
    }
  }
}
