import dayjs from 'dayjs';
import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from '@services/articles.service';
import { DomSanitizer } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { UserInfoResponse } from '@responses/user-info.interface';
import { GetArticleBySlugResponse } from '@responses/get-article-by-slug.interface';
import { GlobalMessageService } from '@shared/global-message.service';
import { EnvService } from '@shared/env.service';
import { CategoriesService } from '@services/categories.service';
import { GetCategoryResponse } from '@responses/get-category.interface';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { Editor, Toolbar } from 'ngx-editor';
import { EditArticlePayload } from '@payloads/edit-article.interface';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { MessagesTranslation } from '@translations/messages.enum';

@Component({
  selector: 'page-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit, OnDestroy {
  article: GetArticleBySlugResponse;

  articleSlug: string;
  articleLanguage: string;

  articleName: string;
  articleDescription: string;
  articleTags: Array<string>;
  articleTag: string;
  articleContent: string;
  articleImage: string;
  articleCategory: DropdownInterface;
  categoryId: string;
  articleEditMode = false;

  userInfo: UserInfoResponse;
  allCategories: Array<GetCategoryResponse> = [];
  categoriesDropdown: Array<DropdownInterface>;

  editor: Editor;
  htmlContent: string = '';
  sanitizedHtmlContent: string = '';
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear', 'indent', 'outdent'],
    ['superscript', 'subscript'],
    ['undo', 'redo']
  ];

  selectedFiles?: FileList;
  articlePicture: string | ArrayBuffer | null = '';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly envService: EnvService,
    private readonly sanitizer: DomSanitizer,
    private readonly articlesService: ArticlesService,
    private readonly categoriesService: CategoriesService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  staticStorage = `${this.envService.getStaticStorageLink}/articles-main-pictures/`;

  onHtmlChange(html: string) {
    this.htmlContent = html;
    this.sanitizedHtmlContent = this.sanitizeHtmlContent(this.htmlContent);
  }

  sanitizeHtmlContent(htmlString: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, htmlString)!;
  }

  async addArticleTag() {
    if (this.articleTag === ' ') return;

    const isTagPresent = this.articleTags.find(
      (tag) => tag === this.articleTag
    );

    if (isTagPresent) {
      await this.globalMessageService.handleWarning({
        message: 'Tag is already on the list'
      });
    } else {
      this.articleTags.push(this.articleTag);
    }

    this.articleTag = '';
  }

  deleteArticleTag(articleTag: string) {
    this.articleTags.splice(this.articleTags.indexOf(articleTag), 1);
  }

  articleEdited() {
    return (
      this.article.articleName !== this.articleName ||
      this.article.articleDescription !== this.articleDescription ||
      this.article.articleContent !== this.articleContent ||
      this.articlePicture ||
      this.article.categoryId !== this.articleCategory.key
    );
  }

  changePublishArticleStatus() {
    this.articlesService
      .changePublishArticleStatus({
        articleId: this.article.id
      })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage =
            await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
          this.globalMessageService.handle({ message: translationMessage });
          this.getArticleBySlug();
        }
      });
  }

  selectArticleCategory({ key, value }: DropdownInterface) {
    this.articleCategory = { key, value };
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
    if (!this.selectedFiles) return;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.articlePicture = reader.result;
    };
  }

  editArticle() {
    const articlePayload: EditArticlePayload = {
      articleId: this.article.id,
      articleTags: this.articleTags
    };

    if (this.article.articleName !== this.articleName)
      articlePayload.articleName = this.articleName;
    if (this.article.articleDescription !== this.articleDescription)
      articlePayload.articleDescription = this.articleDescription;
    if (this.article.articleContent !== this.articleContent)
      articlePayload.articleContent = this.sanitizedHtmlContent;
    if (this.articlePicture)
      articlePayload.articlePicture = this.articlePicture as string;
    if (this.article.categoryId !== this.articleCategory.key)
      articlePayload.categoryId = this.articleCategory.key;

    this.articlesService
      .editArticle({
        ...articlePayload
      })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage =
            await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
          this.globalMessageService.handle({ message: translationMessage });
          this.getArticleBySlug();
        }
      });
  }

  deleteArticle() {
    this.articlesService
      .deleteArticle({
        articleId: this.article.id
      })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage =
            await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
          this.globalMessageService.handle({ message: translationMessage });
          await this.handleRedirect('account/articles');
        }
      });
  }

  getArticleBySlug() {
    this.articlesService
      .getArticleBySlug({
        slug: this.articleSlug,
        language: this.articleLanguage
      })
      .subscribe({
        next: (article) => {
          this.translationService.setPageTitle(Titles.ARTICLE, {
            articleName: article.articleName
          });
          this.article = article;
          this.articleName = article.articleName;
          this.articleDescription = article.articleDescription;
          this.articleTags = article.articleTags;
          this.articleContent = article.articleContent;
          this.articleImage = article.articleImage;
          this.articleCategory = {
            key: article.categoryId,
            value: article.category.categoryName
          };
        }
      });
  }

  getAllCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (allCategories) => {
        this.allCategories = allCategories;
        this.categoriesDropdown = allCategories.map(({ id, categoryName }) => {
          return { key: id, value: categoryName };
        });
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
      const language = params.get('language');

      if (!slug || !language) {
        await this.handleRedirect('account/articles');
      } else {
        this.articleSlug = slug;
        this.articleLanguage = language;

        await this.fetchUserInfo();

        this.getArticleBySlug();
        this.getAllCategories();
      }
    });

    this.editor = new Editor();
  }

  ngOnDestroy() {
    this.editor.destroy();
  }

  protected readonly dayjs = dayjs;
}
