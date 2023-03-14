import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '@services/registration.service';

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

  constructor(private registrationService: RegistrationService) {}

  submit() {
    if (this.form.invalid) return;

    this.registrationService.registration({
      authUsername: this.form.value.authUsername as string,
      authPassword: this.form.value.authPassword as string,
      email: this.form.value.email as string
    });
  }
}