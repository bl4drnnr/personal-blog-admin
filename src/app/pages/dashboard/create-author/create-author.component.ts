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

@Component({
  selector: 'page-create-author',
  templateUrl: './create-author.component.html',
  styleUrls: [
    './create-author.component.scss',
    '../shared/author.styles.scss'
  ]
})
export class CreateAuthorComponent implements OnInit {
  firstName: string;
  lastName: string;
  description: string;
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
    private readonly validationService: ValidationService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  createAuthor() {
    const payload = {
      firstName: this.firstName,
      lastName: this.lastName,
      description: this.description,
      profilePicture: this.profilePicture
    };

    this.authorsService.createAuthor({ ...payload }).subscribe({
      next: async ({ authorId }) => {
        this.handleSocialsCreation(authorId);
        await this.handleRedirect(`account/author/${authorId}`);
      }
    });
  }

  handleSocialsCreation(authorId: string) {
    if (this.socials.length === 0) return;

    for (const social of this.socials) {
      const socialPayload: CreateSocialPayload = {
        authorId,
        ...social
      };

      this.socialsService
        .createSocial({ ...socialPayload })
        .subscribe();
    }
  }

  async fetchUserInfo() {
    const userInfoRequest =
      await this.refreshTokensService.refreshTokens();
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
    this.profilePicture = '';
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;

    if (!this.selectedFiles) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      this.profilePicture = reader.result as string;
    };
  }

  disableCreateAuthorButton() {
    return (
      !this.firstName ||
      !this.lastName ||
      !this.description ||
      !this.profilePicture
    );
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.CREATE_AUTHORS);

    await this.fetchUserInfo();
  }
}
