import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountConfirmationService } from '@services/account-confirmation.service';
import { GlobalMessageService } from '@services/global-message.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-confirmation',
  templateUrl: './account-confirmation.component.html'
})
export class AccountConfirmation implements OnInit {
  form = new FormGroup({
    password: new FormControl<string>('', Validators.required),
    passwordRepeat: new FormControl<string>('', Validators.required)
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountConfirmationService: AccountConfirmationService,
    private globalMessageService: GlobalMessageService
  ) {}

  public confirmationHash: string;

  async ngOnInit() {
    this.confirmationHash =
      (this.route.snapshot.paramMap.get('confirmationHash') as string) || '';

    if (!this.confirmationHash) await this.router.navigate(['login']);
  }

  submit() {
    if (
      this.form.invalid ||
      this.form.value.password !== this.form.value.passwordRepeat
    )
      return;

    this.accountConfirmationService
      .confirmAccount({
        confirmationHash: this.confirmationHash,
        password: this.form.value.password as string
      })
      .subscribe(async ({ message }) => {
        if (message === 'success') {
          this.globalMessageService.handle({
            message: 'Account has been successfully confirmed'
          });
          await this.router.navigate(['login']);
        }
      });
  }
}
