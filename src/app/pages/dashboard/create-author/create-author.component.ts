import { Component, OnInit } from '@angular/core';
import { Titles } from '@interfaces/titles.enum';
import { Router } from '@angular/router';
import { TranslationService } from '@services/translation.service';
import { RefreshTokensService } from '@services/refresh-token.service';
import { UserInfoResponse } from '@responses/user-info.interface';
import { AuthorsService } from '@services/authors.service';
import { SocialInterface } from '@interfaces/social.interface';
import { SocialsService } from '@services/socials.service';
import { CreateSocialPayload } from '@payloads/create-social.interface';
import { ValidationService } from '@services/validation.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { CreateAuthorInterface } from '@interfaces/create-author.interface';
import { MessagesTranslation } from '@translations/messages.enum';

@Component({
  selector: 'page-create-author',
  templateUrl: './create-author.component.html',
  styleUrls: ['./create-author.component.scss', '../shared/author.styles.scss']
})
export class CreateAuthorComponent implements OnInit {
  authors: Array<CreateAuthorInterface> = [
    {
      firstName: '',
      lastName: '',
      title: '',
      description: '',
      profilePicture: '',
      authorLanguage: 'PL'
    },
    {
      firstName: '',
      lastName: '',
      title: '',
      description: '',
      profilePicture: '',
      authorLanguage: 'EN'
    },
    {
      firstName: '',
      lastName: '',
      title: '',
      description: '',
      profilePicture: '',
      authorLanguage: 'RU'
    }
  ];

  firstName: string;
  lastName: string;
  title: string;
  description: string;
  authorLanguage: string = 'EN';
  selectedFiles?: FileList;
  profilePicture: string;
  socials: Array<SocialInterface> = [];
  socialTitle: string;
  socialLink: string;
  addingSocial: boolean = false;

  userInfo: UserInfoResponse;

  constructor(
    private readonly router: Router,
    private readonly socialsService: SocialsService,
    private readonly authorsService: AuthorsService,
    protected readonly validationService: ValidationService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  createAuthor() {
    const authors = this.authors.map((author) => ({
      firstName: author.firstName,
      lastName: author.lastName,
      title: author.title,
      description: author.description,
      profilePicture: author.profilePicture,
      authorLanguage: author.authorLanguage.toLowerCase()
    }));

    this.authorsService.createAuthor({ authors }).subscribe({
      next: async ({ message, authorsIds }) => {
        const translationMessage = await this.translationService.translateText(
          message,
          MessagesTranslation.RESPONSES
        );
        this.globalMessageService.handle({
          message: translationMessage
        });

        this.handleSocialsCreation(authorsIds);
        await this.handleRedirect(`account/authors`);
      }
    });
  }

  handleSocialsCreation(authorsIds: Array<string>) {
    if (this.socials.length === 0) return;

    for (const authorId of authorsIds) {
      for (const social of this.socials) {
        const socialPayload: CreateSocialPayload = {
          authorId,
          ...social
        };

        this.socialsService.createSocial({ ...socialPayload }).subscribe();
      }
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

  async addSocial() {
    const isSocialLinkPresent = this.socials.find(
      ({ link }) => this.socialLink === link
    );
    const isSocialTitlePresent = this.socials.find(
      ({ title }) => this.socialTitle === title
    );

    if (isSocialLinkPresent || isSocialTitlePresent) {
      return await this.globalMessageService.handleWarning({
        message: 'is-already-on-the-list'
      });
    }

    this.socials.push({
      link: this.socialLink,
      title: this.socialTitle
    });

    this.socialLink = '';
    this.socialTitle = '';
    this.addingSocial = false;
  }

  deleteSocial(social: SocialInterface) {
    this.socials = this.validationService.deleteObjectFromArray(
      this.socials,
      'title',
      social.title
    );
  }

  addingSocialDisabled() {
    return !this.socialLink || !this.socialTitle;
  }

  clearProfilePicture() {
    const author = this.getAuthorByLanguage();
    this.profilePicture = '';
    author.profilePicture = '';
  }

  selectAuthorProfilePicture(event: any) {
    this.selectedFiles = event.target.files;

    if (!this.selectedFiles) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      this.authors.map(
        (author) => (author.profilePicture = reader.result as string)
      );
      this.profilePicture = reader.result as string;
    };
  }

  modifyAuthorFirstName(authorFirstName: string) {
    this.firstName = authorFirstName;
    const author = this.getAuthorByLanguage();
    author.firstName = authorFirstName;
  }

  modifyAuthorLastName(authorLastName: string) {
    this.lastName = authorLastName;
    const author = this.getAuthorByLanguage();
    author.lastName = authorLastName;
  }

  modifyAuthorTitle(authorTitle: string) {
    this.title = authorTitle;
    const author = this.getAuthorByLanguage();
    author.title = authorTitle;
  }

  modifyAuthorDesc(authorDesc: string) {
    this.description = authorDesc;
    const author = this.getAuthorByLanguage();
    author.description = authorDesc;
  }

  changeAuthorLanguage(authorLanguage: string) {
    this.authorLanguage = authorLanguage;

    const author = this.getAuthorByLanguage();

    this.firstName = author.firstName;
    this.lastName = author.lastName;
    this.title = author.title;
    this.description = author.description;
  }

  disableCreateAuthorButton() {
    return this.authors.some(
      (author) =>
        !author.firstName ||
        !author.lastName ||
        !author.description ||
        !author.profilePicture ||
        !author.title
    );
  }

  getAuthorByLanguage() {
    return this.authors.find(
      (author) => author.authorLanguage === this.authorLanguage
    )!;
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.CREATE_AUTHORS);

    await this.fetchUserInfo();
  }
}
