import dayjs from 'dayjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from '@services/articles.service';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { UserInfoResponse } from '@responses/user-info.interface';
import { GetArticleBySlugResponse } from '@responses/get-article-by-slug.interface';
import { GlobalMessageService } from '@shared/global-message.service';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'page-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {
  article: GetArticleBySlugResponse;

  articleSlug: string;
  articleEditMode = false;

  userInfo: UserInfoResponse;

  constructor(
    private readonly title: Title,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly envService: EnvService,
    private readonly articlesService: ArticlesService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  staticStorage = `${this.envService.getStaticStorageLink}/articles-main-pictures/`;

  deleteArticle() {
    this.articlesService
      .deleteArticle({
        articleId: this.article.id
      })
      .subscribe({
        next: async ({ message }) => {
          this.globalMessageService.handle({ message });
          await this.handleRedirect('account/articles');
        }
      });
  }

  getArticleBySlug() {
    this.articlesService
      .getArticleBySlug({
        slug: this.articleSlug
      })
      .subscribe({
        next: (article) => {
          this.title.setTitle(`My Blog | ${article.articleName}`);
          this.article = article;
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

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const slug = params.get('slug');
      if (!slug) {
        await this.handleRedirect('account/dashboard');
      } else {
        this.articleSlug = slug;
        await this.fetchUserInfo();
        this.getArticleBySlug();
      }
    });
  }

  protected readonly dayjs = dayjs;
}
