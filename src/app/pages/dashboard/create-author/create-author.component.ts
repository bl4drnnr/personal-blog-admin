import { Component, OnInit } from '@angular/core';
import { Titles } from '@interfaces/titles.enum';
import { Router } from '@angular/router';
import { TranslationService } from '@services/translation.service';
import { RefreshTokensService } from '@services/refresh-token.service';
import { UserInfoResponse } from '@responses/user-info.interface';
import { AuthorsService } from '@services/authors.service';

@Component({
  selector: 'page-create-author',
  templateUrl: './create-author.component.html',
  styleUrl: './create-author.component.scss'
})
export class CreateAuthorComponent implements OnInit {
  firstName: string;
  lastName: string;
  description: string;
  selectedFiles?: FileList;
  profilePicture: string;

  userInfo: UserInfoResponse;

  constructor(
    private readonly router: Router,
    private readonly authorsService: AuthorsService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService
  ) {}

  createAuthor() {
    const payload = {
      firstName: this.firstName,
      lastName: this.lastName,
      description: this.description,
      profilePicture: this.profilePicture
    };

    this.authorsService.createAuthor({ ...payload }).subscribe({
      next: async ({ authorId }) =>
        await this.handleRedirect(`account/author/${authorId}`)
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
