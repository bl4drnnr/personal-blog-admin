import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { ArticlesService } from '@services/articles.service';
import { GlobalMessageService } from '@shared/global-components-services/global-message.service';
import { ListArticleInterface } from '@interfaces/list-article.interface';
import { DropdownInterface } from '@interfaces/dropdown.interface';

@Component({
  selector: 'page-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent extends BaseAdminComponent {
  articles: ListArticleInterface[] = [];
  totalArticles: number = 0;

  // Pagination
  currentPage: string = '0';
  itemsPerPage: string = '10';

  // Search and filters
  searchQuery: string = '';
  selectedCategory: string = '';
  selectedLanguage: string = '';
  selectedStatus: string = '';

  // Sorting
  sortBy: string = 'createdAt';
  sortOrder: string = 'desc';

  // Dropdown options
  sortOptions: DropdownInterface[] = [
    { key: 'createdAt', value: 'Created Date' },
    { key: 'updatedAt', value: 'Updated Date' },
    { key: 'articleName', value: 'Title' }
  ];

  orderOptions: DropdownInterface[] = [
    { key: 'desc', value: 'Descending' },
    { key: 'asc', value: 'Ascending' }
  ];

  statusOptions: DropdownInterface[] = [
    { key: '', value: 'All Articles' },
    { key: 'true', value: 'Published' },
    { key: 'false', value: 'Draft' }
  ];

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private articlesService: ArticlesService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
    this.loadArticles();
  }

  private getPageTitle(): string {
    return 'Personal Blog | Articles';
  }

  loadArticles(): void {
    const params = {
      page: this.currentPage,
      pageSize: this.itemsPerPage,
      orderBy: this.sortBy,
      order: this.sortOrder,
      ...(this.searchQuery && { query: this.searchQuery }),
      published: this.getSelectedStatusOption().key
    };

    this.articlesService.listArticles(params).subscribe({
      next: (response) => {
        this.articles = response.rows;
        this.totalArticles = response.count;
      },
      error: (error) => {
        console.error('Error loading articles:', error);
      }
    });
  }

  // Pagination handlers
  setCurrentPage(page: string): void {
    this.currentPage = page;
    this.loadArticles();
  }

  setItemsPerPage(itemsPerPage: string): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = '0';
    this.loadArticles();
  }

  // Search handler
  onSearchChange(): void {
    this.currentPage = '0';
    this.loadArticles();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearchChange();
  }

  // Filter handlers
  onCategoryChange(option: DropdownInterface): void {
    this.selectedCategory = option.key;
    this.currentPage = '0';
    this.loadArticles();
  }

  onStatusChange(option: DropdownInterface): void {
    this.selectedStatus = option.key;
    this.currentPage = '0';
    this.loadArticles();
  }

  // Sort handlers
  onSortByChange(option: DropdownInterface): void {
    this.sortBy = option.key;
    this.currentPage = '0';
    this.loadArticles();
  }

  onSortOrderChange(option: DropdownInterface): void {
    this.sortOrder = option.key;
    this.currentPage = '0';
    this.loadArticles();
  }

  // Article actions
  togglePublishStatus(article: ListArticleInterface): void {
    this.articlesService.changePublishStatus(article.id).subscribe({
      next: () => {
        this.globalMessageService.handle({
          message: 'Article publish status changed successfully'
        });
      },
      error: (error) => {
        console.error('Error changing publish status:', error);
        this.globalMessageService.handle({
          message: 'Error changing article status'
        });
      }
    });
  }

  deleteArticle(article: ListArticleInterface): void {
    if (confirm(`Are you sure you want to delete "${article.articleName}"?`)) {
      this.articlesService.deleteArticle(article.id).subscribe({
        next: () => {
          this.globalMessageService.handle({
            message: 'Article deleted successfully'
          });
          this.loadArticles();
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

  getSelectedSortOption(): DropdownInterface {
    return (
      this.sortOptions.find((option) => option.key === this.sortBy) ||
      this.sortOptions[0]
    );
  }

  getSelectedOrderOption(): DropdownInterface {
    return (
      this.orderOptions.find((option) => option.key === this.sortOrder) ||
      this.orderOptions[0]
    );
  }

  getSelectedStatusOption(): DropdownInterface {
    return (
      this.statusOptions.find((option) => option.key === this.selectedStatus) ||
      this.statusOptions[0]
    );
  }
}
