import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountConfirmationService {
  constructor(private apiService: ApiService) {}

  confirmAccount({
    confirmationHash,
    password
  }: {
    confirmationHash: string;
    password: string;
  }) {
    return this.apiService.confirmAccount({
      confirmationHash,
      password
    });
  }
}
