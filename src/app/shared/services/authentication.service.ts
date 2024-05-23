import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Observable } from 'rxjs';
import { Controller } from '@interfaces/controller.enum';
import { AuthEndpoint } from '@interfaces/auth.enum';
import { Method } from '@interfaces/methods.enum';
import { LoginPayload } from '@payloads/login.interface';
import { LoginResponse } from '@responses/login.enum';
import { RegistrationPayload } from '@payloads/registration.interface';
import { RegistrationResponse } from '@responses/registration.enum';
import { LogoutResponse } from '@responses/logout.enum';
import { ConfirmationHashEndpoint } from '@interfaces/confirmation-hash.enum';
import { ConfirmAccountPayload } from '@payloads/confirm-account.interface';
import { ConfirmAccountResponse } from '@responses/confirm-account.enum';
import { ForgotPasswordPayload } from '@payloads/forgot-password.interface';
import { ForgotPasswordResponse } from '@responses/forgot-password.enum';
import { ResetUserPasswordPayload } from '@payloads/reset-user-password.interface';
import { ResetUserPasswordResponse } from '@responses/reset-user-password.enum';

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

  refreshTokens(): Observable<{ _at: string }> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.AUTH,
      action: AuthEndpoint.REFRESH
    });
  }

  logout(): Observable<{ message: LogoutResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.AUTH,
      action: AuthEndpoint.LOGOUT
    });
  }

  confirmAccount(
    params: ConfirmAccountPayload
  ): Observable<{ message: ConfirmAccountResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.CONFIRMATION_HASH,
      action: ConfirmationHashEndpoint.ACCOUNT_CONFIRMATION,
      params
    });
  }

  forgotPassword(
    payload: ForgotPasswordPayload
  ): Observable<{ message: ForgotPasswordResponse }> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.USERS,
      action: AuthEndpoint.FORGOT_PASSWORD,
      payload
    });
  }

  resetUserPassword(payload: ResetUserPasswordPayload): Observable<{
    message: ResetUserPasswordResponse;
  }> {
    const params = { confirmationHash: payload.hash };

    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.CONFIRMATION_HASH,
      action: ConfirmationHashEndpoint.RESET_USER_PASSWORD_CONFIRMATION,
      params,
      payload
    });
  }
}
