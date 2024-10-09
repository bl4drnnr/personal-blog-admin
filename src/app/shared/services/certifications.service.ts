import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { CertificationEndpoint } from '@interfaces/certifications.enum';
import { CreateCertificationPayload } from '@payloads/create-certification.interface';
import { Observable } from 'rxjs';
import { CertificationCreatedResponse } from '@responses/certification-created.interface';
import { CertificationFileUploadedPayload } from '@responses/certification-file-uploaded.interface';
import { DeleteCertificationPayload } from '@payloads/delete-certification.interface';
import { CertificationDeletedResponse } from '@responses/certification-deleted.interface';
import { ChangeCertificationSelectionStatusPayload } from '@payloads/change-certification-selection-status.interface';
import { CertificationSelectionStatusChangedResponse } from '@responses/certification-selection-status-changed.interface';
import { ListCertificationsPayload } from '@payloads/list-certifications.interface';
import { ListCertificationsResponse } from '@responses/list-certifications.interface';
import { GetCertificationByIdRequest } from '@payloads/get-certification-by-id.interface';
import { GetCertificationByIdResponse } from '@responses/get-certification-by-id.interface';
import { EditCertificationPayload } from '@payloads/edit-certification.interface';
import { CertificationUpdatedResponse } from '@responses/certification-updated.interface';

@Injectable({
  providedIn: 'root'
})
export class CertificationsService {
  constructor(private readonly apiService: ApiService) {}

  getCertificationById(
    params: GetCertificationByIdRequest
  ): Observable<GetCertificationByIdResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.ABOUT_BLOG,
      action: CertificationEndpoint.GET_CERTIFICATION_BY_ID,
      params
    });
  }

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

  listCertifications(
    params: ListCertificationsPayload
  ): Observable<ListCertificationsResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.ABOUT_BLOG,
      action: CertificationEndpoint.LIST_CERTIFICATIONS,
      params
    });
  }

  changeCertificationSelectionStatus(
    payload: ChangeCertificationSelectionStatusPayload
  ): Observable<CertificationSelectionStatusChangedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.ABOUT_BLOG,
      action: CertificationEndpoint.CHANGE_CERTIFICATION_SELECTION_STATUS,
      payload
    });
  }

  deleteCertification(
    params: DeleteCertificationPayload
  ): Observable<CertificationDeletedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.ABOUT_BLOG,
      action: CertificationEndpoint.DELETE_CERTIFICATION,
      params
    });
  }

  editCertification(
    payload: EditCertificationPayload
  ): Observable<CertificationUpdatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.ABOUT_BLOG,
      action: CertificationEndpoint.UPDATE_CERTIFICATION,
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
