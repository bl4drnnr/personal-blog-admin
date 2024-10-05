import dayjs from 'dayjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnvService } from '@shared/env.service';
import { AuthorsService } from '@services/authors.service';
import { TranslationService } from '@services/translation.service';
import { RefreshTokensService } from '@services/refresh-token.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { UserInfoResponse } from '@responses/user-info.interface';
import { Titles } from '@interfaces/titles.enum';
import { ListAuthor } from '@interfaces/list-author.interface';
import { MessagesTranslation } from '@translations/messages.enum';

@Component({
  selector: 'page-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss', '../shared/author.styles.scss']
})
export class AuthorsComponent implements OnInit {
  page: string = '0';
  pageSize: string = '10';
  order: string = 'created_at';
  orderBy: string = 'DESC';
  authorSearchQuery: string = '';
  totalItems: number;
  authors: Array<ListAuthor> = [];

  userInfo: UserInfoResponse;

  constructor(
    private readonly router: Router,
    private readonly envService: EnvService,
    private readonly authorsService: AuthorsService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  staticStorage = `${this.envService.getStaticStorageLink}/authors-pictures/`;

  listAuthors() {
    const listAuthorsPayload = {
      page: this.page,
      pageSize: this.pageSize,
      order: this.order,
      orderBy: this.orderBy,
      query: this.authorSearchQuery
    };

    this.authorsService.listAuthors({ ...listAuthorsPayload }).subscribe({
      next: ({ rows, count }) => {
        this.authors = rows;
        this.totalItems = count;
      }
    });
  }

  changeAuthorSelectionStatus(authorCommonId: string) {
    this.authorsService.changeAuthorSelectionStatus({ authorCommonId }).subscribe({
      next: async ({ message }) => {
        const translationMessage = await this.translationService.translateText(
          message,
          MessagesTranslation.RESPONSES
        );
        this.globalMessageService.handle({
          message: translationMessage
        });
        this.listAuthors();
      }
    });
  }

  deleteAuthor(authorCommonId: string) {
    this.authorsService.deleteAuthor({ authorCommonId }).subscribe({
      next: async ({ message }) => {
        const translationMessage = await this.translationService.translateText(
          message,
          MessagesTranslation.RESPONSES
        );
        this.globalMessageService.handle({
          message: translationMessage
        });
        this.listAuthors();
      }
    });
  }

  setCurrentPage(currentPage: string) {
    this.page = currentPage;
    this.listAuthors();
  }

  setAuthorsPerPage(authorsPerPage: string) {
    this.pageSize = authorsPerPage;
    this.listAuthors();
  }

  handleAuthorQuery(authorQuery: string) {
    this.authorSearchQuery = authorQuery;
    this.listAuthors();
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

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.AUTHORS);

    await this.fetchUserInfo();

    this.listAuthors();
  }

  protected readonly dayjs = dayjs;
}
