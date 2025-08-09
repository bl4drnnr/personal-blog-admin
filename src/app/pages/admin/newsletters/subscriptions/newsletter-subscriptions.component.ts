import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { GlobalMessageService } from '@shared/global-components-services/global-message.service';
import { NewslettersService } from '@shared/services/newsletters.service';
import { NewsletterSubscription } from '@interfaces/newsletter/newsletter-subscription.interface';
import { DropdownInterface } from '@interfaces/dropdown.interface';

@Component({
  selector: 'page-newsletter-subscriptions',
  templateUrl: './newsletter-subscriptions.component.html',
  styleUrls: ['./newsletter-subscriptions.component.scss']
})
export class NewsletterSubscriptionsComponent
  extends BaseAdminComponent
  implements OnInit
{
  subscriptions: NewsletterSubscription[] = [];
  totalSubscriptions: number = 0;

  // Pagination
  currentPage: string = '0';
  itemsPerPage: string = '10';

  // Search and filters
  searchQuery: string = '';
  selectedStatus: string = '';

  // Sorting
  sortBy: string = 'createdAt';
  sortOrder: string = 'desc';

  // Dropdown options
  sortOptions: DropdownInterface[] = [
    { key: 'createdAt', value: 'Created Date' },
    { key: 'updatedAt', value: 'Updated Date' },
    { key: 'email', value: 'Email' }
  ];

  orderOptions: DropdownInterface[] = [
    { key: 'desc', value: 'Descending' },
    { key: 'asc', value: 'Ascending' }
  ];

  statusOptions: DropdownInterface[] = [
    { key: '', value: 'All Subscriptions' },
    { key: 'confirmed', value: 'Confirmed Only' },
    { key: 'unconfirmed', value: 'Unconfirmed Only' }
  ];

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private newslettersService: NewslettersService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
    this.loadSubscriptions();
  }

  private getPageTitle(): string {
    return 'Personal Blog | Newsletter Subscriptions';
  }

  loadSubscriptions(): void {
    const params = {
      page: this.currentPage,
      pageSize: this.itemsPerPage,
      orderBy: this.sortBy,
      order: this.sortOrder,
      ...(this.searchQuery && { query: this.searchQuery }),
      ...(this.selectedStatus && { status: this.selectedStatus })
    };

    this.newslettersService.listSubscriptions(params).subscribe({
      next: (response) => {
        this.subscriptions = response.rows;
        this.totalSubscriptions = response.count;
      },
      error: (error) => {
        console.error('Failed to load newsletter subscriptions:', error);
        this.globalMessageService.handleError(
          'Failed to load newsletter subscriptions'
        );
      }
    });
  }

  // Search functionality
  onSearchChange(): void {
    this.currentPage = '0'; // Reset to first page
    this.loadSubscriptions();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = '0';
    this.loadSubscriptions();
  }

  // Filter functionality
  onStatusChange(option: DropdownInterface): void {
    this.selectedStatus = option.key;
    this.currentPage = '0';
    this.loadSubscriptions();
  }

  getSelectedStatusOption(): DropdownInterface {
    return (
      this.statusOptions.find((option) => option.key === this.selectedStatus) ||
      this.statusOptions[0]
    );
  }

  // Sorting functionality
  onSortByChange(option: DropdownInterface): void {
    this.sortBy = option.key;
    this.loadSubscriptions();
  }

  onOrderChange(option: DropdownInterface): void {
    this.sortOrder = option.key;
    this.loadSubscriptions();
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

  // Pagination functionality
  onPageChange(page: string): void {
    this.currentPage = page;
    this.loadSubscriptions();
  }

  onPageSizeChange(pageSize: string): void {
    this.itemsPerPage = pageSize;
    this.currentPage = '0';
    this.loadSubscriptions();
  }

  get startIndex(): number {
    return parseInt(this.currentPage) * parseInt(this.itemsPerPage) + 1;
  }

  get endIndex(): number {
    const end = (parseInt(this.currentPage) + 1) * parseInt(this.itemsPerPage);
    return Math.min(end, this.totalSubscriptions);
  }

  deleteSubscription(subscriptionId: string): void {
    if (
      confirm(
        'Are you sure you want to delete this subscription? This will unsubscribe the user completely.'
      )
    ) {
      this.newslettersService.deleteSubscription(subscriptionId).subscribe({
        next: () => {
          this.subscriptions = this.subscriptions.filter(
            (s) => s.id !== subscriptionId
          );
          this.totalSubscriptions--;
          this.globalMessageService.handle({
            message: 'Subscription deleted successfully'
          });
        },
        error: (error) => {
          console.error('Failed to delete subscription:', error);
          this.globalMessageService.handleError('Failed to delete subscription');
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return (
      new Date(dateString).toLocaleDateString() +
      ' ' +
      new Date(dateString).toLocaleTimeString()
    );
  }

  getConfirmedCount(): number {
    return this.subscriptions.filter((s) => s.isConfirmed).length;
  }

  getUnconfirmedCount(): number {
    return this.subscriptions.filter((s) => !s.isConfirmed).length;
  }

  trackBySubscriptionId(
    index: number,
    subscription: NewsletterSubscription
  ): string {
    return subscription.id;
  }
}
