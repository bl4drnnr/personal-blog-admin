import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import {BehaviorSubject, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private apiService: ApiService) {
    const token = localStorage.getItem('_at');
    this._isLoggedIn$.next(!!token);
  }

  login({ email, password }: { email: string; password: string }) {
    return this.apiService.login({ email, password }).pipe(
      tap((response) => {
        localStorage.setItem('_at', response.token);
        this._isLoggedIn$.next(true);
      })
    );
  }
}
