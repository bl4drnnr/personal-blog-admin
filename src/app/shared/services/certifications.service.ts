import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { CertificationEndpoint } from '@interfaces/certifications.enum';
import { CreateCertificationPayload } from '@payloads/create-certification.interface';
import { Observable } from 'rxjs';
import { CertificationCreatedResponse } from '@responses/certification-created.interface';
import { CertificationFileUploadedPayload } from '@responses/certification-file-uploaded.interface';

@Injectable({
  providedIn: 'root'
})
export class CertificationsService {
  constructor(private readonly apiService: ApiService) {}

  createCertification(
    payload: CreateCertificationPayload
  ): Observable<CertificationCreatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.ABOUT_BLOG,
      action: CertificationEndpoint.CREATE_CERTIFICATION,
      payload
    });
  }

  certificationFileUpload(
    payload: FormData
  ): Observable<CertificationFileUploadedPayload> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.ABOUT_BLOG,
      action: CertificationEndpoint.CERTIFICATION_FILE_UPLOAD,
      payload
    });
  }
}
