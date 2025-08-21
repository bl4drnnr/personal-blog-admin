import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { NotFoundService } from '@services/not-found.service';
import { NotFoundPageData } from '@interfaces/not-found/not-found-page-data.interface';
import { StaticAssetsService } from '@services/static-assets.service';

@Component({
  selector: 'page-not-found-settings',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundSettingsComponent extends BaseAdminComponent implements OnInit {
  notFoundData: NotFoundPageData | null = null;

  // Form fields
  title = '';
  content = '';
  heroTitle = '';
  heroImageMainId = '';
  heroImageMainAlt = '';
  heroImageMainPreview = '';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private notFoundService: NotFoundService,
    private staticAssetsService: StaticAssetsService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadNotFoundData();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Not Found Page Settings';
  }

  loadNotFoundData(): void {
    this.notFoundService.getNotFoundPageDataAdmin().subscribe({
      next: (response) => {
        this.notFoundData = response;
        this.populateForm();
      },
      error: (error) => {
        console.error('Error loading not found data:', error);
      }
    });
  }

  populateForm(): void {
    if (this.notFoundData) {
      this.title = this.notFoundData.title;
      this.content = this.notFoundData.content;
      this.heroTitle = this.notFoundData.heroTitle;
      this.heroImageMainId = this.notFoundData.heroImageMainId;
      this.heroImageMainAlt = this.notFoundData.heroImageMainAlt;
    }

    // Load image preview
    this.loadImagePreview();
  }

  loadImagePreview(): void {
    if (this.heroImageMainId) {
      this.staticAssetsService.findById(this.heroImageMainId).subscribe({
        next: (asset) => (this.heroImageMainPreview = asset.s3Url),
        error: () => (this.heroImageMainPreview = '')
      });
    }
  }

  saveNotFoundSettings(): void {
    const payload: NotFoundPageData = {
      title: this.title,
      content: this.content,
      heroTitle: this.heroTitle,
      heroImageMainId: this.heroImageMainId,
      heroImageMainAlt: this.heroImageMainAlt
    };

    // Check if data exists, use update or create accordingly
    const apiCall = this.notFoundData!.id
      ? this.notFoundService.updateNotFoundPage(payload)
      : this.notFoundService.createNotFoundPage(payload);

    apiCall.subscribe({
      next: () => {
        alert('Not Found page settings saved successfully!');
        this.loadNotFoundData();
      },
      error: (error) => {
        console.error('Error saving not found settings:', error);
        alert('Error saving not found settings. Please try again.');
      }
    });
  }
}
