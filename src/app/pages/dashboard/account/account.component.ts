import { Component, OnInit } from '@angular/core';
import { RefreshTokensService } from '@services/refresh-token.service';
import { UserInfoResponse } from '@responses/user-info.interface';

@Component({
  selector: 'page-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {
  userInfo: UserInfoResponse;

  constructor(private readonly refreshTokensService: RefreshTokensService) {}

  async ngOnInit() {
    const userInfoRequest = await this.refreshTokensService.refreshTokens();

    if (userInfoRequest) {
      userInfoRequest.subscribe({
        next: (userInfo) => (this.userInfo = userInfo)
      });
    }
  }
}
