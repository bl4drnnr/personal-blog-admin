import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl<string>(''),
    password: new FormControl<string>('')
  });

  submit() {
    console.log(this.form.value);
  }
}
