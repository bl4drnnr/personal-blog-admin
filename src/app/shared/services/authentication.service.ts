import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from '@shared/env.service';
import { environment } from '@env/environment.development';

export interface LoginRequest {
  email: string;
  password: string;
  mfaCode?: string;
}

export interface LoginResponse {
  _at: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly apiUrl: string;

  constructor(
    private readonly http: HttpClient,
    private readonly envService: EnvService
  ) {
    this.apiUrl = this.envService.getApiUrl;
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    const basicAuthCredentials = btoa(
      `${environment.basicAuth.username}:${environment.basicAuth.password}`
    );
    const headers = new HttpHeaders({
      Authorization: `Basic ${basicAuthCredentials}`
    });

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, payload, {
      headers,
      withCredentials: true
    });
  }

  logout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/logout`, {
      withCredentials: true
    });
  }

  refreshTokens(): Observable<{ _at: string }> {
    return this.http.get<{ _at: string }>(`${this.apiUrl}/auth/refresh`, {
      withCredentials: true
    });
  }
}
