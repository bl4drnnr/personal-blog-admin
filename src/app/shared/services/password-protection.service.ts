import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { PasswordProtectionEndpoint } from '@interfaces/password-protection.enum';
import { PasswordProtectionResponse } from '@responses/password-protection.interface';
import { UpdatePasswordProtectionPayload } from '@payloads/update-password-protection.interface';
import { PasswordProtectionUpdatedResponse } from '@responses/password-protection-updated.interface';

@Injectable({
  providedIn: 'root'
})
export class PasswordProtectionService {
  constructor(private readonly apiService: ApiService) {}

  getPasswordProtectionModeAdmin(): Observable<PasswordProtectionResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.PASSWORD_PROTECTION,
      action: PasswordProtectionEndpoint.ADMIN_PASSWORD_PROTECTION
    });
  }

  updatePasswordProtectionMode(
    payload: UpdatePasswordProtectionPayload
  ): Observable<PasswordProtectionUpdatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.PASSWORD_PROTECTION,
      action: PasswordProtectionEndpoint.ADMIN_PASSWORD_PROTECTION,
      payload
    });
  }

  getPasswordProtectionStatus(): Observable<PasswordProtectionResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.PASSWORD_PROTECTION,
      action: PasswordProtectionEndpoint.PASSWORD_PROTECTION_STATUS
    });
  }
}
