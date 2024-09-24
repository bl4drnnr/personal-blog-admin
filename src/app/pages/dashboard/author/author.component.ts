import dayjs from 'dayjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EnvService } from '@shared/env.service';
import { AuthorsService } from '@services/authors.service';
import { TranslationService } from '@services/translation.service';
import { RefreshTokensService } from '@services/refresh-token.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { UserInfoResponse } from '@responses/user-info.interface';
import { GetAuthorByIdResponse } from '@responses/get-author-by-id.interface';
import { MessagesTranslation } from '@translations/messages.enum';
import { Titles } from '@interfaces/titles.enum';
import { EditAuthorPayload } from '@payloads/edit-author.interface';
import { ValidationService } from '@services/validation.service';
import { SocialsService } from '@services/socials.service';
import { SocialResponse } from '@interfaces/social-response.interface';

@Component({
  selector: 'page-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss', '../shared/author.styles.scss']
})
export class AuthorComponent implements OnInit {
  author: GetAuthorByIdResponse;

  authorId: string;

  authorFirstName: string;
  authorLastName: string;
  authorDescription: string;
  selectedFiles?: FileList;
  authorImage: string;
  authorSocials: Array<SocialResponse> = [];
  authorNewImage: string | ArrayBuffer | null = '';
  isSelected: boolean;
  authorCreatedAt: Date;
  authorUpdatedAt: Date;
  authorEditMode = false;

  socialTitle: string;
  socialLink: string;
  addingSocial: boolean = false;

  userInfo: UserInfoResponse;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly envService: EnvService,
    private readonly authorsService: AuthorsService,
    private readonly socialsService: SocialsService,
    private readonly validationService: ValidationService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  staticStorage = `${this.envService.getStaticStorageLink}/authors-pictures/`;

  getAuthorById() {
    this.authorsService
      .getAuthorById({
        authorId: this.authorId
      })
      .subscribe({
        next: (author) => {
          this.translationService.setPageTitle(Titles.AUTHOR, {
            authorFullName: `${author.firstName} ${author.lastName}`
          });
          this.author = author;
          this.authorSocials = author.socials.map((social) => ({
            ...social
          }));
          this.authorFirstName = author.firstName;
          this.authorLastName = author.lastName;
          this.authorDescription = author.description;
          this.authorImage = author.profilePicture;
          this.isSelected = author.isSelected;
          this.authorCreatedAt = author.createdAt;
          this.authorUpdatedAt = author.updatedAt;
        },
        error: async () => await this.handleRedirect('account/authors')
      });
  }

  editAuthor() {
    const authorPayload: EditAuthorPayload = {
      authorId: this.authorId
    };

    if (this.author.firstName !== this.authorFirstName)
      authorPayload.firstName = this.authorFirstName;
    if (this.author.lastName !== this.authorLastName)
      authorPayload.lastName = this.authorLastName;
    if (this.author.description !== this.authorDescription)
      authorPayload.description = this.authorDescription;
    if (this.authorNewImage)
      authorPayload.profilePicture = this.authorNewImage as string;

    this.authorsService
      .editAuthor({
        ...authorPayload
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
          this.authorEditMode = false;

          this.handleSocialsChanges();

          this.getAuthorById();
        }
      });
  }

  changeAuthorSelectionStatus(authorId: string) {
    this.authorsService.changeAuthorSelectionStatus({ authorId }).subscribe({
      next: async ({ message }) => {
        const translationMessage = await this.translationService.translateText(
          message,
          MessagesTranslation.RESPONSES
        );
        this.globalMessageService.handle({
          message: translationMessage
        });
        this.getAuthorById();
      }
    });
  }

  deleteAuthor() {
    this.authorsService.deleteAuthor({ authorId: this.authorId }).subscribe({
      next: async ({ message }) => {
        const translationMessage = await this.translationService.translateText(
          message,
          MessagesTranslation.RESPONSES
        );
        this.globalMessageService.handle({
          message: translationMessage
        });
        await this.handleRedirect('account/authors');
      }
    });
  }

  handleSocialsChanges() {
    const areAuthorSocialsEqual = this.validationService.areArraysObjectEqual(
      this.authorSocials,
      this.author.socials
    );

    if (areAuthorSocialsEqual) return;

    for (const social of this.authorSocials) {
      if (social.hasOwnProperty('id')) {
        this.socialsService
          .updateSocial({
            socialId: social.id as string,
            title: social.title,
            link: social.link
          })
          .subscribe();
      } else {
        this.socialsService
          .createSocial({
            authorId: this.authorId,
            title: social.title,
            link: social.link
          })
          .subscribe();
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

  selectFile(event: any) {
    this.selectedFiles = event.target.files;

    if (!this.selectedFiles) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      this.authorNewImage = reader.result;
    };
  }

  async addSocial() {
    const isSocialLinkPresent = this.authorSocials.find(
      ({ link }) => this.socialLink === link
    );
    const isSocialTitlePresent = this.authorSocials.find(
      ({ title }) => this.socialTitle === title
    );

    if (isSocialLinkPresent || isSocialTitlePresent) {
      return await this.globalMessageService.handleWarning({
        message: 'tag-is-already-on-the-list'
      });
    }

    this.authorSocials.push({
      link: this.socialLink,
      title: this.socialTitle
    });

    this.socialLink = '';
    this.socialTitle = '';
    this.addingSocial = false;
  }

  deleteSocial(social: SocialResponse) {
    if (social.hasOwnProperty('id')) {
      this.socialsService
        .deleteSocial({
          socialId: social.id as string
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

            this.getAuthorById();
          }
        });
    } else {
      this.authorSocials = this.validationService.deleteObjectFromArray(
        this.authorSocials,
        'title',
        social.title
      );
    }
  }

  addingSocialDisabled() {
    return !this.socialLink || !this.socialTitle;
  }

  authorEdited() {
    const areAuthorSocialsEqual = this.validationService.areArraysObjectEqual(
      this.authorSocials,
      this.author.socials
    );

    return (
      this.author.firstName !== this.authorFirstName ||
      this.author.lastName !== this.authorLastName ||
      this.author.description !== this.authorDescription ||
      this.authorNewImage ||
      !areAuthorSocialsEqual
    );
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const authorId = params.get('authorId');

      if (!authorId) return await this.handleRedirect('account/authors');

      this.authorId = authorId;

      await this.fetchUserInfo();

      this.getAuthorById();
    });
  }

  protected readonly dayjs = dayjs;
}
