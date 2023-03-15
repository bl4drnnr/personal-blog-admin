import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '@services/registration.service';
import { Router } from '@angular/router';
import {GlobalMessageService} from "@services/global-message.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent {
  form = new FormGroup({
    authUsername: new FormControl<string>('', Validators.required),
    authPassword: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', Validators.required)
  });

  constructor(
    private registrationService: RegistrationService,
    private router: Router,
    private globalMessageService: GlobalMessageService
  ) {}

  submit() {
    if (this.form.invalid) return;

    this.registrationService
      .registration({
        authUsername: this.form.value.authUsername as string,
        authPassword: this.form.value.authPassword as string,
        email: this.form.value.email as string
      })
      .subscribe(async () => {
        this.globalMessageService.handle({
          message: 'Confirmation email has been sent'
        });
        await this.router.navigate(['login'])
      });
  }
}
