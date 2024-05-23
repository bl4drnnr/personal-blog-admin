import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.interface';
import { Router } from '@angular/router';
import { RefreshTokensService } from '@services/refresh-token.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { ArticlesService } from '@services/articles.service';
import { Editor, Toolbar } from 'ngx-editor';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { CategoriesService } from '@services/categories.service';
import { GetCategoryResponse } from '@responses/get-category.interface';
import { DropdownInterface } from '@interfaces/dropdown.interface';

@Component({
  selector: 'page-create-article',
  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.scss'
})
export class CreateArticleComponent implements OnInit, OnDestroy {
  articleName: string;
  articleDescription: string;
  articleTag: string;
  articleTags: Array<string> = [];
  articleCategory: DropdownInterface;
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
  articlePicture: string | ArrayBuffer | null = '';

  constructor(
    private readonly title: Title,
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly articlesService: ArticlesService,
    private readonly categoriesService: CategoriesService,
    private readonly globalMessageService: GlobalMessageService,
    private readonly refreshTokensService: RefreshTokensService
  ) {}

  onHtmlChange(html: string) {
    this.htmlContent = html;
    this.sanitizedHtmlContent = this.sanitizeHtmlContent(this.htmlContent);
  }

  createArticle() {
    this.articlesService
      .createArticle({
        articleName: this.articleName,
        articleDescription: this.articleDescription,
        articleTags: this.articleTags.map((tag) => tag.replace(/\s+/g, '')),
        articleContent: this.sanitizedHtmlContent,
        articlePicture: this.articlePicture as string,
        categoryId: this.articleCategory.key
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

  selectArticleCategory({ key, value }: DropdownInterface) {
    this.articleCategory = { key, value };
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

  deleteArticleTag(articleTag: string) {
    this.articleTags.splice(this.articleTags.indexOf(articleTag), 1);
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

  sanitizeHtmlContent(htmlString: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, htmlString)!;
  }

  async ngOnInit() {
    this.title.setTitle('My Blog | Create article');
    this.editor = new Editor();

    await this.fetchUserInfo();

    this.getAllCategories();
  }

  ngOnDestroy() {
    this.editor.destroy();
  }
}
