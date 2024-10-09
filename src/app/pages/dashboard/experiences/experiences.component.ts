import { Component, OnInit } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.interface';
import { Router } from '@angular/router';
import { TranslationService } from '@services/translation.service';
import { RefreshTokensService } from '@services/refresh-token.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { Titles } from '@interfaces/titles.enum';
import { EnvService } from '@shared/env.service';
import { ExperienceService } from '@services/experience.service';
import { ListExperience } from '@interfaces/list-experience.interface';
import { MessagesTranslation } from '@translations/messages.enum';
import dayjs from 'dayjs';

@Component({
  selector: 'page-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.scss', '../shared/experience.styles.scss']
})
export class ExperiencesComponent implements OnInit {
  page: string = '0';
  pageSize: string = '10';
  order: string = 'created_at';
  orderBy: string = 'DESC';
  experiencesSearchQuery: string = '';
  totalItems: number;
  experiences: Array<ListExperience> = [];

  userInfo: UserInfoResponse;

  constructor(
    private readonly router: Router,
    private readonly envService: EnvService,
    private readonly experiencesService: ExperienceService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  staticStorage = `${this.envService.getStaticStorageLink}/experiences-pictures/`;

  listExperiences() {
    const listExperiencesPayload = {
      page: this.page,
      pageSize: this.pageSize,
      order: this.order,
      orderBy: this.orderBy,
      query: this.experiencesSearchQuery
    };

    this.experiencesService
      .listCertifications({ ...listExperiencesPayload })
      .subscribe({
        next: ({ rows, count }) => {
          this.totalItems = count;
          this.experiences = rows;
        }
      });
  }

  changeExperienceSelectionStatus(experienceCommonId: string) {
    this.experiencesService
      .changeExperienceSelectionStatus({ experienceCommonId })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage = await this.translationService.translateText(
            message,
            MessagesTranslation.RESPONSES
          );
          this.globalMessageService.handle({
            message: translationMessage
          });
          this.listExperiences();
        }
      });
  }

  deleteExperience(experienceCommonId: string) {
    this.experiencesService.deleteExperience({ experienceCommonId }).subscribe({
      next: async ({ message }) => {
        const translationMessage = await this.translationService.translateText(
          message,
          MessagesTranslation.RESPONSES
        );
        this.globalMessageService.handle({
          message: translationMessage
        });
        this.listExperiences();
      }
    });
  }

  setCurrentPage(currentPage: string) {
    this.page = currentPage;
    this.listExperiences();
  }

  setExperiencesPerPage(experiencesPerPage: string) {
    this.pageSize = experiencesPerPage;
    this.listExperiences();
  }

  handleExperiencesQuery(experiencesQuery: string) {
    this.experiencesSearchQuery = experiencesQuery;
    this.listExperiences();
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
    this.translationService.setPageTitle(Titles.EXPERIENCES);

    await this.fetchUserInfo();

    this.listExperiences();
  }

  protected readonly dayjs = dayjs;
}
