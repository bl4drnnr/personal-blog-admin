import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { GlobalMessageService } from '@shared/global-components-services/global-message.service';
import { ContactService } from '@shared/services/contact.service';
import { ContactMessage } from '@interfaces/contact/contact-message.interface';
import { DropdownInterface } from '@interfaces/dropdown.interface';

@Component({
  selector: 'page-contact-messages',
  templateUrl: './contact-messages.component.html',
  styleUrls: ['./contact-messages.component.scss']
})
export class ContactMessagesComponent extends BaseAdminComponent implements OnInit {
  contactMessages: ContactMessage[] = [];
  totalMessages: number = 0;

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
    { key: 'name', value: 'Name' },
    { key: 'email', value: 'Email' }
  ];

  orderOptions: DropdownInterface[] = [
    { key: 'desc', value: 'Descending' },
    { key: 'asc', value: 'Ascending' }
  ];

  statusOptions: DropdownInterface[] = [
    { key: '', value: 'All Messages' },
    { key: 'unread', value: 'Unread Only' },
    { key: 'read', value: 'Read Only' }
  ];

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private contactService: ContactService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
    this.loadContactMessages();
  }

  private getPageTitle(): string {
    return 'Personal Blog | Contact Messages';
  }

  loadContactMessages(): void {
    const params = {
      page: this.currentPage,
      pageSize: this.itemsPerPage,
      orderBy: this.sortBy,
      order: this.sortOrder,
      ...(this.searchQuery && { query: this.searchQuery }),
      ...(this.selectedStatus && { status: this.selectedStatus })
    };

    this.contactService.listMessages(params).subscribe({
      next: (response) => {
        this.contactMessages = response.rows;
        this.totalMessages = response.count;
      },
      error: (error) => {
        console.error('Failed to load contact messages:', error);
        this.globalMessageService.handleError('Failed to load contact messages');
      }
    });
  }

  // Search functionality
  onSearchChange(): void {
    this.currentPage = '0'; // Reset to first page
    this.loadContactMessages();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = '0';
    this.loadContactMessages();
  }

  // Filter functionality
  onStatusChange(option: DropdownInterface): void {
    this.selectedStatus = option.key;
    this.currentPage = '0';
    this.loadContactMessages();
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
    this.loadContactMessages();
  }

  onOrderChange(option: DropdownInterface): void {
    this.sortOrder = option.key;
    this.loadContactMessages();
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
    this.loadContactMessages();
  }

  onPageSizeChange(pageSize: string): void {
    this.itemsPerPage = pageSize;
    this.currentPage = '0';
    this.loadContactMessages();
  }

  get startIndex(): number {
    return parseInt(this.currentPage) * parseInt(this.itemsPerPage) + 1;
  }

  get endIndex(): number {
    const end = (parseInt(this.currentPage) + 1) * parseInt(this.itemsPerPage);
    return Math.min(end, this.totalMessages);
  }

  markAsRead(messageId: string): void {
    this.contactService.markAsRead(messageId).subscribe({
      next: () => {
        const message = this.contactMessages.find((m) => m.id === messageId);
        if (message) {
          message.isRead = true;
        }
        this.globalMessageService.handle({
          message: 'Message marked as read'
        });
      },
      error: (error) => {
        console.error('Failed to mark message as read:', error);
        this.globalMessageService.handleError('Failed to mark message as read');
      }
    });
  }

  markAsUnread(messageId: string): void {
    this.contactService.markAsUnread(messageId).subscribe({
      next: () => {
        const message = this.contactMessages.find((m) => m.id === messageId);
        if (message) {
          message.isRead = false;
        }
        this.globalMessageService.handle({
          message: 'Message marked as unread'
        });
      },
      error: (error) => {
        console.error('Failed to mark message as unread:', error);
        this.globalMessageService.handleError('Failed to mark message as unread');
      }
    });
  }

  deleteMessage(messageId: string): void {
    if (confirm('Are you sure you want to delete this message?')) {
      this.contactService.deleteMessage(messageId).subscribe({
        next: () => {
          this.contactMessages = this.contactMessages.filter(
            (m) => m.id !== messageId
          );
          this.globalMessageService.handle({
            message: 'Message deleted successfully'
          });
        },
        error: (error) => {
          console.error('Failed to delete message:', error);
          this.globalMessageService.handleError('Failed to delete message');
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

  getUnreadCount(): number {
    return this.contactMessages.filter((m) => !m.isRead).length;
  }

  trackByMessageId(index: number, message: ContactMessage): string {
    return message.id;
  }
}
