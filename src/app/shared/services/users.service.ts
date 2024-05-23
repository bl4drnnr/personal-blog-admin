import { ApiService } from '@shared/api.service';
import { Injectable } from '@angular/core';
import { Controller } from '@interfaces/controller.enum';
import { Method } from '@interfaces/methods.enum';
import { Observable } from 'rxjs';
import { UsersEndpoint } from '@interfaces/users.enum';
import { UserInfoResponse } from '@responses/user-info.interface';

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
}
