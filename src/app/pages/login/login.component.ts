import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Router} from "@angular/router";
import {AuthService} from "@services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required)
  });

  constructor(private authService: AuthService, private router: Router) {}

  submit() {
    if (this.form.invalid) return;

    this.authService.login({
      email: this.form.value.email as string,
      password: this.form.value.password as string
    }).subscribe(async () => {
      await this.router.navigate(['/posts']);
    })
  }
}
