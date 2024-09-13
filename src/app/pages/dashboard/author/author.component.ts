import dayjs from 'dayjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EnvService } from '@shared/env.service';
import { AuthorsService } from '@services/authors.service';
import { TranslationService } from '@services/translation.service';
import { RefreshTokensService } from '@services/refresh-token.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { UserInfoResponse } from '@responses/user-info.interface';

@Component({
  selector: 'page-author',
  templateUrl: './author.component.html',
  styleUrl: './author.component.scss'
})
export class AuthorComponent implements OnInit {
  authorId: string;
  userInfo: UserInfoResponse;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly envService: EnvService,
    private readonly authorsService: AuthorsService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  getAuthorById() {
    this.authorsService
      .getAuthorById({
        authorId: this.authorId
      })
      .subscribe({
        next: () => {}
      });
  }

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
      const authorId = params.get('authorId');

      if (!authorId) return await this.handleRedirect('account/authors');

      this.authorId = authorId;

      await this.fetchUserInfo();

      this.getAuthorById();
    });
  }

  protected readonly dayjs = dayjs;
}
