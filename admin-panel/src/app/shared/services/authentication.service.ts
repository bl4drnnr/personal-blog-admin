import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Observable } from 'rxjs';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { AuthEndpoint } from '@interfaces/auth.enum';
import { LoginPayload } from '@payloads/login.interface';
import { LoginResponse } from '@responses/login.enum';
import { LogoutResponse } from '@responses/logout.enum';
import { RefreshTokensInterface } from '@payloads/refresh-tokens.interface';
import { ConfirmAccountInterface } from '@payloads/confirm-account.interface';
import { ConfirmAccountResponse } from '@responses/confirm-account.enum';
import { ConfirmationHashEndpoint } from '@interfaces/confirmation-hash.enum';
import { RegistrationPayload } from '@payloads/registration.interface';
import { RegistrationResponse } from '@responses/registration.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private readonly apiService: ApiService) {}

  login(
    payload: LoginPayload
  ): Observable<{ message: LoginResponse; _at: string }> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.AUTH,
      action: AuthEndpoint.LOGIN,
      payload
    });
  }

  registration(
    payload: RegistrationPayload
  ): Observable<{ message: RegistrationResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.AUTH,
      action: AuthEndpoint.REGISTRATION,
      payload
    });
  }

  refreshTokens({
    accessToken
  }: RefreshTokensInterface): Observable<{ _at: string }> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.AUTH,
      action: AuthEndpoint.REFRESH,
      accessToken
    });
  }

  logout(): Observable<{ message: LogoutResponse }> {
    const accessToken = localStorage.getItem('_at')!;
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.AUTH,
      action: AuthEndpoint.LOGOUT,
      accessToken
    });
  }

  confirmAccount({
    confirmationHash
  }: ConfirmAccountInterface): Observable<{ message: ConfirmAccountResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.CONFIRMATION_HASH,
      action: ConfirmationHashEndpoint.ACCOUNT_CONFIRMATION,
      params: { confirmationHash }
    });
  }
}
