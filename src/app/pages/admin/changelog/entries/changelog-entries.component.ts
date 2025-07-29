import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';

@Component({
  selector: 'page-changelog-entries',
  templateUrl: './changelog-entries.component.html',
  styleUrls: ['./changelog-entries.component.scss']
})
export class ChangelogEntriesComponent extends BaseAdminComponent {
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
    return 'Personal Blog | Changelog Entries';
  }
}
