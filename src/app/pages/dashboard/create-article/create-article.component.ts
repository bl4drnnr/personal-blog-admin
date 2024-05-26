import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.interface';
import { Router } from '@angular/router';
import { RefreshTokensService } from '@services/refresh-token.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { ArticlesService } from '@services/articles.service';
import { Editor, Toolbar } from 'ngx-editor';
import { DomSanitizer } from '@angular/platform-browser';
import { CategoriesService } from '@services/categories.service';
import { GetCategoryResponse } from '@responses/get-category.interface';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { CreateArticleInterface } from '@interfaces/create-article.interface';

@Component({
  selector: 'page-create-article',
  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.scss'
})
export class CreateArticleComponent implements OnInit, OnDestroy {
  articles: Array<CreateArticleInterface> = [{
    articleName: '',
    articleDescription: '',
    articleTag: '',
    articleTags: [],
    articleContent: '',
    articlePicture: '',
    articleCategory: { key: '', value: '' },
    articleLanguage: 'PL'
  }, {
    articleName: '',
    articleDescription: '',
    articleTag: '',
    articleTags: [],
    articleContent: '',
    articlePicture: '',
    articleCategory: { key: '', value: '' },
    articleLanguage: 'EN'
  }, {
    articleName: '',
    articleDescription: '',
    articleTag: '',
    articleTags: [],
    articleContent: '',
    articlePicture: '',
    articleCategory: { key: '', value: '' },
    articleLanguage: 'RU'
  }];

  articleName: string;
  articleDescription: string;
  articleTag: string;
  articleTags: Array<string> = [];
  articleCategory: DropdownInterface;
  articleLanguage: string = 'EN';
  allCategories: Array<GetCategoryResponse> = [];
  categoriesDropdown: Array<DropdownInterface>;

  userInfo: UserInfoResponse;

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
  articlePicture: string;

  constructor(
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly articlesService: ArticlesService,
    private readonly categoriesService: CategoriesService,
    private readonly translationService: TranslationService,
    private readonly globalMessageService: GlobalMessageService,
    private readonly refreshTokensService: RefreshTokensService
  ) {}

  createArticle() {
    this.articlesService
      .createArticle({
        articleName: this.articleName,
        articleDescription: this.articleDescription,
        articleTags: this.articleTags.map((tag) => tag.replace(/\s+/g, '')),
        articleContent: this.sanitizedHtmlContent,
        articlePicture: this.articlePicture,
        categoryId: this.articleCategory.key,
        articleLanguage: this.articleLanguage
      })
      .subscribe({
        next: async ({ link, message }) => {
          this.globalMessageService.handle({
            message
          });
          await this.handleRedirect(link);
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

  modifyArticleName(articleName: string) {
    this.articleName = articleName;
    const article = this.getArticleByLanguage();
    article.articleName = articleName;
  }

  modifyArticleDesc(articleDescription: string) {
    this.articleDescription = articleDescription;
    const article = this.getArticleByLanguage();
    article.articleDescription = articleDescription;
  }

  modifyArticleTag(articleTag: string) {
    this.articleTag = articleTag;
    const article = this.getArticleByLanguage();
    article.articleTag = articleTag;
  }

  selectArticleCategory({ key, value }: DropdownInterface) {
    this.articleCategory = { key, value };
    const article = this.getArticleByLanguage();
    article.articleCategory = { key, value };
  }

  async addArticleTag() {
    if (this.articleTag === ' ') return;

    const article = this.getArticleByLanguage();

    const isTagPresent = article.articleTags.find(
      (tag) => tag === article.articleTag
    );

    if (isTagPresent) {
      await this.globalMessageService.handleWarning({
        message: 'Tag is already on the list'
      });
    } else {
      article.articleTags.push(this.articleTag);
    }

    article.articleTag = '';
    this.articleTag = '';
  }

  deleteArticleTag(articleTag: string) {
    const article = this.getArticleByLanguage();
    article.articleTags.splice(article.articleTags.indexOf(articleTag), 1);
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;

    if (!this.selectedFiles) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const article = this.getArticleByLanguage();
      this.articlePicture = reader.result as string;
      article.articlePicture = reader.result as string;
    };
  }

  clearArticlePicture() {
    const article = this.getArticleByLanguage();
    this.articlePicture = '';
    article.articlePicture = '';
  }

  onHtmlChange(html: string) {
    this.htmlContent = html;
    const article = this.getArticleByLanguage();
    article.articleContent = this.sanitizeHtmlContent(this.htmlContent);
    this.sanitizedHtmlContent = this.sanitizeHtmlContent(this.htmlContent);
  }

  changeArticleLanguage(articleLanguage: string) {
    this.articleLanguage = articleLanguage;

    const article = this.getArticleByLanguage();

    this.articleName = article.articleName;
    this.articleDescription = article.articleDescription;
    this.articleTag = article.articleTag;
    this.articleTags = article.articleTags;
    this.htmlContent = article.articleContent;
    this.articlePicture = article.articlePicture;
    this.articleCategory = article.articleCategory;
  }

  disableCreatePostButton() {
    return (
      !this.articleName ||
      !this.articleDescription ||
      !this.articleTags.length ||
      !this.articleCategory ||
      !this.sanitizedHtmlContent ||
      !this.articlePicture
    );
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
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

  getArticleByLanguage() {
    return this.articles.find(article => article.articleLanguage === this.articleLanguage)!;
  }

  sanitizeHtmlContent(htmlString: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, htmlString)!;
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.CREATE_ARTICLE);

    this.editor = new Editor();

    await this.fetchUserInfo();

    this.getAllCategories();
  }

  ngOnDestroy() {
    this.editor.destroy();
  }
}
