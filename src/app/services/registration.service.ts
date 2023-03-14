import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  constructor(private apiService: ApiService) {}

  registration({
    authUsername,
    authPassword,
    email
  }: {
    authUsername: string;
    authPassword: string;
    email: string;
  }) {
    return this.apiService.registration({
      authUsername,
      authPassword,
      email
    });
  }
}
