import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { AuthenticationService } from '@services/authentication.service';
import { RegistrationPayload } from '@payloads/registration.interface';
import { WrongCredentialsInterface } from '@interfaces/wrong-credentials.interface';
import { Titles } from '@interfaces/titles.enum';
import { TranslationService } from '@services/translation.service';

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
export class RegistrationComponent implements OnInit {
  step = 1;
  tac = false;

  email: string;
  password: string;

  firstName: string;
  lastName: string;

  incorrectEmail = true;
  incorrectPassword = true;
  incorrectFirstName: boolean;
  incorrectLastName: boolean;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly translationService: TranslationService,
    private readonly router: Router
  ) {}

  handleRegistration() {
    if (this.wrongCredentials({ includeAll: true })) return;

    const registrationPayload: RegistrationPayload = {
      email: this.email,
      password: this.password,
      tac: this.tac,
      firstName: this.firstName,
      lastName: this.lastName
    };

    this.authenticationService
      .registration({
        ...registrationPayload
      })
      .subscribe({
        next: () => (this.step = 3)
      });
  }

  nextStep() {
    if (this.wrongCredentials({ includeAll: false })) return;
    this.step++;
  }

  backStep() {
    this.step--;
  }

  wrongCredentials({ includeAll }: WrongCredentialsInterface) {
    const incorrectCredentials = this.incorrectPassword || this.incorrectEmail;

    const incorrectAllCredentials =
      incorrectCredentials ||
      !this.tac ||
      this.lastName.length < 1 ||
      this.firstName.length < 1 ||
      this.incorrectFirstName ||
      this.incorrectLastName;

    return !includeAll ? incorrectCredentials : incorrectAllCredentials;
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    this.translationService.setPageTitle(Titles.REGISTRATION);
  }
}
