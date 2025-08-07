import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';

@Component({
  selector: 'page-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent extends BaseAdminComponent {
  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title
  ) {
    super(router, refreshTokensService);
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Pages';
  }

  async navigateToHomePage(): Promise<void> {
    await this.router.navigate(['/admin/pages/home']);
  }

  async navigateToFaqPage(): Promise<void> {
    await this.router.navigate(['/admin/pages/faq']);
  }

  async navigateToWhysSectionPage(): Promise<void> {
    await this.router.navigate(['/admin/pages/whys-section']);
  }

  async navigateToContactPage(): Promise<void> {
    await this.router.navigate(['/admin/pages/contact']);
  }

  async navigateToSubscribePage(): Promise<void> {
    await this.router.navigate(['/admin/pages/subscribe']);
  }

  async navigateToBlogPage(): Promise<void> {
    await this.router.navigate(['/admin/pages/blog']);
  }

  async navigateToProjectsPage(): Promise<void> {
    await this.router.navigate(['/admin/pages/projects']);
  }
}
