import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import {
  AuthenticationService,
  LoginRequest
} from '@services/authentication.service';

@Component({
  selector: 'page-login',
  templateUrl: './login.component.html',
  styleUrls: ['../shared/credentials.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0s', style({ opacity: 0 })),
        animate('0.5s ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  mfaCode: string = '';

  incorrectEmail: boolean = false;
  incorrectPassword: boolean = false;
  isMfaRequired: boolean = false;
  loginError: string = '';

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router
  ) {}

  isFormValid(): boolean {
    return !!(
      this.email &&
      this.password &&
      !this.incorrectEmail &&
      !this.incorrectPassword
    );
  }

  isMfaValid(): boolean {
    return !this.isMfaRequired || (!!this.mfaCode && this.mfaCode.length === 6);
  }

  handleLogin() {
    if (!this.isFormValid() || !this.isMfaValid()) {
      return;
    }

    const loginData: LoginRequest = {
      email: this.email,
      password: this.password
    };

    if (this.mfaCode) {
      loginData.mfaCode = this.mfaCode;
    }

    this.authenticationService.login(loginData).subscribe({
      next: (response) => {
        if (response._at) {
          localStorage.setItem('_at', response._at);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        if (error.status === 401) {
          this.loginError = 'Invalid credentials';
        } else if (error.error?.message === 'TOKEN_TWO_FA_REQUIRED') {
          this.isMfaRequired = true;
          this.loginError = '';
        } else {
          this.loginError = 'Login failed. Please try again.';
        }
      }
    });
  }

  onEmailChange(email: string) {
    this.email = email;
    this.incorrectEmail = false;
    this.loginError = '';
  }

  onPasswordChange(password: string) {
    this.password = password;
    this.incorrectPassword = false;
    this.loginError = '';
  }

  onMfaChange(mfaCode: string) {
    this.mfaCode = mfaCode;
    this.loginError = '';
  }

  ngOnInit() {
    const accessToken = localStorage.getItem('_at');
    if (accessToken) {
      this.router.navigate(['/dashboard']);
    }
  }
}
