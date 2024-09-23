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

@Component({
  selector: 'page-author',
  templateUrl: './author.component.html',
  styleUrls: [
    './author.component.scss',
    '../shared/author.styles.scss'
  ]
})
export class AuthorComponent implements OnInit {
  author: GetAuthorByIdResponse;

  authorId: string;

  authorFirstName: string;
  authorLastName: string;
  authorDescription: string;
  selectedFiles?: FileList;
  authorImage: string;
  authorNewImage: string | ArrayBuffer | null = '';
  isSelected: boolean;
  authorCreatedAt: Date;
  authorUpdatedAt: Date;
  authorEditMode = false;

  userInfo: UserInfoResponse;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly envService: EnvService,
    private readonly authorsService: AuthorsService,
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
          this.authorFirstName = author.firstName;
          this.authorLastName = author.lastName;
          this.authorDescription = author.description;
          this.authorImage = author.profilePicture;
          this.isSelected = author.isSelected;
          this.authorCreatedAt = author.createdAt;
          this.authorUpdatedAt = author.updatedAt;
        },
        error: async () =>
          await this.handleRedirect('account/authors')
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
          const translationMessage =
            await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
          this.globalMessageService.handle({
            message: translationMessage
          });
          this.authorEditMode = false;
          this.getAuthorById();
        }
      });
  }

  changeAuthorSelectionStatus(authorId: string) {
    this.authorsService
      .changeAuthorSelectionStatus({ authorId })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage =
            await this.translationService.translateText(
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
    this.authorsService
      .deleteAuthor({ authorId: this.authorId })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage =
            await this.translationService.translateText(
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

  authorEdited() {
    return (
      this.author.firstName !== this.authorFirstName ||
      this.author.lastName !== this.authorLastName ||
      this.author.description !== this.authorDescription ||
      this.authorNewImage
    );
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const authorId = params.get('authorId');

      if (!authorId)
        return await this.handleRedirect('account/authors');

      this.authorId = authorId;

      await this.fetchUserInfo();

      this.getAuthorById();
    });
  }

  protected readonly dayjs = dayjs;
}
