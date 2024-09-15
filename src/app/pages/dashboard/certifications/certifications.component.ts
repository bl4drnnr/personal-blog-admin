import { Component, OnInit } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.interface';
import { RefreshTokensService } from '@services/refresh-token.service';
import { Router } from '@angular/router';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { CertificationsService } from '@services/certifications.service';
import { MessagesTranslation } from '@translations/messages.enum';
import { GlobalMessageService } from '@shared/global-message.service';
import { ListCertification } from '@interfaces/list-certification.interface';
import dayjs from 'dayjs';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'page-certifications',
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss'
})
export class CertificationsComponent implements OnInit {
  page: string = '0';
  pageSize: string = '10';
  order: string = 'created_at';
  orderBy: string = 'DESC';
  certificationSearchQuery: string = '';
  totalItems: number;
  certifications: Array<ListCertification> = [];

  userInfo: UserInfoResponse;

  constructor(
    private readonly router: Router,
    private readonly envService: EnvService,
    private readonly certificationsService: CertificationsService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  staticStorage = `${this.envService.getStaticStorageLink}/certs-pictures/`;

  listCertifications() {
    const listCertificationsPayload = {
      page: this.page,
      pageSize: this.pageSize,
      order: this.order,
      orderBy: this.orderBy,
      query: this.certificationSearchQuery
    };

    this.certificationsService
      .listCertifications({ ...listCertificationsPayload })
      .subscribe({
        next: ({ rows, count }) => {
          this.certifications = rows;
          this.totalItems = count;
        }
      });
  }

  changeCertificationSelectionStatus(certificationId: string) {
    this.certificationsService
      .changeCertificationSelectionStatus({ certificationId })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage =
            await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
          this.globalMessageService.handle({ message: translationMessage });
          this.listCertifications();
        }
      });
  }

  deleteCertification(certificationId: string) {
    this.certificationsService
      .deleteCertification({ certificationId })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage =
            await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
          this.globalMessageService.handle({ message: translationMessage });
          this.listCertifications();
        }
      });
  }

  setCurrentPage(currentPage: string) {
    this.page = currentPage;
    this.listCertifications();
  }

  setArticlesPerPage(articlesPerPage: string) {
    this.pageSize = articlesPerPage;
    this.listCertifications();
  }

  handeCertificationsQuery(certificationQuery: string) {
    this.certificationSearchQuery = certificationQuery;
    this.listCertifications();
  }

  async fetchUserInfo() {
    const userInfoRequest = await this.refreshTokensService.refreshTokens();
    if (userInfoRequest) {
      userInfoRequest.subscribe({
        next: (userInfo) => (this.userInfo = userInfo),
        error: async () => {
          localStorage.removeItem('_at');
          await this.handleRedirect('login');
        }
      });
    }
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.CERTIFICATIONS);

    await this.fetchUserInfo();

    this.listCertifications();
  }

  protected readonly dayjs = dayjs;
}
