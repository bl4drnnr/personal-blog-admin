import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '@responses/login.enum';
import { LoginPayload } from '@payloads/login.interface';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { AuthEndpoint } from '@interfaces/auth.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private readonly apiService: ApiService) {}

  login(payload: LoginPayload): Observable<{ message: LoginResponse; _at: string }> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.AUTH,
      action: AuthEndpoint.LOGIN,
      payload
    });
  }

  logout(): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.AUTH,
      action: AuthEndpoint.LOGOUT
    });
  }

  refreshTokens(): Observable<{ _at: string }> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.AUTH,
      action: AuthEndpoint.REFRESH
    });
  }
}
