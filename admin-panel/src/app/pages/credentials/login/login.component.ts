import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { LoginResponse } from '@responses/login.enum';
import { AuthenticationService } from '@services/authentication.service';

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
  step = 2;

  email: string;
  password: string;

  incorrectEmail: boolean;
  incorrectPassword: boolean;

  isMfaRequired: boolean;

  mfaCode: string;

  isMfaNotSet = true;
  isRecoveryKeysNotSet = true;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router
  ) {}

  incorrectCredentials() {
    return (
      !this.email ||
      !this.password ||
      this.incorrectEmail ||
      this.incorrectPassword
    );
  }

  handleLogIn() {
    if (this.step === 2 && this.incorrectCredentials()) return;

    this.authenticationService
      .login({
        email: this.email,
        password: this.password,
        mfaCode: this.mfaCode
      })
      .subscribe({
        next: async ({ message, _at }) => {
          switch (message) {
            case LoginResponse.MFA_NOT_SET:
              this.step = 1;
              this.isMfaNotSet = true;
              this.isRecoveryKeysNotSet = false;
              break;
            case LoginResponse.RECOVERY_KEYS_NOT_SET:
              this.step = 1;
              this.isMfaNotSet = false;
              this.isRecoveryKeysNotSet = true;
              break;
            case LoginResponse.TOKEN_TWO_FA_REQUIRED:
              this.step = 3;
              this.isMfaRequired = true;
              break;
            default:
              if (_at) {
                localStorage.setItem('_at', _at);
                await this.router.navigate(['account/dashboard']);
              }
          }
        }
      });
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async ngOnInit() {
    const accessToken = localStorage.getItem('_at');

    if (accessToken) await this.handleRedirect('account/dashboard');
  }
}
