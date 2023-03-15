import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountConfirmationService {
  constructor(private apiService: ApiService) {}

  confirmAccount({ confirmationHash }: { confirmationHash: string }) {
    return this.apiService.confirmAccount({ confirmationHash });
  }
}
