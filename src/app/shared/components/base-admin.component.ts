import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RefreshTokensService } from '@services/refresh-token.service';
import { UserInfoResponse } from '@responses/user-info.interface';

@Component({
  template: ''
})
export abstract class BaseAdminComponent implements OnInit {
  userInfo: UserInfoResponse;

  constructor(
    protected router: Router,
    protected refreshTokensService: RefreshTokensService
  ) {}

  async fetchUserInfo() {
    const userInfoRequest = await this.refreshTokensService.refreshTokens();
    if (userInfoRequest) {
      userInfoRequest.subscribe({
        next: (userInfo) => {
          this.userInfo = userInfo;
          this.onUserInfoLoaded();
        },
        error: async () => {
          localStorage.removeItem('_at');
          await this.handleRedirect('login');
        }
      });
    }
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async ngOnInit() {
    await this.fetchUserInfo();
  }

  protected onUserInfoLoaded(): void {
    // Override in child components if needed
  }
}
