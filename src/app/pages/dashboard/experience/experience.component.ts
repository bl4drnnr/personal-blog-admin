import dayjs from 'dayjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EnvService } from '@shared/env.service';
import { TranslationService } from '@services/translation.service';
import { RefreshTokensService } from '@services/refresh-token.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { UserInfoResponse } from '@responses/user-info.interface';
import { ExperienceService } from '@services/experience.service';
import { Titles } from '@interfaces/titles.enum';
import { GetExperienceByIdResponse } from '@responses/get-experience-by-id.interface';
import { ListAuthor } from '@interfaces/list-author.interface';
import { AuthorsService } from '@services/authors.service';
import { GetAuthorByIdResponse } from '@responses/get-author-by-id.interface';
import { EditExperiencePayload } from '@payloads/edit-experience.interface';
import { MessagesTranslation } from '@translations/messages.enum';

@Component({
  selector: 'page-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss', '../shared/experience.styles.scss']
})
export class ExperienceComponent implements OnInit {
  experience: GetExperienceByIdResponse;

  experienceId: string;
  authorId: string;
  authorSearchQuery: string;
  authors: Array<ListAuthor> = [];
  author: GetAuthorByIdResponse;

  experienceCompanyName: string;
  experienceCompanyDescription: string;
  experienceCompanyLink: string;
  experienceCompanyLinkTitle: string;
  experienceCompanyPicture: string;
  experienceObtainedSkill: string;
  experienceObtainedSkills: Array<string>;
  experienceStartDate: string;
  experienceEndDate: string;
  experienceEditMode = false;

  userInfo: UserInfoResponse;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly envService: EnvService,
    private readonly authorsService: AuthorsService,
    private readonly experienceService: ExperienceService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  staticStorage = `${this.envService.getStaticStorageLink}/experiences-pictures/`;

  getExperienceById() {
    this.experienceService
      .getExperienceById({ experienceId: this.experienceId })
      .subscribe({
        next: (experience) => {
          this.translationService.setPageTitle(Titles.EXPERIENCE, {
            experienceName: experience.companyName
          });
          this.experience = experience;
          this.authorId = experience.authorId;
          this.experienceCompanyName = experience.companyName;
          this.experienceCompanyDescription = experience.companyDescription;
          this.experienceCompanyLink = experience.companyLink;
          this.experienceCompanyLinkTitle = experience.companyLinkTitle;
          this.experienceCompanyPicture = experience.companyPicture;
          this.experienceObtainedSkills = [...experience.obtainedSkills];
          this.experienceStartDate = dayjs(experience.startDate).format(
            'YYYY-MM-DD'
          );
          this.experienceEndDate = dayjs(experience.endDate).format(
            'YYYY-MM-DD'
          );

          this.getAuthorById();
        },
        error: async () => await this.handleRedirect('account/experiences')
      });
  }

  changeExperienceSelectionStatus(experienceId: string) {
    this.experienceService
      .changeExperienceSelectionStatus({ experienceId })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage =
            await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
          this.globalMessageService.handle({ message: translationMessage });
          this.getExperienceById();
        }
      });
  }

  deleteExperience() {
    this.experienceService
      .deleteExperience({ experienceId: this.experienceId })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage =
            await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
          this.globalMessageService.handle({ message: translationMessage });
          await this.handleRedirect('account/experiences');
        }
      });
  }

  handleAuthorQuery(authorQuery: string) {
    this.authorSearchQuery = authorQuery;
    if (this.authorSearchQuery) this.listAuthors();
    else this.authors = [];
  }

  selectAuthor(author: ListAuthor) {
    this.authorId = author.id;
    this.authorSearchQuery = `${author.firstName} ${author.lastName}`;
    this.authors = [];
  }

  listAuthors() {
    const listAuthorsPayload = {
      page: '0',
      pageSize: '5',
      order: 'created_at',
      orderBy: 'DESC',
      query: this.authorSearchQuery
    };

    this.authorsService.listAuthors({ ...listAuthorsPayload }).subscribe({
      next: ({ rows }) => (this.authors = rows)
    });
  }

  getAuthorById() {
    this.authorsService.getAuthorById({ authorId: this.authorId }).subscribe({
      next: (author) => {
        this.author = author;
        this.selectAuthor(author);
      }
    });
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

  editExperience() {
    const editExperiencePayload: EditExperiencePayload = {
      experienceId: this.experienceId
    };

    return this.experienceService
      .editExperience({
        ...editExperiencePayload
      })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage =
            await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );

          this.globalMessageService.handle({ message: translationMessage });
          this.getExperienceById();
        }
      });
  }

  experienceEdited() {
    return true;
  }

  async addObtainedSkills() {
    if (this.experienceObtainedSkill === ' ') return;

    const isSkillPresent = this.experienceObtainedSkills.includes(
      this.experienceObtainedSkill.trim()
    );

    if (isSkillPresent) {
      await this.globalMessageService.handleWarning({
        message: 'tag-is-already-on-the-list'
      });
    } else {
      this.experienceObtainedSkills.push(this.experienceObtainedSkill.trim());
    }

    this.experienceObtainedSkill = '';
  }

  deleteObtainedSkill(experienceSkill: string) {
    this.experienceObtainedSkills.splice(
      this.experienceObtainedSkills.indexOf(experienceSkill),
      1
    );
  }

  // @TODO
  createExperiencePosition() {
    return this.experienceService.createExperiencePosition({
      experienceId: '',
      positionTitle: '',
      positionDescription: '',
      positionStartDate: new Date(),
      positionEndDate: new Date()
    });
  }

  updateExperiencePosition() {
    return this.experienceService.updateExperiencePosition({
      experiencePositionId: '',
      positionTitle: '',
      positionDescription: '',
      positionStartDate: new Date(),
      positionEndDate: new Date()
    });
  }

  deleteExperiencePosition() {
    return this.experienceService.deleteExperiencePosition({
      experiencePositionId: ''
    });
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const experienceId = params.get('experienceId');

      if (!experienceId)
        return await this.handleRedirect('account/experiences');

      this.experienceId = experienceId;

      await this.fetchUserInfo();

      this.getExperienceById();
    });
  }

  protected readonly dayjs = dayjs;
}
