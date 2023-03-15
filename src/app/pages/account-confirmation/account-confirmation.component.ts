import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountConfirmationService } from '@services/account-confirmation.service';

@Component({
  selector: 'app-account-confirmation',
  templateUrl: './account-confirmation.component.html'
})
export class AccountConfirmation implements OnInit {
  public confirmationHash: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountConfirmationService: AccountConfirmationService
  ) {}

  async ngOnInit() {
    this.confirmationHash =
      (this.route.snapshot.paramMap.get('confirmationHash') as string) || '';

    if (!this.confirmationHash) await this.router.navigate(['login']);

    this.accountConfirmationService.confirmAccount({
      confirmationHash: this.confirmationHash
    }).subscribe((response) => {
      console.log('response', response);
    });
  }
}
