import { ApiService } from '@shared/api.service';
import { Injectable } from '@angular/core';
import { Controller } from '@interfaces/controller.enum';
import { Method } from '@interfaces/methods.enum';
import { Observable } from 'rxjs';
import { UsersEndpoint } from '@interfaces/users.enum';
import { UserInfoResponse } from '@responses/user-info.interface';
import {
  ChangePasswordData,
  UpdateUserProfileData
} from '@interfaces/users/user-info.interface';
import { SecurityInfo } from '@interfaces/users/security-info.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private readonly apiService: ApiService) {}

  getUserInfo(): Observable<UserInfoResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.USERS,
      action: UsersEndpoint.USER_INFO
    });
  }

  getSecurityInfo(): Observable<SecurityInfo> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.USERS,
      action: UsersEndpoint.SECURITY_INFO
    });
  }

  updateUserProfile(payload: UpdateUserProfileData): Observable<UserInfoResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.USERS,
      action: UsersEndpoint.UPDATE_PROFILE,
      payload
    });
  }

  changePassword(data: ChangePasswordData): Observable<{ message: string }> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.USERS,
      action: UsersEndpoint.CHANGE_PASSWORD,
      payload: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      }
    });
  }
}
