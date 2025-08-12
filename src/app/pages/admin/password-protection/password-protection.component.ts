import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { GlobalMessageService } from '@shared/global-message.service';
import { PasswordProtectionService } from '@services/password-protection.service';
import { PasswordProtectionResponse } from '@responses/password-protection.interface';

@Component({
  selector: 'page-password-protection',
  templateUrl: './password-protection.component.html',
  styleUrls: ['./password-protection.component.scss']
})
export class PasswordProtectionComponent
  extends BaseAdminComponent
  implements OnInit
{
  passwordProtectionMode: PasswordProtectionResponse | null = null;

  // Form fields
  isActive = false;
  password = '';
  durationHours = 24;
  customDuration = 24;
  heroImageId = '';
  heroTitle = '';
  footerText = '';
  metaTitle = '';

  // UI state
  loading = true;
  submitting = false;
  showPassword = false;

  // Validation
  passwordError = false;
  passwordErrorMessage = '';

  // Duration options
  durationOptions = [
    { label: '1 Hour', value: 1 },
    { label: '2 Hours', value: 2 },
    { label: '4 Hours', value: 4 },
    { label: '8 Hours', value: 8 },
    { label: '12 Hours', value: 12 },
    { label: '24 Hours', value: 24 },
    { label: '48 Hours', value: 48 },
    { label: 'Custom', value: -1 }
  ];

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private globalMessageService: GlobalMessageService,
    private passwordProtectionService: PasswordProtectionService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadPasswordProtectionSettings();
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Password Protection Mode';
  }

  private loadPasswordProtectionSettings() {
    this.passwordProtectionService.getPasswordProtectionModeAdmin().subscribe({
      next: (settings) => {
        this.passwordProtectionMode = settings;
        this.isActive = settings.isActive;
        this.password = ''; // Never populate password field
        this.durationHours = settings.durationHours;
        this.heroImageId = settings.heroImageId;
        this.heroTitle = settings.heroTitle;
        this.footerText = settings.footerText;

        // Set custom duration if not in predefined options
        if (!this.durationOptions.find((opt) => opt.value === this.durationHours)) {
          this.customDuration = this.durationHours;
          this.durationHours = -1; // Custom option
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading password protection settings:', error);
        this.globalMessageService.handleError(
          'Failed to load password protection settings'
        );
        this.loading = false;
      }
    });
  }

  isFormDisabled(): boolean {
    return this.loading || this.submitting;
  }

  isFormValid(): boolean {
    if (this.isActive && !this.password) {
      return false;
    }

    return !(
      this.durationHours === -1 &&
      (!this.customDuration || this.customDuration < 1 || this.customDuration > 168)
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onTogglePasswordProtection() {
    this.isActive = !this.isActive;
  }

  onPasswordChange(value: string) {
    this.password = value;
    this.passwordError = false;
  }

  onPasswordError(error: boolean) {
    this.passwordError = error;
    this.passwordErrorMessage = error
      ? 'Password must be between 6 and 50 characters'
      : '';
  }

  onCustomDurationChange(value: string) {
    this.customDuration = parseInt(value, 10) || 24;
  }

  get customDurationString(): string {
    return this.customDuration.toString();
  }

  onHeroTitleChange(value: string) {
    this.heroTitle = value;
  }

  onMetaTitleChange(value: string) {
    this.metaTitle = value;
  }

  onFooterTextChange(value: string) {
    this.footerText = value;
  }

  async onSubmit() {
    if (!this.isFormValid() || this.isFormDisabled()) return;

    this.submitting = true;

    const finalDurationHours =
      this.durationHours === -1 ? this.customDuration : this.durationHours;

    const payload = {
      isActive: this.isActive,
      ...(this.password && { password: this.password }),
      durationHours: finalDurationHours,
      heroImageId: this.heroImageId,
      heroTitle: this.heroTitle,
      footerText: this.footerText,
      metaTitle: this.metaTitle
    };

    this.passwordProtectionService.updatePasswordProtectionMode(payload).subscribe({
      next: () => {
        this.globalMessageService.handle({
          message: 'Password protection settings updated successfully'
        });
        this.loadPasswordProtectionSettings();
        this.password = '';
      },
      error: (error) => {
        console.error('Error updating password protection settings:', error);
        this.globalMessageService.handleError(
          'Failed to update password protection settings'
        );
        this.submitting = false;
      }
    });
  }
}
