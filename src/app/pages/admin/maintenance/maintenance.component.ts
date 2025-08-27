import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { GlobalMessageService } from '@shared/global-message.service';
import { MaintenanceService } from '@services/maintenance.service';
import { MaintenanceResponse } from '@responses/maintenance.interface';

@Component({
  selector: 'page-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent extends BaseAdminComponent implements OnInit {
  saving = false;
  loading = true;
  maintenanceMode: MaintenanceResponse | null = null;

  // Form field values
  isActive = false;
  message = '';
  fromDate = '';
  toDate = '';
  heroImageId = '';
  heroTitle = '';
  title = '';
  metaTitle = '';

  // Field error states
  messageError = false;
  fromDateError = false;
  toDateError = false;

  // Error messages
  messageErrorMessage = '';
  fromDateErrorMessage = '';
  toDateErrorMessage = '';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private globalMessageService: GlobalMessageService,
    private maintenanceService: MaintenanceService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    this.loadMaintenanceMode();
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Maintenance Mode';
  }

  private loadMaintenanceMode(): void {
    this.maintenanceService.getMaintenance().subscribe({
      next: (maintenance) => {
        this.maintenanceMode = maintenance;
        this.populateFields(maintenance);
        this.loading = false;
      },
      error: (error) => {
        this.globalMessageService.handleError(
          'Failed to load maintenance mode settings'
        );
        console.error('Failed to load maintenance mode:', error);
        this.loading = false;
      }
    });
  }

  private populateFields(maintenance: MaintenanceResponse): void {
    this.isActive = maintenance.isActive;
    this.message = maintenance.message;
    this.heroImageId = maintenance.heroImageId;
    this.heroTitle = maintenance.heroTitle;
    this.title = maintenance.title;
    this.metaTitle = maintenance.metaTitle;

    // Format dates for input fields (YYYY-MM-DDTHH:MM format for datetime-local)
    if (maintenance.fromDate) {
      const fromDate = new Date(maintenance.fromDate);
      this.fromDate = this.formatDateForInput(fromDate);
    }
    if (maintenance.toDate) {
      const toDate = new Date(maintenance.toDate);
      this.toDate = this.formatDateForInput(toDate);
    }
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onMessageChange(value: string): void {
    this.message = value;
  }

  onMessageError(hasError: boolean): void {
    this.messageError = hasError;
    this.messageErrorMessage = hasError ? 'Message is required' : '';
  }

  onFromDateChange(value: string): void {
    this.fromDate = value;
  }

  onFromDateError(hasError: boolean): void {
    this.fromDateError = hasError;
    this.fromDateErrorMessage = hasError ? 'From date is required' : '';
  }

  onToDateChange(value: string): void {
    this.toDate = value;
  }

  onToDateError(hasError: boolean): void {
    this.toDateError = hasError;
    this.toDateErrorMessage = hasError ? 'To date is required' : '';
  }

  onHeroTitleChange(value: string): void {
    this.heroTitle = value;
  }

  onTitleChange(value: string): void {
    this.title = value;
  }

  onMetaTitleChange(value: string): void {
    this.metaTitle = value;
  }

  private validateRequiredFields(): boolean {
    let isValid = true;

    if (!this.message.trim()) {
      this.messageError = true;
      this.messageErrorMessage = 'Message is required';
      isValid = false;
    }

    if (!this.fromDate.trim()) {
      this.fromDateError = true;
      this.fromDateErrorMessage = 'From date is required';
      isValid = false;
    }

    if (!this.toDate.trim()) {
      this.toDateError = true;
      this.toDateErrorMessage = 'To date is required';
      isValid = false;
    }

    if (
      this.fromDate &&
      this.toDate &&
      new Date(this.fromDate) >= new Date(this.toDate)
    ) {
      this.toDateError = true;
      this.toDateErrorMessage = 'To date must be after from date';
      isValid = false;
    }

    return isValid;
  }

  onSubmit(): void {
    if (!this.validateRequiredFields()) {
      this.globalMessageService.handleError(
        'Please fix the validation errors before submitting'
      );
      return;
    }

    this.saving = true;

    const payload = {
      isActive: this.isActive,
      message: this.message.trim(),
      fromDate: this.fromDate,
      toDate: this.toDate,
      heroImageId: this.heroImageId.trim(),
      heroTitle: this.heroTitle.trim(),
      title: this.title.trim(),
      metaTitle: this.metaTitle.trim()
    };

    this.maintenanceService.updateMaintenance(payload).subscribe({
      next: () => {
        this.globalMessageService.handle({
          message: `Maintenance mode ${this.isActive ? 'activated' : 'deactivated'} successfully`
        });
        this.saving = false;
        this.loadMaintenanceMode(); // Reload to get updated data
      },
      error: (error) => {
        this.globalMessageService.handleError(
          'Failed to update maintenance mode settings'
        );
        console.error('Failed to update maintenance mode:', error);
        this.saving = false;
      }
    });
  }

  onToggleMaintenanceMode(): void {
    this.isActive = !this.isActive;
    this.onSubmit();
  }

  isFormDisabled(): boolean {
    return this.saving || this.loading;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
