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
  authorId: string;
  authorSearchQuery: string;

  userInfo: UserInfoResponse;
  authors: Array<ListAuthor> = [];

  constructor(
    private readonly router: Router,
    private readonly authorsService: AuthorsService,
    private readonly experienceService: ExperienceService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService
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
      startDate
    };

    if (this.endDate) payload.endDate = new Date(this.endDate);

    return this.experienceService.createExperience({ ...payload }).subscribe({
      next: async ({ experienceId }) =>
        await this.handleRedirect(`account/experience/${experienceId}`)
    });
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
      !this.authorId
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
}
