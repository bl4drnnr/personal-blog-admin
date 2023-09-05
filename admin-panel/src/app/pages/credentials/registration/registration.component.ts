import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthenticationService } from '@services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'page-registration',
  templateUrl: './registration.component.html',
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
export class RegistrationComponent {
  step = 1;

  email: string;
  password: string;
  authToken: string;

  incorrectEmail = true;
  incorrectPassword = true;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router
  ) {}

  handleRegistration() {
    if (this.wrongCredentials()) return;

    this.authenticationService
      .registration({
        email: this.email,
        password: this.password,
        authToken: this.authToken
      })
      .subscribe({
        next: () => (this.step = 3)
      });
  }

  nextStep() {
    this.step++;
  }

  backStep() {
    this.step--;
  }

  wrongCredentials() {
    return this.incorrectPassword || this.incorrectEmail;
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }
}
