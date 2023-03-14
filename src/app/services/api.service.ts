import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorService } from '@services/error.service';
import { EnvService } from '@services/env.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
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
  }) {
    const registrationUrl = `${this.envService.getFrontProxyUrl}/users/sign-up`;

    return this.http
      .post(registrationUrl, {
        method: 'POST',
        payload: {}
      })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  refreshTokens({ _at }: { _at: string }): Observable<{ _at: string }> {
    const refreshTokensUrl = `${this.envService.getFrontProxyUrl}/refresh`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${_at}`
    });

    return this.http
      .post<{ _at: string }>(refreshTokensUrl, { method: 'GET' }, { headers })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.error.message);
    return throwError(() => error.error.message);
  }
}
