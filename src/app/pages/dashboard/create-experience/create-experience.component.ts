import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '@services/translation.service';
import { RefreshTokensService } from '@services/refresh-token.service';
import { Titles } from '@interfaces/titles.enum';
import { UserInfoResponse } from '@responses/user-info.interface';
import { ExperienceService } from '@services/experience.service';
import { CreateExperiencePayload } from '@payloads/create-experience.interface';
import { AuthorsService } from '@services/authors.service';
import { ListAuthor } from '@interfaces/list-author.interface';
import { GlobalMessageService } from '@shared/global-message.service';
import { ExperiencePositionInterface } from '@interfaces/experience-position.interface';
import { ValidationService } from '@services/validation.service';
import { CreateExperiencePositionPayload } from '@payloads/create-experience-position.interface';
import dayjs from 'dayjs';

@Component({
  selector: 'page-create-experience',
  templateUrl: './create-experience.component.html',
  styleUrls: [
    './create-experience.component.scss',
    '../shared/experience.styles.scss'
  ]
})
export class CreateExperienceComponent implements OnInit {
  companyName: string;
  companyDescription: string;
  companyLink: string;
  companyLinkTitle: string;
  selectedFiles?: FileList;
  companyPicture: string;
  startDate: string;
  endDate: string;
  experienceObtainedSkill: string;
  experienceObtainedSkills: Array<string> = [];
  authorId: string;
  authorSearchQuery: string;

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
    const startDate = new Date(this.startDate);

    const payload: CreateExperiencePayload = {
      companyName: this.companyName,
      companyDescription: this.companyDescription,
      companyLink: this.companyLink,
      companyLinkTitle: this.companyLinkTitle,
      companyPicture: this.companyPicture,
      authorId: this.authorId,
      obtainedSkills: this.experienceObtainedSkills,
      startDate
    };

    if (this.endDate) payload.endDate = new Date(this.endDate);

    return this.experienceService.createExperience({ ...payload }).subscribe({
      next: async ({ experienceId }) => {
        this.handleExperiencePositionsCreation(experienceId);
        await this.handleRedirect(`account/experience/${experienceId}`);
      }
    });
  }

  handleExperiencePositionsCreation(experienceId: string) {
    if (this.experiencePositions.length === 0) return;

    for (const experiencePosition of this.experiencePositions) {
      const experiencePositionPayload: CreateExperiencePositionPayload = {
        experienceId,
        positionTitle: experiencePosition.positionTitle,
        positionDescription: experiencePosition.positionDescription,
        positionStartDate: new Date(experiencePosition.positionStartDate),
        positionEndDate: new Date(experiencePosition.positionEndDate)
      };

      this.experienceService
        .createExperiencePosition({ ...experiencePositionPayload })
        .subscribe();
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
    this.authorSearchQuery = `${author.firstName} ${author.lastName}`;
    this.authors = [];
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
      positionStartDate: this.experiencePositionStartDate as Date,
      positionEndDate: this.experiencePositionEndDate as Date
    });

    this.experiencePositionTitle = '';
    this.experiencePositionDescription = '';
    this.experiencePositionStartDate = null;
    this.experiencePositionEndDate = null;
    this.addingExperiencePosition = false;
  }

  deleteExperiencePosition(experiencePosition: ExperiencePositionInterface) {
    this.experiencePositions = this.validationService.deleteObjectFromArray(
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

  disableCreateExpButton() {
    return (
      !this.companyName ||
      !this.companyDescription ||
      !this.companyLink ||
      !this.companyLinkTitle ||
      !this.companyPicture ||
      !this.startDate ||
      this.experienceObtainedSkills.length === 0 ||
      !this.authorId
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

  deleteObtainedSkill(obtainedSkill: string) {
    this.experienceObtainedSkills.splice(
      this.experienceObtainedSkills.indexOf(obtainedSkill),
      1
    );
  }

  clearProfilePicture() {
    this.companyPicture = '';
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;

    if (!this.selectedFiles) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      this.companyPicture = reader.result as string;
    };
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
