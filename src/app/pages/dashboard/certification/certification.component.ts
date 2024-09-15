import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RefreshTokensService } from '@services/refresh-token.service';
import { UserInfoResponse } from '@responses/user-info.interface';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'page-certification',
  templateUrl: './certification.component.html',
  styleUrl: './certification.component.scss'
})
export class CertificationComponent implements OnInit {
  certificationId: string;

  userInfo: UserInfoResponse;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly envService: EnvService,
    private readonly refreshTokensService: RefreshTokensService
  ) {}

  staticStorage = `${this.envService.getStaticStorageLink}/certs-pictures/`;

  getCertificationById() {}

  async fetchUserInfo() {
    const userInfoRequest = await this.refreshTokensService.refreshTokens();
    if (userInfoRequest) {
      userInfoRequest.subscribe({
        next: (userInfo) => (this.userInfo = userInfo),
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

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const certificationId = params.get('certificationId');

      if (!certificationId)
        return await this.handleRedirect('account/certifications');

      this.certificationId = certificationId;

      await this.fetchUserInfo();

      this.getCertificationById();
    });
  }
}
