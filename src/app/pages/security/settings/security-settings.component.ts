import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { UsersService } from '@services/users.service';
import { ValidationService } from '@services/validation.service';
import { ChangePasswordData } from '@interfaces/users/user-info.interface';
import { SecurityInfo } from '@interfaces/users/security-info.interface';

@Component({
  selector: 'page-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss']
})
export class SecuritySettingsComponent extends BaseAdminComponent implements OnInit {
  showPasswordForm = false;
  isChangingPassword = false;

  // Security info
  securityInfo: SecurityInfo | null = null;

  // Password form fields
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // 2FA settings
  isMfaEnabled = false;
  showMfaSetup = false;

  // Password validation rules
  passwordRules: Array<{ error: boolean; text: string }> = [];

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private usersService: UsersService,
    private validationService: ValidationService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadSecurityInfo();
    await this.updatePasswordRules();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Security Settings';
  }

  loadSecurityInfo(): void {
    this.usersService.getSecurityInfo().subscribe({
      next: (securityInfo) => {
        this.securityInfo = securityInfo;
        this.isMfaEnabled = securityInfo.isMfaEnabled;
      },
      error: (error) => {
        console.error('Error loading security info:', error);
      }
    });
  }

  showPasswordChangeForm(): void {
    this.showPasswordForm = true;
    this.resetPasswordForm();
  }

  hidePasswordChangeForm(): void {
    this.showPasswordForm = false;
    this.resetPasswordForm();
  }

  resetPasswordForm(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.updatePasswordRules();
  }

  changePassword(): void {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      alert('All password fields are required');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (this.newPassword.length < 8) {
      alert('New password must be at least 8 characters long');
      return;
    }

    this.isChangingPassword = true;

    const changePasswordData: ChangePasswordData = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    this.usersService.changePassword(changePasswordData).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.hidePasswordChangeForm();
        alert('Password changed successfully!');
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.isChangingPassword = false;
        alert(
          'Error changing password. Please check your current password and try again.'
        );
      }
    });
  }

  toggleMfaSetup(): void {
    this.showMfaSetup = !this.showMfaSetup;
  }

  getPasswordStrength(): string {
    const password = this.newPassword;
    if (!password) return '';

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    switch (strength) {
      case 0:
      case 1:
        return 'weak';
      case 2:
      case 3:
        return 'medium';
      case 4:
      case 5:
        return 'strong';
      default:
        return '';
    }
  }

  getPasswordStrengthLabel(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak':
        return 'Weak';
      case 'medium':
        return 'Medium';
      case 'strong':
        return 'Strong';
      default:
        return '';
    }
  }

  async updatePasswordRules(): Promise<void> {
    this.passwordRules = await this.validationService.checkPasswordsRules(
      this.newPassword
    );
  }

  async onPasswordChange(): Promise<void> {
    await this.updatePasswordRules();
  }

  // Validation helper methods for template
  hasMinLength(): boolean {
    return this.newPassword.length >= 8;
  }

  hasLowercase(): boolean {
    return /[a-z]/.test(this.newPassword);
  }

  hasUppercase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }

  hasNumbers(): boolean {
    return /[0-9]/.test(this.newPassword);
  }

  hasSpecialChars(): boolean {
    return /[^A-Za-z0-9]/.test(this.newPassword);
  }

  passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword;
  }

  getLastPasswordChangeText(): string {
    if (!this.securityInfo?.lastPasswordChange) {
      return 'Not available';
    }
    const date = new Date(this.securityInfo.lastPasswordChange);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getCurrentPasswordStrength(): string {
    // Since we don't have access to the current password, we'll show a default status
    return 'Strong';
  }

  getSessionDevice(): string {
    return this.securityInfo?.sessionInfo?.currentSession?.device || 'Web Browser';
  }

  getSessionLocation(): string {
    return this.securityInfo?.sessionInfo?.currentSession?.location || 'Unknown';
  }

  getSessionLastActivity(): string {
    if (!this.securityInfo?.sessionInfo?.currentSession?.lastActivity) {
      return 'Just now';
    }
    return 'Just now'; // For now, we'll show this as real-time
  }
}
