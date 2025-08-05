import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { FaqService } from '@shared/services/faq.service';
import {
  Faq,
  CreateFaqData,
  UpdateFaqData,
  GetFaqsParams
} from '@interfaces/faq/faq.interface';
import { GlobalMessageService } from '@shared/global-components-services/global-message.service';
import { DropdownInterface } from '@interfaces/components/dropdown.interface';

@Component({
  selector: 'page-faq-management',
  templateUrl: './faq-management.component.html',
  styleUrls: ['./faq-management.component.scss']
})
export class FaqManagementComponent extends BaseAdminComponent implements OnInit {
  faqs: Faq[] = [];
  filteredFaqs: Faq[] = [];

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  totalItems = 0;

  // Filters
  searchTerm = '';
  filterActive: boolean | null = null;
  filterFeatured: boolean | null = null;

  // Dropdown options for filters
  statusFilterOptions: DropdownInterface[] = [
    { key: 'all', value: 'All' },
    { key: 'active', value: 'Active Only' },
    { key: 'inactive', value: 'Inactive Only' }
  ];

  featuredFilterOptions: DropdownInterface[] = [
    { key: 'all', value: 'All' },
    { key: 'featured', value: 'Featured Only' },
    { key: 'not-featured', value: 'Not Featured' }
  ];

  selectedStatusFilter: DropdownInterface = this.statusFilterOptions[0];
  selectedFeaturedFilter: DropdownInterface = this.featuredFilterOptions[0];

  // Form state
  showAddForm = false;
  editingFaq: Faq | null = null;

  // Form fields
  question = '';
  answer = '';
  sortOrder = 0;
  isActive = true;
  featured = false;

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private faqService: FaqService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadFaqs();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | FAQ Management';
  }

  loadFaqs(): void {
    const params: GetFaqsParams = {
      page: this.currentPage,
      pageSize: this.pageSize,
      orderBy: 'sortOrder',
      order: 'ASC'
    };

    if (this.searchTerm.trim()) {
      params.search = this.searchTerm.trim();
    }

    if (this.filterActive !== null) {
      params.isActive = this.filterActive;
    }

    if (this.filterFeatured !== null) {
      params.featured = this.filterFeatured;
    }

    this.faqService.getFaqs(params).subscribe({
      next: (response) => {
        this.faqs = response.faqs;
        this.filteredFaqs = [...this.faqs];
        this.totalPages = response.pagination.totalPages;
        this.totalItems = response.pagination.total;
      },
      error: (error) => {
        console.error('Error loading FAQs:', error);
        this.globalMessageService.handle({
          message: 'Failed to load FAQs. Please try again.',
          isError: true
        });
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadFaqs();
  }

  onStatusFilterChange(option: DropdownInterface): void {
    this.selectedStatusFilter = option;
    switch (option.key) {
      case 'active':
        this.filterActive = true;
        break;
      case 'inactive':
        this.filterActive = false;
        break;
      default:
        this.filterActive = null;
    }
    this.currentPage = 0;
    this.loadFaqs();
  }

  onFeaturedFilterChange(option: DropdownInterface): void {
    this.selectedFeaturedFilter = option;
    switch (option.key) {
      case 'featured':
        this.filterFeatured = true;
        break;
      case 'not-featured':
        this.filterFeatured = false;
        break;
      default:
        this.filterFeatured = null;
    }
    this.currentPage = 0;
    this.loadFaqs();
  }

  onPageChange(page: string): void {
    this.currentPage = parseInt(page, 10) || 0;
    this.loadFaqs();
  }

  onPageSizeChange(pageSize: string): void {
    this.pageSize = parseInt(pageSize, 10) || 20;
    this.currentPage = 0;
    this.loadFaqs();
  }

  showAddDialog(): void {
    this.resetForm();
    this.showAddForm = true;
    this.editingFaq = null;
  }

  showEditDialog(faq: Faq): void {
    this.populateForm(faq);
    this.showAddForm = true;
    this.editingFaq = faq;
  }

  hideDialog(): void {
    this.showAddForm = false;
    this.editingFaq = null;
    this.resetForm();
  }

  resetForm(): void {
    this.question = '';
    this.answer = '';
    this.sortOrder =
      this.faqs.length > 0 ? Math.max(...this.faqs.map((f) => f.sortOrder)) + 1 : 0;
    this.isActive = true;
    this.featured = false;
  }

  populateForm(faq: Faq): void {
    this.question = faq.question;
    this.answer = faq.answer;
    this.sortOrder = faq.sortOrder;
    this.isActive = faq.isActive;
    this.featured = faq.featured;
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.globalMessageService.handle({
        message: 'Please fill in all required fields.',
        isError: true
      });
      return;
    }

    const data: CreateFaqData | UpdateFaqData = {
      question: this.question.trim(),
      answer: this.answer.trim(),
      sortOrder: this.sortOrder,
      isActive: this.isActive,
      featured: this.featured
    };

    if (this.editingFaq) {
      this.updateFaq(data as UpdateFaqData);
    } else {
      this.createFaq(data as CreateFaqData);
    }
  }

  createFaq(data: CreateFaqData): void {
    this.faqService.createFaq(data).subscribe({
      next: () => {
        this.globalMessageService.handle({
          message: 'FAQ created successfully!',
          isError: false
        });
        this.hideDialog();
        this.loadFaqs();
      },
      error: (error) => {
        console.error('Error creating FAQ:', error);
        this.globalMessageService.handle({
          message: 'Failed to create FAQ. Please try again.',
          isError: true
        });
      }
    });
  }

  updateFaq(data: UpdateFaqData): void {
    if (!this.editingFaq) return;

    this.faqService.updateFaq(this.editingFaq.id, data).subscribe({
      next: () => {
        this.globalMessageService.handle({
          message: 'FAQ updated successfully!',
          isError: false
        });
        this.hideDialog();
        this.loadFaqs();
      },
      error: (error) => {
        console.error('Error updating FAQ:', error);
        this.globalMessageService.handle({
          message: 'Failed to update FAQ. Please try again.',
          isError: true
        });
      }
    });
  }

  onDelete(faq: Faq): void {
    if (confirm(`Are you sure you want to delete the FAQ: "${faq.question}"?`)) {
      this.faqService.deleteFaq(faq.id).subscribe({
        next: () => {
          this.globalMessageService.handle({
            message: 'FAQ deleted successfully!',
            isError: false
          });
          this.loadFaqs();
        },
        error: (error) => {
          console.error('Error deleting FAQ:', error);
          this.globalMessageService.handle({
            message: 'Failed to delete FAQ. Please try again.',
            isError: true
          });
        }
      });
    }
  }

  onToggleActive(faq: Faq): void {
    const data: UpdateFaqData = {
      isActive: !faq.isActive
    };

    this.faqService.updateFaq(faq.id, data).subscribe({
      next: () => {
        this.globalMessageService.handle({
          message: `FAQ ${data.isActive ? 'activated' : 'deactivated'} successfully!`,
          isError: false
        });
        this.loadFaqs();
      },
      error: (error) => {
        console.error('Error toggling FAQ status:', error);
        this.globalMessageService.handle({
          message: 'Failed to update FAQ status. Please try again.',
          isError: true
        });
      }
    });
  }

  onToggleFeatured(faq: Faq): void {
    const data: UpdateFaqData = {
      featured: !faq.featured
    };

    this.faqService.updateFaq(faq.id, data).subscribe({
      next: () => {
        this.globalMessageService.handle({
          message: `FAQ ${data.featured ? 'featured' : 'unfeatured'} successfully!`,
          isError: false
        });
        this.loadFaqs();
      },
      error: (error) => {
        console.error('Error toggling FAQ featured status:', error);
        this.globalMessageService.handle({
          message: 'Failed to update FAQ featured status. Please try again.',
          isError: true
        });
      }
    });
  }

  isFormValid(): boolean {
    return this.question.trim().length > 0 && this.answer.trim().length > 0;
  }

  getStatusBadgeClass(faq: Faq): string {
    return faq.isActive ? 'badge-success' : 'badge-error';
  }

  getFeaturedBadgeClass(faq: Faq): string {
    return faq.featured ? 'badge-featured' : 'badge-normal';
  }

  trackByFaq(index: number, faq: Faq): string {
    return faq.id;
  }

  protected readonly parseInt = parseInt;
}
