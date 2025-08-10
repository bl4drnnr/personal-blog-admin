import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { ArticlesService } from '@services/articles.service';
import { GlobalMessageService } from '@shared/global-components-services/global-message.service';
import { CreateArticlePayload } from '@payloads/create-article.interface';

@Component({
  selector: 'page-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['../../../../shared/styles/admin-edit-page.scss']
})
export class CreateArticleComponent extends BaseAdminComponent implements OnInit {
  // Form fields
  title: string = '';
  description: string = '';
  content: string = '';
  processedContent: string = '';
  excerpt: string = '';
  featuredImageId: string = '';
  tags: string[] = [];
  tagInput: string = '';
  published: boolean = false;
  featured: boolean = false;

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private articlesService: ArticlesService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
  }

  protected override async onUserInfoLoaded(): Promise<void> {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Create New Article';
  }

  addTag(): void {
    if (this.tagInput.trim() && !this.tags.includes(this.tagInput.trim())) {
      this.tags.push(this.tagInput.trim());
      this.tagInput = '';
    }
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
  }

  onTagInputKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  areFieldsCorrect(): boolean {
    if (
      !this.title.trim() ||
      !this.content.trim() ||
      !this.description.trim() ||
      !this.excerpt.trim() ||
      !this.featuredImageId.trim()
    ) {
      this.globalMessageService.handle({
        message:
          'Title, content, description, excerpt, and featured image are all required',
        isError: true
      });
      return false;
    } else {
      return true;
    }
  }

  createArticle(): void {
    if (!this.areFieldsCorrect()) return;

    // Use processed content (with tables converted to HTML) for saving
    const contentToSave = this.processedContent || this.content;

    const payload: CreateArticlePayload = {
      articleName: this.title,
      articleDescription: this.description,
      articleContent: contentToSave,
      articleTags: this.tags,
      articlePictureId: this.featuredImageId,
      articleExcerpt: this.excerpt,
      articlePublished: false
    };

    // TODO: ADD THE MODIFICATION OF OTHER PAGES (NOT FOUND, CONFIRMATION, ETC.)
    // TODO: SENDGRID - TEST
    // TODO: SCRIPT TO TRIGGER THE DEPLOYMENT
    this.articlesService.createArticle(payload).subscribe({
      next: async (createdArticle) => {
        this.globalMessageService.handle({
          message: 'Article created successfully'
        });
        // Navigate to edit page for the newly created article
        await this.router.navigate(['/admin/posts/edit', createdArticle.slug]);
      },
      error: (error) => {
        console.error('Error creating article:', error);
        this.globalMessageService.handle({
          message: 'Error creating article',
          isError: true
        });
      }
    });
  }

  async cancel(): Promise<void> {
    await this.router.navigate(['/admin/posts']);
  }

  publishArticle(): void {
    if (!this.areFieldsCorrect()) return;

    // Use processed content (with tables converted to HTML) for saving
    const contentToSave = this.processedContent || this.content;

    const payload: CreateArticlePayload = {
      articleName: this.title,
      articleDescription: this.description,
      articleContent: contentToSave,
      articleTags: this.tags,
      articlePictureId: this.featuredImageId,
      articleExcerpt: this.excerpt,
      articlePublished: true
    };

    this.articlesService.createArticle(payload).subscribe({
      next: async (createdArticle) => {
        this.globalMessageService.handle({
          message: 'Article published successfully'
        });
        // Navigate to edit page for the newly created article
        await this.router.navigate(['/admin/posts/edit', createdArticle.slug]);
      },
      error: (error) => {
        console.error('Error publishing article:', error);
        this.globalMessageService.handle({
          message: 'Error publishing article',
          isError: true
        });
      }
    });
  }

  toggleFeatured(): void {
    this.featured = !this.featured;
  }
}
