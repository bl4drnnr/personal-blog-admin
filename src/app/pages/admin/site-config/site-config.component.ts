import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { SiteConfigService } from '@services/site-config.service';
import { SiteConfigResponse } from '@responses/site-config.interface';
import { UpdateSiteConfigPayload } from '@payloads/update-site-config.interface';
import { GlobalMessageService } from '@shared/global-message.service';

@Component({
  selector: 'page-site-config',
  templateUrl: './site-config.component.html',
  styleUrls: ['./site-config.component.scss']
})
export class SiteConfigComponent extends BaseAdminComponent implements OnInit {
  saving = false;
  siteConfig: SiteConfigResponse | null = null;

  // Form field values
  siteName = '';
  siteDescription = '';
  siteAuthor = '';
  siteUrl = '';
  defaultImage = '';
  keywords = '';
  socialMediaLinkedin = '';
  socialMediaGithub = '';
  organizationName = '';
  organizationUrl = '';
  organizationLogo = '';

  // Field error states
  siteNameError = false;
  siteDescriptionError = false;
  siteAuthorError = false;
  siteUrlError = false;
  defaultImageError = false;
  keywordsError = false;
  organizationUrlError = false;

  // Error messages
  siteNameErrorMessage = '';
  siteDescriptionErrorMessage = '';
  siteAuthorErrorMessage = '';
  siteUrlErrorMessage = '';
  defaultImageErrorMessage = '';
  keywordsErrorMessage = '';
  organizationUrlErrorMessage = '';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private siteConfigService: SiteConfigService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    this.loadSiteConfig();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Site Config';
  }

  private loadSiteConfig(): void {
    this.siteConfigService.getSiteConfig().subscribe({
      next: (config) => {
        this.siteConfig = config;
        this.populateFields(config);
      },
      error: (error) => {
        this.globalMessageService.handleError('Failed to load site configuration');
        console.error('Failed to load site config:', error);
      }
    });
  }

  private populateFields(config: SiteConfigResponse): void {
    this.siteName = config.siteName || '';
    this.siteDescription = config.siteDescription || '';
    this.siteAuthor = config.siteAuthor || '';
    this.siteUrl = config.siteUrl || '';
    this.defaultImage = config.defaultImage || '';
    this.keywords = config.keywords || '';
    this.socialMediaLinkedin = config.socialMedia?.linkedin || '';
    this.socialMediaGithub = config.socialMedia?.github || '';
    this.organizationName = config.organization?.name || '';
    this.organizationUrl = config.organization?.url || '';
    this.organizationLogo = config.organization?.logo || '';
  }

  onSiteNameChange(value: string): void {
    this.siteName = value;
  }

  onSiteNameError(hasError: boolean): void {
    this.siteNameError = hasError;
    this.siteNameErrorMessage = hasError ? 'Site name is required' : '';
  }

  onSiteDescriptionChange(value: string): void {
    this.siteDescription = value;
  }

  onSiteDescriptionError(hasError: boolean): void {
    this.siteDescriptionError = hasError;
    this.siteDescriptionErrorMessage = hasError
      ? 'Site description must be at least 10 characters'
      : '';
  }

  onSiteAuthorChange(value: string): void {
    this.siteAuthor = value;
  }

  onSiteAuthorError(hasError: boolean): void {
    this.siteAuthorError = hasError;
    this.siteAuthorErrorMessage = hasError ? 'Site author is required' : '';
  }

  onSiteUrlChange(value: string): void {
    this.siteUrl = value;
  }

  onSiteUrlError(hasError: boolean): void {
    this.siteUrlError = hasError;
    this.siteUrlErrorMessage = hasError
      ? 'Please enter a valid URL (e.g., https://example.com)'
      : '';
  }

  onDefaultImageChange(value: string): void {
    this.defaultImage = value;
  }

  onKeywordsChange(value: string): void {
    this.keywords = value;
  }

  onKeywordsError(hasError: boolean): void {
    this.keywordsError = hasError;
    this.keywordsErrorMessage = hasError ? 'Keywords are required' : '';
  }

  onSocialMediaLinkedinChange(value: string): void {
    this.socialMediaLinkedin = value;
  }

  onSocialMediaGithubChange(value: string): void {
    this.socialMediaGithub = value;
  }

  onOrganizationNameChange(value: string): void {
    this.organizationName = value;
  }

  onOrganizationUrlChange(value: string): void {
    this.organizationUrl = value;
  }

  onOrganizationUrlError(hasError: boolean): void {
    this.organizationUrlError = hasError;
    this.organizationUrlErrorMessage = hasError
      ? 'Please enter a valid URL (e.g., https://example.com)'
      : '';
  }

  onOrganizationLogoChange(value: string): void {
    this.organizationLogo = value;
  }

  private validateRequiredFields(): boolean {
    let isValid = true;

    if (!this.siteName.trim()) {
      this.siteNameError = true;
      this.siteNameErrorMessage = 'Site name is required';
      isValid = false;
    }

    if (!this.siteDescription.trim() || this.siteDescription.length < 10) {
      this.siteDescriptionError = true;
      this.siteDescriptionErrorMessage =
        'Site description must be at least 10 characters';
      isValid = false;
    }

    if (!this.siteAuthor.trim()) {
      this.siteAuthorError = true;
      this.siteAuthorErrorMessage = 'Site author is required';
      isValid = false;
    }

    if (!this.siteUrl.trim() || !/^https?:\/\/.+/.test(this.siteUrl)) {
      this.siteUrlError = true;
      this.siteUrlErrorMessage =
        'Please enter a valid URL (e.g., https://example.com)';
      isValid = false;
    }

    if (!this.defaultImage.trim()) {
      this.defaultImageError = true;
      this.defaultImageErrorMessage = 'Default image is required';
      isValid = false;
    }

    if (!this.keywords.trim()) {
      this.keywordsError = true;
      this.keywordsErrorMessage = 'Keywords are required';
      isValid = false;
    }

    if (
      this.organizationUrl.trim() &&
      !/^https?:\/\/.+/.test(this.organizationUrl)
    ) {
      this.organizationUrlError = true;
      this.organizationUrlErrorMessage =
        'Please enter a valid URL (e.g., https://example.com)';
      isValid = false;
    }

    return isValid;
  }

  onSubmit(): void {
    if (!this.validateRequiredFields()) {
      this.globalMessageService.handleError(
        'Please fix the validation errors before submitting'
      );
      return;
    }

    this.saving = true;

    const payload: UpdateSiteConfigPayload = {
      siteName: this.siteName.trim(),
      siteDescription: this.siteDescription.trim(),
      siteAuthor: this.siteAuthor.trim(),
      siteUrl: this.siteUrl.trim(),
      defaultImage: this.defaultImage.trim(),
      keywords: this.keywords.trim()
    };

    // Add social media if provided
    if (this.socialMediaLinkedin.trim() || this.socialMediaGithub.trim()) {
      payload.socialMedia = {};
      if (this.socialMediaLinkedin.trim()) {
        payload.socialMedia.linkedin = this.socialMediaLinkedin.trim();
      }
      if (this.socialMediaGithub.trim()) {
        payload.socialMedia.github = this.socialMediaGithub.trim();
      }
    }

    // Add organization if provided
    if (this.organizationName.trim() || this.organizationUrl.trim()) {
      payload.organization = {
        name: this.organizationName.trim() || '',
        url: this.organizationUrl.trim() || ''
      };
      if (this.organizationLogo.trim()) {
        payload.organization.logo = this.organizationLogo.trim();
      }
    }

    this.siteConfigService.updateSiteConfig(payload).subscribe({
      next: () => {
        this.globalMessageService.handle({
          message: 'Site configuration updated successfully'
        });
        this.saving = false;
        this.loadSiteConfig(); // Reload to get updated data
      },
      error: (error) => {
        this.globalMessageService.handleError('Failed to update site configuration');
        console.error('Failed to update site config:', error);
        this.saving = false;
      }
    });
  }

  isFormDisabled(): boolean {
    return this.saving;
  }
}
