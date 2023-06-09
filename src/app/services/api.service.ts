import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { GlobalMessageService } from '@services/global-message.service';
import { EnvService } from '@services/env.service';
import { IProject } from '@models/project.model';
import { IPost } from '@models/post.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private globalMessageService: GlobalMessageService,
    private envService: EnvService
  ) {}

  frontProxyUrl: string = this.envService.getFrontProxyUrl;

  login({
    email,
    password
  }: {
    email: string;
    password: string;
  }): Observable<{ _at: string }> {
    const loginUrl = `${this.frontProxyUrl}/users/sign-in`;

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
    const registrationUrl = `${this.frontProxyUrl}/users/sign-up`;
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

  confirmAccount({
    confirmationHash,
    password
  }: {
    confirmationHash: string;
    password: string;
  }): Observable<{ message: string }> {
    const confirmAccountUrl = `${this.frontProxyUrl}/users/account-confirmation`;

    return this.http
      .post<{ message: string }>(confirmAccountUrl, {
        method: 'POST',
        params: { confirmationHash },
        payload: { password }
      })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  basicContentEdition({
    id,
    method,
    action,
    typeOfContent,
    payload,
    language,
    page,
    pageSize,
    order,
    orderBy,
    searchQuery,
    postTypes
  }: {
    id?: string;
    method: string;
    action: string;
    typeOfContent: string;
    payload?: IProject | IPost;
    language?: string;
    page?: number;
    pageSize?: number;
    order?: string;
    orderBy?: string;
    searchQuery?: string;
    postTypes?: string;
  }): Observable<
    | { rows: Array<IPost>; count: number }
    | { rows: Array<IProject>; count: number }
    | IPost
    | IProject
    | { message: string }
  > {
    const requestUrl = `${this.frontProxyUrl}/${typeOfContent}/${action}`;

    return this.http
      .post(requestUrl, {
        method,
        payload,
        params: {
          id,
          language,
          page,
          pageSize,
          order,
          orderBy,
          searchQuery,
          postTypes
        }
      })
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
