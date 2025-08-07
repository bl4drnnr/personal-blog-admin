import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { ArticlesService } from '@services/articles.service';
import { GlobalMessageService } from '@shared/global-components-services/global-message.service';
import { ArticleDetailInterface } from '@interfaces/api/article-detail.interface';

@Component({
  selector: 'page-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
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
        console.log('this.article', this.article);
        this.title = this.article.title;
        this.description = this.article.description;
        this.content = this.article.content;
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

    const articleData = {
      title: this.title,
      description: this.description,
      content: this.content,
      excerpt: this.excerpt,
      featuredImageId: this.featuredImageId,
      tags: this.tags,
      published: this.published,
      featured: this.featured
    };

    // TODO: Implement update article API call
    console.log('Saving article:', articleData);
    this.globalMessageService.handle({
      message: 'Article saved successfully'
    });
  }

  async cancel(): Promise<void> {
    await this.router.navigate(['/admin/posts']);
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
