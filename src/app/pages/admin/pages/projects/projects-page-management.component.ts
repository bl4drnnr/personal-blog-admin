import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { PagesService } from '@shared/services/pages.service';
import { ProjectsPageData } from '@interfaces/pages/projects-page-data.interface';
import { UpdateProjectsPageData } from '@interfaces/pages/update-projects-page-data.interface';
import { GlobalMessageService } from '@shared/global-components-services/global-message.service';

@Component({
  selector: 'page-projects-page-management',
  templateUrl: './projects-page-management.component.html',
  styleUrls: ['./projects-page-management.component.scss']
})
export class ProjectsPageManagementComponent
  extends BaseAdminComponent
  implements OnInit
{
  projectsPageData: ProjectsPageData | null = null;

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
    this.loadProjectsPageData();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Projects Page Management';
  }

  private loadProjectsPageData(): void {
    this.pagesService.getAdminProjectsPageData().subscribe({
      next: (data: ProjectsPageData) => {
        this.projectsPageData = data;
        this.populateForm(data);
      },
      error: (error) => {
        console.error('Error loading projects page data:', error);
        this.globalMessageService.handle({
          message: 'Failed to load projects page data. Please try again.',
          isError: true
        });
      }
    });
  }

  private populateForm(data: ProjectsPageData): void {
    // Page Content
    this.title = data.pageContent.title || '';
    this.subtitle = data.pageContent.subtitle || '';
    this.description = data.pageContent.description || '';

    // Layout Data
    this.heroImageMainId = data.layoutData.heroImageMainId || '';
    this.heroImageSecondaryId = data.layoutData.heroImageSecondaryId || '';
    this.heroImageMainAlt = data.layoutData.heroImageMainAlt || '';
    this.heroImageSecondaryAlt = data.layoutData.heroImageSecondaryAlt || '';
    this.logoText = data.layoutData.logoText || '';
    this.breadcrumbText = data.layoutData.breadcrumbText || '';
    this.heroTitle = data.layoutData.heroTitle || '';

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
      const updateData: UpdateProjectsPageData = {
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

      this.pagesService.updateProjectsPage(updateData).subscribe({
        next: () => {
          this.globalMessageService.handle({
            message: 'Projects page updated successfully!',
            isError: false
          });
          this.loadProjectsPageData(); // Reload to get fresh data
        },
        error: (error) => {
          console.error('Error updating projects page:', error);
          this.globalMessageService.handle({
            message: 'Failed to update projects page. Please try again.',
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
    if (this.projectsPageData) {
      this.populateForm(this.projectsPageData);
      this.globalMessageService.handle({
        message: 'Form reset to original values.',
        isError: false
      });
    }
  }
}
