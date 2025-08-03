export interface UserInfo {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isMfaSet: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
