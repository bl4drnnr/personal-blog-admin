import dayjs from 'dayjs';
import { Component, OnInit } from '@angular/core';
import { ArticlesService } from '@services/articles.service';
import { UserInfoResponse } from '@responses/user-info.interface';
import { RefreshTokensService } from '@services/refresh-token.service';
import { Router } from '@angular/router';
import { ListArticleInterface } from '@interfaces/list-article.interface';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { GlobalMessageService } from '@shared/global-message.service';
import { MessagesTranslation } from '@translations/messages.enum';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'page-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss', '../shared/article.styles.scss']
})
export class ArticlesComponent implements OnInit {
  page: string = '0';
  pageSize: string = '10';
  order: string = 'created_at';
  orderBy: string = 'DESC';
  articleSearchQuery: string = '';
  totalItems: number;
  articles: Array<ListArticleInterface> = [];

  userInfo: UserInfoResponse;

  constructor(
    private readonly router: Router,
    private readonly envService: EnvService,
    private readonly articlesService: ArticlesService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  staticStorage = `${this.envService.getStaticStorageLink}/articles-main-pictures/`;

  setCurrentPage(currentPage: string) {
    this.page = currentPage;
    this.listArticles();
  }

  setArticlesPerPage(articlesPerPage: string) {
    this.pageSize = articlesPerPage;
    this.listArticles();
  }

  handleArticleQuery(articleQuery: string) {
    this.articleSearchQuery = articleQuery;
    this.listArticles();
  }

  listArticles() {
    const listArticlesPayload = {
      page: this.page,
      pageSize: this.pageSize,
      order: this.order,
      orderBy: this.orderBy,
      query: this.articleSearchQuery
    };

    this.articlesService
      .listArticles({
        ...listArticlesPayload
      })
      .subscribe({
        next: ({ rows, count }) => {
          this.articles = rows;
          this.totalItems = count;
        }
      });
  }

  changePublishArticleStatus(articleId: string) {
    this.articlesService.changePublishArticleStatus({ articleId }).subscribe({
      next: async ({ message }) => {
        const translationMessage = await this.translationService.translateText(
          message,
          MessagesTranslation.RESPONSES
        );
        this.globalMessageService.handle({
          message: translationMessage
        });
        this.listArticles();
      }
    });
  }

  deleteArticle(articleId: string) {
    this.articlesService.deleteArticle({ articleId }).subscribe({
      next: async ({ message }) => {
        const translationMessage = await this.translationService.translateText(
          message,
          MessagesTranslation.RESPONSES
        );
        this.globalMessageService.handle({
          message: translationMessage
        });
        this.listArticles();
      }
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

  async handleArticleRedirect(article: ListArticleInterface) {
    await this.handleRedirect(
      `account/article/${article.articleLanguage}/${article.articleSlug}`
    );
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.ARTICLES);

    await this.fetchUserInfo();

    this.listArticles();
  }

  protected readonly dayjs = dayjs;
}
