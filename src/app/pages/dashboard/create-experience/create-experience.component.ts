import dayjs from 'dayjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '@services/translation.service';
import { RefreshTokensService } from '@services/refresh-token.service';
import { Titles } from '@interfaces/titles.enum';
import { UserInfoResponse } from '@responses/user-info.interface';
import { ExperienceService } from '@services/experience.service';
import { AuthorsService } from '@services/authors.service';
import { ListAuthor } from '@interfaces/list-author.interface';
import { GlobalMessageService } from '@shared/global-message.service';
import { ExperiencePositionInterface } from '@interfaces/experience-position.interface';
import { ValidationService } from '@services/validation.service';
import { CreateExperienceInterface } from '@interfaces/create-experience.interface';
import { MessagesTranslation } from '@translations/messages.enum';
import { CreatedExperiencesInterface } from '@interfaces/created-experiences.interface';
import { CreateExperiencePositionPayload } from '@payloads/create-experience-position.interface';

@Component({
  selector: 'page-create-experience',
  templateUrl: './create-experience.component.html',
  styleUrls: [
    './create-experience.component.scss',
    '../shared/experience.styles.scss'
  ]
})
export class CreateExperienceComponent implements OnInit {
  experiences: Array<CreateExperienceInterface> = [
    {
      companyName: '',
      companyDescription: '',
      companyLink: '',
      companyLinkTitle: '',
      companyPicture: '',
      authorId: '',
      obtainedSkills: [],
      experienceLanguage: 'EN',
      startDate: new Date(),
      endDate: new Date(),
      authorName: '',
      experiencePositions: []
    },
    {
      companyName: '',
      companyDescription: '',
      companyLink: '',
      companyLinkTitle: '',
      companyPicture: '',
      authorId: '',
      obtainedSkills: [],
      experienceLanguage: 'RU',
      startDate: new Date(),
      endDate: new Date(),
      authorName: '',
      experiencePositions: []
    },
    {
      companyName: '',
      companyDescription: '',
      companyLink: '',
      companyLinkTitle: '',
      companyPicture: '',
      authorId: '',
      obtainedSkills: [],
      experienceLanguage: 'PL',
      startDate: new Date(),
      endDate: new Date(),
      authorName: '',
      experiencePositions: []
    }
  ];

  companyName: string;
  companyDescription: string;
  companyLink: string;
  companyLinkTitle: string;
  selectedFiles?: FileList;
  companyPicture: string;
  startDate: string;
  endDate: string;
  experienceObtainedSkill: string;
  authorId: string;
  authorSearchQuery: string;
  experienceLanguage: string = 'EN';

  experiencePositions: Array<ExperiencePositionInterface> = [];
  experiencePositionTitle: string;
  experiencePositionDescription: string;
  experiencePositionStartDate: Date | null;
  experiencePositionEndDate: Date | null;
  addingExperiencePosition = false;

  userInfo: UserInfoResponse;
  authors: Array<ListAuthor> = [];

  constructor(
    private readonly router: Router,
    private readonly authorsService: AuthorsService,
    private readonly experienceService: ExperienceService,
    protected readonly validationService: ValidationService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  createExperience() {
    const experiences = this.experiences.map((experience) => {
      const payload: CreateExperienceInterface = {
        companyName: experience.companyName,
        companyDescription: experience.companyDescription,
        companyLink: experience.companyLink,
        companyLinkTitle: experience.companyLinkTitle,
        companyPicture: experience.companyPicture,
        authorId: experience.authorId,
        obtainedSkills: experience.obtainedSkills,
        experienceLanguage: experience.experienceLanguage.toLowerCase(),
        startDate: new Date(this.startDate),
        experiencePositions: experience.experiencePositions
      };

      if (this.endDate) payload.endDate = new Date(this.endDate);

      return payload;
    });

    this.experienceService.createExperience({ experiences }).subscribe({
      next: async ({ message, createdExperiences }) => {
        const translationMessage = await this.translationService.translateText(
          message,
          MessagesTranslation.RESPONSES
        );
        this.globalMessageService.handle({
          message: translationMessage
        });

        this.handleExperiencePositionsCreation(experiences, createdExperiences);
        await this.handleRedirect('account/experiences');
      }
    });
  }

  handleExperiencePositionsCreation(
    experiences: Array<CreateExperienceInterface>,
    createdExperiences: Array<CreatedExperiencesInterface>
  ) {
    for (const createdExperience of createdExperiences) {
      for (const experience of experiences) {
        const createdExperienceLanguage = createdExperience.language;
        const experienceLanguage = experience.experienceLanguage.toLowerCase();

        if (createdExperienceLanguage === experienceLanguage) {
          const experiencePositions = experience.experiencePositions!;

          if (experiencePositions.length !== 0) {
            for (const experiencePosition of experiencePositions) {
              const experiencePositionPayload: CreateExperiencePositionPayload = {
                experienceId: createdExperience.id,
                positionTitle: experiencePosition.positionTitle,
                positionDescription: experiencePosition.positionDescription,
                positionStartDate: new Date(experiencePosition.positionStartDate),
                positionEndDate: new Date(experiencePosition.positionEndDate),
                positionLanguage: experiencePosition.positionLanguage
              };

              this.experienceService
                .createExperiencePosition({ ...experiencePositionPayload })
                .subscribe();
            }
          }
        }
      }
    }
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

  handleAuthorQuery(authorQuery: string) {
    this.authorSearchQuery = authorQuery;
    if (this.authorSearchQuery) this.listAuthors();
    else this.authors = [];
  }

  selectAuthor(author: ListAuthor) {
    this.authorId = author.id;
    const experience = this.getExperienceByLanguage();

    experience.authorId = author.id;
    experience.authorName = `${author.firstName} ${author.lastName}`;

    this.authors = [];
  }

  async addExperiencePosition() {
    const experience = this.getExperienceByLanguage();

    const isExperienceTitlePresent = experience.experiencePositions!.find(
      ({ positionTitle }) => this.experiencePositionTitle === positionTitle
    );

    if (isExperienceTitlePresent) {
      return await this.globalMessageService.handleWarning({
        message: 'is-already-on-the-list'
      });
    }

    experience.experiencePositions!.push({
      experienceId: '',
      positionTitle: this.experiencePositionTitle,
      positionDescription: this.experiencePositionDescription,
      positionStartDate: this.experiencePositionStartDate as Date,
      positionEndDate: this.experiencePositionEndDate as Date,
      positionLanguage: experience.experienceLanguage.toLowerCase()
    });

    this.experiencePositionTitle = '';
    this.experiencePositionDescription = '';
    this.experiencePositionStartDate = null;
    this.experiencePositionEndDate = null;
    this.addingExperiencePosition = false;
  }

  deleteExperiencePosition(experiencePosition: ExperiencePositionInterface) {
    const experience = this.getExperienceByLanguage();

    experience.experiencePositions = this.validationService.deleteObjectFromArray(
      this.experiencePositions,
      'positionTitle',
      experiencePosition.positionTitle
    );
  }

  addingExperiencePositionDisabled() {
    return (
      !this.experiencePositionTitle ||
      !this.experiencePositionDescription ||
      !this.experiencePositionStartDate ||
      !this.experiencePositionEndDate
    );
  }

  changeExperiencePositionStartDate(startDate: string) {
    this.experiencePositionStartDate = new Date(startDate);
  }

  changeExperiencePositionEndDate(endDate: string) {
    this.experiencePositionEndDate = new Date(endDate);
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

  modifyCompanyName(companyName: string) {
    this.companyName = companyName;
    const experience = this.getExperienceByLanguage();
    experience.companyName = companyName;
  }

  modifyCompanyDescription(companyDescription: string) {
    this.companyDescription = companyDescription;
    const experience = this.getExperienceByLanguage();
    experience.companyDescription = companyDescription;
  }

  modifyCompanyLink(companyLink: string) {
    this.companyLink = companyLink;
    const experience = this.getExperienceByLanguage();
    experience.companyLink = companyLink;
  }

  modifyCompanyLinkTitle(companyLinkTitle: string) {
    this.companyLinkTitle = companyLinkTitle;
    const experience = this.getExperienceByLanguage();
    experience.companyLinkTitle = companyLinkTitle;
  }

  changeExperienceLanguage(experienceLanguage: string) {
    this.experienceLanguage = experienceLanguage;

    const experience = this.getExperienceByLanguage();

    this.companyName = experience.companyName;
    this.companyDescription = experience.companyDescription;
    this.companyLink = experience.companyLink;
    this.companyLinkTitle = experience.companyLinkTitle;
  }

  disableCreateExpButton() {
    return this.experiences.some(
      (experience) =>
        !experience.companyName ||
        !experience.companyDescription ||
        !experience.companyLink ||
        !experience.companyLinkTitle ||
        !experience.companyPicture ||
        !this.startDate ||
        experience.obtainedSkills.length === 0 ||
        !experience.authorId
    );
  }

  getExperienceObtainedSkills() {
    const experience = this.getExperienceByLanguage();
    return experience.obtainedSkills;
  }

  getAuthorName() {
    const experience = this.getExperienceByLanguage();
    return experience.authorName!;
  }

  async addObtainedSkills() {
    if (this.experienceObtainedSkill === ' ') return;

    const experience = this.getExperienceByLanguage();

    const isSkillPresent = experience.obtainedSkills.includes(
      this.experienceObtainedSkill.trim()
    );

    if (isSkillPresent) {
      await this.globalMessageService.handleWarning({
        message: 'tag-is-already-on-the-list'
      });
    } else {
      experience.obtainedSkills.push(this.experienceObtainedSkill.trim());
    }

    this.experienceObtainedSkill = '';
  }

  deleteObtainedSkill(obtainedSkill: string) {
    const experience = this.getExperienceByLanguage();

    experience.obtainedSkills.splice(
      experience.obtainedSkills.indexOf(obtainedSkill),
      1
    );
  }

  clearProfilePicture() {
    this.companyPicture = '';
  }

  selectCompanyPicture(event: any) {
    this.selectedFiles = event.target.files;

    if (!this.selectedFiles) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      this.experiences.map(
        (experience) => (experience.companyPicture = reader.result as string)
      );
      this.companyPicture = reader.result as string;
    };
  }

  getExperienceByLanguage() {
    return this.experiences.find(
      (experience) => experience.experienceLanguage === this.experienceLanguage
    )!;
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.CREATE_EXPERIENCE);

    await this.fetchUserInfo();
  }

  protected readonly dayjs = dayjs;
}
