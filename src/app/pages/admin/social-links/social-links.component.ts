import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { GlobalMessageService } from '@shared/global-message.service';
import { SocialLinksService } from '@services/social-links.service';

interface SocialLinkForm {
  id?: string;
  url: string;
  alt: string;
  iconId: string;
}

@Component({
  selector: 'page-social-links',
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.scss']
})
export class SocialLinksComponent extends BaseAdminComponent implements OnInit {
  socialLinks: SocialLinkForm[] = [];

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private socialLinksService: SocialLinksService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    this.titleService.setTitle(this.getPageTitle());
    await this.loadSocialLinks();
  }

  private getPageTitle(): string {
    return 'Personal Blog | Social Links Management';
  }

  private async loadSocialLinks(): Promise<void> {
    this.socialLinksService.getAdminSocialLinks().subscribe({
      next: (socialLinks) => {
        this.socialLinks = socialLinks;
      },
      error: (error) => {
        console.error('Error loading social links:', error);
      }
    });
  }

  addNewSocialLink(): void {
    this.socialLinks.push({
      url: '',
      alt: '',
      iconId: ''
    });
  }

  removeSocialLink(index: number): void {
    if (this.socialLinks.length > 1) {
      this.socialLinks.splice(index, 1);
    }
  }

  onUrlChange(index: number, value: string): void {
    this.socialLinks[index].url = value;
  }

  onAltChange(index: number, value: string): void {
    this.socialLinks[index].alt = value;
  }

  async onSubmit(): Promise<void> {
    const updateRequest = {
      socialLinks: this.socialLinks.map((link) => ({
        url: link.url.trim(),
        alt: link.alt.trim(),
        iconId: link.iconId
      }))
    };

    this.socialLinksService.updateSocialLinks(updateRequest).subscribe({
      next: async () => {
        this.globalMessageService.handle({
          message: 'Social links updated successfully'
        });

        // Reload the social links to get updated data
        await this.loadSocialLinks();
      },
      error: (error) => {
        this.globalMessageService.handleError('Failed to update social links');
        console.error('Failed to update social links:', error);
      }
    });
  }

  canRemoveLink(): boolean {
    return this.socialLinks.length > 1;
  }
}
