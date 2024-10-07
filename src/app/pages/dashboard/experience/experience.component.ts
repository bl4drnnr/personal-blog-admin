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
import { ValidationService } from '@services/validation.service';
import { ExperiencePositionInterface } from '@interfaces/experience-position.interface';

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

  experiencePositions: Array<ExperiencePositionInterface> = [];
  experiencePositionTitle: string;
  experiencePositionDescription: string;
  experiencePositionStartDate: string;
  experiencePositionEndDate: string;
  addingExperiencePosition = false;

  userInfo: UserInfoResponse;
  selectedFiles?: FileList;
  experienceNewPicture: string | ArrayBuffer | null = '';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly envService: EnvService,
    private readonly authorsService: AuthorsService,
    private readonly experienceService: ExperienceService,
    protected readonly validationService: ValidationService,
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
          this.experiencePositions = experience.experiencePositions.map(
            (experiencePosition) => ({ ...experiencePosition })
          );
          this.experienceStartDate = dayjs(experience.startDate).format(
            'YYYY-MM-DD'
          );
          this.experienceEndDate = dayjs(experience.endDate).format('YYYY-MM-DD');

          this.getAuthorById();
        },
        error: async () => await this.handleRedirect('account/experiences')
      });
  }

  changeExperienceSelectionStatus(experienceCommonId: string) {
    this.experienceService
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
          this.getExperienceById();
        }
      });
  }

  deleteExperience() {
    this.experienceService
      .deleteExperience({ experienceCommonId: this.experience.experienceCommonId })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage = await this.translationService.translateText(
            message,
            MessagesTranslation.RESPONSES
          );
          this.globalMessageService.handle({
            message: translationMessage
          });
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

  async addExperiencePosition() {
    const isExperienceTitlePresent = this.experiencePositions.find(
      ({ positionTitle }) => this.experiencePositionTitle === positionTitle
    );

    if (isExperienceTitlePresent) {
      return await this.globalMessageService.handleWarning({
        message: 'is-already-on-the-list'
      });
    }

    this.experiencePositions.push({
      positionTitle: this.experiencePositionTitle,
      positionDescription: this.experiencePositionDescription,
      positionStartDate: new Date(this.experiencePositionStartDate),
      positionEndDate: new Date(this.experiencePositionEndDate)
    });

    this.experiencePositionTitle = '';
    this.experiencePositionDescription = '';
    this.experiencePositionStartDate = '';
    this.experiencePositionEndDate = '';
    this.addingExperiencePosition = false;
  }

  deleteExperiencePosition(experiencePosition: ExperiencePositionInterface) {
    if (experiencePosition.hasOwnProperty('id')) {
      this.experienceService
        .deleteExperiencePosition({
          experiencePositionId: experiencePosition.id as string
        })
        .subscribe({
          next: async ({ message }) => {
            const translationMessage = await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
            this.globalMessageService.handle({
              message: translationMessage
            });

            this.getExperienceById();
          }
        });
    } else {
      this.experiencePositions = this.validationService.deleteObjectFromArray(
        this.experiencePositions,
        'positionTitle',
        experiencePosition.positionTitle
      );
    }
  }

  changeExperiencePositionDate(
    experiencePosition: ExperiencePositionInterface,
    positionDate: 'start' | 'end',
    updatedDate: string
  ) {
    switch (positionDate) {
      case 'start':
        experiencePosition.positionStartDate = new Date(updatedDate);
        break;
      case 'end':
        experiencePosition.positionEndDate = new Date(updatedDate);
        break;
    }
  }

  addingExperiencePositionDisabled() {
    return (
      !this.experiencePositionTitle ||
      !this.experiencePositionDescription ||
      !this.experiencePositionStartDate ||
      !this.experiencePositionEndDate
    );
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

    const areExperienceSkillsEqual = this.validationService.areArraysEqual(
      this.experience.obtainedSkills,
      this.experience.obtainedSkills
    );

    if (this.experienceCompanyName !== this.experience.companyName)
      editExperiencePayload.companyName = this.experienceCompanyName;
    if (this.experienceCompanyDescription !== this.experience.companyDescription)
      editExperiencePayload.companyDescription = this.experienceCompanyDescription;
    if (this.experienceCompanyLink !== this.experience.companyLink)
      editExperiencePayload.companyLink = this.experienceCompanyLink;
    if (this.experienceCompanyLinkTitle !== this.experience.companyLinkTitle)
      editExperiencePayload.companyLinkTitle = this.experienceCompanyLinkTitle;
    if (
      dayjs(this.experienceStartDate).format('YYYY-MM-DD') !==
      dayjs(this.experience.startDate).format('YYYY-MM-DD')
    )
      editExperiencePayload.startDate = new Date(this.experienceStartDate);
    if (
      dayjs(this.experienceEndDate).format('YYYY-MM-DD') !==
      dayjs(this.experience.endDate).format('YYYY-MM-DD')
    )
      editExperiencePayload.endDate = new Date(this.experienceEndDate);
    if (!areExperienceSkillsEqual)
      editExperiencePayload.obtainedSkills = this.experienceObtainedSkills;

    return this.experienceService
      .editExperience({
        ...editExperiencePayload
      })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage = await this.translationService.translateText(
            message,
            MessagesTranslation.RESPONSES
          );
          this.globalMessageService.handle({
            message: translationMessage
          });
          this.experienceEditMode = false;

          this.handleExperiencePositionsChanges();

          this.getExperienceById();
        }
      });
  }

  handleExperiencePositionsChanges() {
    const areExperiencePositionsEqual = this.validationService.areArraysObjectEqual(
      this.experiencePositions,
      this.experience.experiencePositions
    );

    if (areExperiencePositionsEqual) return;

    for (const experiencePosition of this.experiencePositions) {
      if (experiencePosition.hasOwnProperty('id')) {
        this.experienceService
          .updateExperiencePosition({
            experiencePositionId: experiencePosition.id as string,
            positionTitle: experiencePosition.positionTitle,
            positionDescription: experiencePosition.positionDescription,
            positionStartDate: experiencePosition.positionStartDate,
            positionEndDate: experiencePosition.positionEndDate
          })
          .subscribe();
      } else {
        this.experienceService
          .createExperiencePosition({
            experienceId: this.experienceId,
            positionTitle: experiencePosition.positionTitle,
            positionDescription: experiencePosition.positionDescription,
            positionStartDate: experiencePosition.positionStartDate,
            positionEndDate: experiencePosition.positionEndDate,
            positionLanguage: this.experience.experienceLanguage
          })
          .subscribe();
      }
    }
  }

  experienceEdited() {
    const areExperienceSkillsEqual = this.validationService.areArraysEqual(
      this.experience.obtainedSkills,
      this.experienceObtainedSkills
    );

    const areExperiencePositionsEqual = this.validationService.areArraysObjectEqual(
      this.experience.experiencePositions,
      this.experiencePositions
    );

    return (
      this.experienceCompanyName !== this.experience.companyName ||
      this.experienceCompanyDescription !== this.experience.companyDescription ||
      this.experienceCompanyLink !== this.experience.companyLink ||
      this.experienceCompanyLinkTitle !== this.experience.companyLinkTitle ||
      dayjs(this.experienceStartDate).format('YYYY-MM-DD') !==
        dayjs(this.experience.startDate).format('YYYY-MM-DD') ||
      dayjs(this.experienceEndDate).format('YYYY-MM-DD') !==
        dayjs(this.experience.endDate).format('YYYY-MM-DD') ||
      this.experienceNewPicture ||
      !areExperienceSkillsEqual ||
      !areExperiencePositionsEqual
    );
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

  selectExperienceNewPicture(event: any) {
    this.selectedFiles = event.target.files;

    if (!this.selectedFiles) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      this.experienceNewPicture = reader.result as string;
    };
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const experienceId = params.get('experienceId');

      if (!experienceId) return await this.handleRedirect('account/experiences');

      this.experienceId = experienceId;

      await this.fetchUserInfo();

      this.getExperienceById();
    });
  }

  protected readonly dayjs = dayjs;
}
