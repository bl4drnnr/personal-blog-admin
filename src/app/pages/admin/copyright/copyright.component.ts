import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { GlobalMessageService } from '@shared/global-message.service';
import { CopyrightService } from '@services/copyright.service';
import { CopyrightLinkInterface } from '@interfaces/copyright/copyright-data.interface';

interface CopyrightForm {
  copyrightEmail: string;
  copyrightText: string;
  copyrightLinks: CopyrightLinkInterface[];
}

@Component({
  selector: 'page-copyright',
  templateUrl: './copyright.component.html',
  styleUrls: ['./copyright.component.scss']
})
export class CopyrightComponent extends BaseAdminComponent implements OnInit {
  copyrightForm: CopyrightForm = {
    copyrightEmail: '',
    copyrightText: '',
    copyrightLinks: []
  };

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private copyrightService: CopyrightService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    this.titleService.setTitle(this.getPageTitle());
    await this.loadCopyrightData();
  }

  private getPageTitle(): string {
    return 'Personal Blog | Copyright Management';
  }

  private async loadCopyrightData(): Promise<void> {
    this.copyrightService.getCopyrightData().subscribe({
      next: (data) => {
        this.copyrightForm = {
          copyrightEmail: data.copyrightEmail || '',
          copyrightText: data.copyrightText || '',
          copyrightLinks:
            data.copyrightLinks && data.copyrightLinks.length > 0
              ? data.copyrightLinks
              : [{ title: '', link: '' }]
        };
      },
      error: (error) => {
        console.error('Error loading copyright data:', error);
        this.globalMessageService.handleError('Failed to load copyright data');
        // Initialize with default structure if loading fails
        this.copyrightForm.copyrightLinks = [{ title: '', link: '' }];
      }
    });
  }

  addNewCopyrightLink(): void {
    this.copyrightForm.copyrightLinks.push({
      title: '',
      link: ''
    });
  }

  removeCopyrightLink(index: number): void {
    if (this.copyrightForm.copyrightLinks.length > 1) {
      this.copyrightForm.copyrightLinks.splice(index, 1);
    }
  }

  async onSubmit(): Promise<void> {
    const updateRequest = {
      copyrightEmail: this.copyrightForm.copyrightEmail.trim(),
      copyrightText: this.copyrightForm.copyrightText.trim(),
      copyrightLinks: this.copyrightForm.copyrightLinks
        .filter((link) => link.title.trim() && link.link.trim())
        .map((link) => ({
          title: link.title.trim(),
          link: link.link.trim()
        }))
    };

    this.copyrightService.updateCopyrightData(updateRequest).subscribe({
      next: async () => {
        this.globalMessageService.handle({
          message: 'Copyright data updated successfully'
        });
        await this.loadCopyrightData();
      },
      error: (error) => {
        this.globalMessageService.handleError('Failed to update copyright data');
        console.error('Failed to update copyright data:', error);
      }
    });
  }

  onCopyrightEmailChange(email: string) {
    this.copyrightForm.copyrightEmail = email;
  }

  onCopyrightTextChange(copyrightText: string) {
    this.copyrightForm.copyrightText = copyrightText;
  }

  canRemoveLink(): boolean {
    return this.copyrightForm.copyrightLinks.length > 1;
  }
}
