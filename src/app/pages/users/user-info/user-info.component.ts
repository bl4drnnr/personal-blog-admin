import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { UsersService } from '@services/users.service';
import { UserInfoResponse } from '@responses/user-info.interface';
import { UpdateUserProfileData } from '@interfaces/users/user-info.interface';

@Component({
  selector: 'page-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent extends BaseAdminComponent implements OnInit {
  override userInfo: UserInfoResponse;
  isEditing = false;
  isSaving = false;

  // Form fields
  firstName = '';
  lastName = '';
  email = '';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private usersService: UsersService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadUserInfo();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | User Information';
  }

  loadUserInfo(): void {
    this.usersService.getUserInfo().subscribe({
      next: (userInfo) => {
        this.userInfo = userInfo;
        this.populateForm();
      },
      error: (error) => {
        console.error('Error loading user info:', error);
      }
    });
  }

  populateForm(): void {
    if (this.userInfo) {
      this.firstName = this.userInfo.firstName || '';
      this.lastName = this.userInfo.lastName || '';
      this.email = this.userInfo.email || '';
    }
  }

  startEditing(): void {
    this.isEditing = true;
    this.populateForm(); // Reset form to original values
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.populateForm(); // Reset form to original values
  }

  saveProfile(): void {
    if (!this.firstName.trim() || !this.lastName.trim() || !this.email.trim()) {
      alert('All fields are required');
      return;
    }

    this.isSaving = true;

    const updateData: UpdateUserProfileData = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim()
    };

    this.usersService.updateUserProfile(updateData).subscribe({
      next: (updatedUser) => {
        this.userInfo = updatedUser;
        this.isEditing = false;
        this.isSaving = false;
        alert('Profile updated successfully!');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.isSaving = false;
        alert('Error updating profile. Please try again.');
      }
    });
  }

  getFullName(): string {
    if (!this.userInfo) return '';
    const firstName = this.userInfo.firstName || '';
    const lastName = this.userInfo.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'No name provided';
  }

  getInitials(): string {
    if (!this.userInfo) return '??';
    const firstName = this.userInfo.firstName || '';
    const lastName = this.userInfo.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '??';
  }
}
