import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { AboutEndpoint } from '@interfaces/about.enum';
import { AboutPageCreatedResponse } from '@responses/about-page-created.interface';
import { AboutPageUpdatedResponse } from '@responses/about-page-updated.interface';
import { ExperienceResponse } from '@responses/experience.interface';
import { ExperienceCreatedResponse } from '@responses/experience-created.interface';
import { ExperienceUpdatedResponse } from '@responses/experience-updated.interface';
import { ExperienceDeletedResponse } from '@responses/experience-deleted.interface';
import { CertificateResponse } from '@responses/certificate.interface';
import { CertificateCreatedResponse } from '@responses/certificate-created.interface';
import { CertificateUpdatedResponse } from '@responses/certificate-updated.interface';
import { CertificateDeletedResponse } from '@responses/certificate-deleted.interface';
import { AboutPageData } from '@interfaces/about/about-page-data.interface';
import { ExperienceData } from '@interfaces/about/experience-data.interface';
import { CertificateData } from '@interfaces/about/certificate-data.interface';
import { PositionData } from '@interfaces/about/position-data.interface';

@Injectable({
  providedIn: 'root'
})
export class AboutService {
  constructor(private readonly apiService: ApiService) {}

  // About Page Methods
  getAboutPageSettings(): Observable<AboutPageData> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.ABOUT,
      action: AboutEndpoint.GET_ABOUT_PAGE
    });
  }

  createAboutPage(payload: AboutPageData): Observable<AboutPageCreatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.ABOUT,
      action: AboutEndpoint.CREATE_ABOUT_PAGE,
      payload
    });
  }

  updateAboutPage(
    id: string,
    payload: AboutPageData
  ): Observable<AboutPageUpdatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.ABOUT,
      action: AboutEndpoint.UPDATE_ABOUT_PAGE,
      params: { id },
      payload
    });
  }

  // Experience Methods
  getExperiences(): Observable<ExperienceResponse[]> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.ABOUT,
      action: AboutEndpoint.GET_EXPERIENCES
    });
  }

  createExperience(payload: ExperienceData): Observable<ExperienceCreatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.ABOUT,
      action: AboutEndpoint.CREATE_EXPERIENCE,
      payload
    });
  }

  updateExperience(
    id: string,
    payload: ExperienceData
  ): Observable<ExperienceUpdatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.ABOUT,
      action: AboutEndpoint.UPDATE_EXPERIENCE,
      params: { id },
      payload
    });
  }

  deleteExperience(id: string): Observable<ExperienceDeletedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.ABOUT,
      action: AboutEndpoint.DELETE_EXPERIENCE,
      params: { id }
    });
  }

  // Certificate Methods
  getCertificates(): Observable<CertificateResponse[]> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.ABOUT,
      action: AboutEndpoint.GET_CERTIFICATES
    });
  }

  createCertificate(
    payload: CertificateData
  ): Observable<CertificateCreatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.ABOUT,
      action: AboutEndpoint.CREATE_CERTIFICATE,
      payload
    });
  }

  updateCertificate(
    id: string,
    payload: CertificateData
  ): Observable<CertificateUpdatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.ABOUT,
      action: AboutEndpoint.UPDATE_CERTIFICATE,
      params: { id },
      payload
    });
  }

  deleteCertificate(id: string): Observable<CertificateDeletedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.ABOUT,
      action: AboutEndpoint.DELETE_CERTIFICATE,
      params: { id }
    });
  }

  // Position Methods
  createPosition(experienceId: string, payload: PositionData): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.ABOUT,
      action: AboutEndpoint.CREATE_POSITION,
      params: { experienceId },
      payload
    });
  }

  updatePosition(id: string, payload: PositionData): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.ABOUT,
      action: AboutEndpoint.UPDATE_POSITION,
      params: { id },
      payload
    });
  }

  deletePosition(id: string): Observable<any> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.ABOUT,
      action: AboutEndpoint.DELETE_POSITION,
      params: { id }
    });
  }
}
