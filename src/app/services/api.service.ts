import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { GlobalMessageService } from '@services/global-message.service';
import { EnvService } from '@services/env.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private globalMessageService: GlobalMessageService,
    private envService: EnvService
  ) {}

  login({
    email,
    password
  }: {
    email: string;
    password: string;
  }): Observable<{ _at: string }> {
    const loginUrl = `${this.envService.getFrontProxyUrl}/users/sign-in`;

    return this.http
      .post<{ _at: string }>(loginUrl, {
        method: 'POST',
        payload: { email, password }
      })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  registration({
    authUsername,
    authPassword,
    email
  }: {
    authUsername: string;
    authPassword: string;
    email: string;
  }): Observable<{ message: string }> {
    const registrationUrl = `${this.envService.getFrontProxyUrl}/users/sign-up`;
    const basicAuth = 'Basic ' + btoa(authUsername + ':' + authPassword);
    const headers = new HttpHeaders({
      'registration-authorization': basicAuth
    });

    return this.http
      .post<{ message: string }>(
        registrationUrl,
        {
          method: 'POST',
          payload: { email }
        },
        { headers }
      )
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  refreshTokens({ _at }: { _at: string }): Observable<{ _at: string }> {
    const refreshTokensUrl = `${this.envService.getFrontProxyUrl}/auth/refresh`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${_at}`
    });

    return this.http
      .post<{ _at: string }>(refreshTokensUrl, { method: 'GET' }, { headers })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  private errorHandler(error: HttpErrorResponse) {
    this.globalMessageService.handle({
      message: error.error.message,
      isError: true
    });
    return throwError(() => error.error.message);
  }
}
