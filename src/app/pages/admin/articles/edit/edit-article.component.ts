import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { ArticlesService } from '@services/articles.service';
import { GlobalMessageService } from '@shared/global-components-services/global-message.service';
import { ArticleDetailInterface } from '@interfaces/api/article-detail.interface';
import { EditArticlePayload } from '@payloads/edit-article.interface';

@Component({
  selector: 'page-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['../../../../shared/styles/admin-edit-page.scss']
})
export class EditArticleComponent extends BaseAdminComponent implements OnInit {
  articleSlug: string = '';
  article: ArticleDetailInterface = {
    id: '',
    slug: '',
    title: '',
    description: '',
    content: '',
    excerpt: '',
    featuredImageId: '',
    tags: [],
    published: false,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: ''
  };

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
    private route: ActivatedRoute,
    private titleService: Title,
    private articlesService: ArticlesService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.articleSlug = this.route.snapshot.paramMap.get('slug')!;
  }

  protected override async onUserInfoLoaded(): Promise<void> {
    this.titleService.setTitle(this.getPageTitle());
    await this.loadArticle();
  }

  private getPageTitle(): string {
    return 'Personal Blog | Edit Article';
  }

  async loadArticle(): Promise<void> {
    if (!this.articleSlug) {
      await this.router.navigate(['/admin/posts']);
      return;
    }

    this.articlesService.getPostBySlug(this.articleSlug).subscribe({
      next: (response) => {
        this.article = response;
        this.title = this.article.title;
        this.description = this.article.description;
        this.content = this.article.content;
        this.processedContent = this.article.content; // Initialize with same content
        this.excerpt = this.article.excerpt;
        this.featuredImageId = this.article.featuredImageId;
        this.tags = this.article.tags;
        this.published = this.article.published;
        this.featured = this.article.featured;
      },
      error: async (error) => {
        console.error('Error loading article:', error);
        this.globalMessageService.handle({
          message: 'Error loading article',
          isError: true
        });
        await this.router.navigate(['/admin/posts']);
      }
    });
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

  saveArticle(): void {
    if (!this.title.trim() || !this.content.trim()) {
      this.globalMessageService.handle({
        message: 'Title and content are required',
        isError: true
      });
      return;
    }

    if (!this.article.id) {
      this.globalMessageService.handle({
        message: 'Article not loaded',
        isError: true
      });
      return;
    }

    // Use processed content (with tables converted to HTML) for saving
    const contentToSave = this.processedContent || this.content;

    const payload: EditArticlePayload = {
      articleId: this.article.id,
      articleName: this.title,
      articleDescription: this.description,
      articleContent: contentToSave,
      articleTags: this.tags,
      articlePictureId: this.featuredImageId
    };

    this.articlesService.updateArticle(payload).subscribe({
      next: (updatedArticle) => {
        this.article = updatedArticle;
        this.globalMessageService.handle({
          message: 'Article saved successfully'
        });
      },
      error: (error) => {
        console.error('Error saving article:', error);
        this.globalMessageService.handle({
          message: 'Error saving article',
          isError: true
        });
      }
    });
  }

  async cancel(): Promise<void> {
    await this.router.navigate(['/admin/posts']);
  }

  changePublishStatus(): void {
    if (!this.article.id) {
      this.globalMessageService.handle({
        message: 'Article not loaded',
        isError: true
      });
      return;
    }

    this.articlesService.changePublishStatus(this.article.id).subscribe({
      next: (response) => {
        this.published = response.published;
        this.globalMessageService.handle({
          message: `Article ${this.published ? 'published' : 'unpublished'} successfully`
        });
      },
      error: (error) => {
        console.error('Error changing publish status:', error);
        this.globalMessageService.handle({
          message: 'Error changing publish status',
          isError: true
        });
      }
    });
  }

  toggleFeatured(): void {
    if (!this.article.id) {
      this.globalMessageService.handle({
        message: 'Article not loaded',
        isError: true
      });
      return;
    }

    this.articlesService.changeFeaturedStatus(this.article.id).subscribe({
      next: (response) => {
        this.featured = response.featured;
        this.globalMessageService.handle({
          message: `Article ${this.featured ? 'featured' : 'unfeatured'} successfully`
        });
      },
      error: (error) => {
        console.error('Error changing featured status:', error);
        this.globalMessageService.handle({
          message: 'Error changing featured status',
          isError: true
        });
      }
    });
  }

  deleteArticle(): void {
    if (
      this.article &&
      confirm(`Are you sure you want to delete "${this.article.title}"?`)
    ) {
      this.articlesService.deleteArticle(this.article.id).subscribe({
        next: async () => {
          this.globalMessageService.handle({
            message: 'Article deleted successfully'
          });
          await this.router.navigate(['/admin/posts']);
        },
        error: (error) => {
          console.error('Error deleting article:', error);
          this.globalMessageService.handle({
            message: 'Error deleting article',
            isError: true
          });
        }
      });
    }
  }
}
