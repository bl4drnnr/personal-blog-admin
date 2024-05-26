import { Component, OnInit } from '@angular/core';
import { ArticlesService } from '@services/articles.service';
import { UserInfoResponse } from '@responses/user-info.interface';
import { RefreshTokensService } from '@services/refresh-token.service';
import { Router } from '@angular/router';
import { ListArticleInterface } from '@interfaces/list-article.interface';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
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
    private readonly articlesService: ArticlesService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService
  ) {}

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
    this.translationService.setPageTitle(Titles.ARTICLES);

    await this.fetchUserInfo();

    this.listArticles();
  }
}
