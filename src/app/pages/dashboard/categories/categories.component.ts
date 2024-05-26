import dayjs from 'dayjs';
import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '@services/categories.service';
import { UserInfoResponse } from '@responses/user-info.interface';
import { Router } from '@angular/router';
import { RefreshTokensService } from '@services/refresh-token.service';
import { GetCategoryResponse } from '@responses/get-category.interface';
import { GlobalMessageService } from '@shared/global-message.service';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { CreateCategoryPayload } from '@payloads/create-category.interface';

@Component({
  selector: 'page-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Array<CreateCategoryPayload> = [{
    categoryName: '',
    categoryDescription: '',
    categoryLanguage: 'PL'
  }, {
    categoryName: '',
    categoryDescription: '',
    categoryLanguage: 'EN'
  }, {
    categoryName: '',
    categoryDescription: '',
    categoryLanguage: 'RU'
  }];

  categoryName: string;
  categoryDescription: string;
  categoryLanguage: string;
  editingCategoryId: string;

  allCategories: Array<GetCategoryResponse> = [];

  userInfo: UserInfoResponse;

  constructor(
    private readonly router: Router,
    private readonly categoriesService: CategoriesService,
    private readonly translationService: TranslationService,
    private readonly globalMessageService: GlobalMessageService,
    private readonly refreshTokensService: RefreshTokensService
  ) {}

  createCategory() {
    this.categoriesService
      .createCategory([])
      .subscribe({
        next: ({ message }) => {
          this.categoryName = '';
          this.categoryDescription = '';
          this.globalMessageService.handle({ message });
          this.getAllCategories();
        }
      });
  }

  editCategory(categoryId: string) {
    const category = this.allCategories.find((cat) => cat.id === categoryId);
    if (!category) return;

    this.categoriesService
      .editCategory({
        categoryName: category.categoryName,
        categoryDescription: category.categoryDescription,
        categoryId: category.id
      })
      .subscribe({
        next: ({ message }) => {
          this.editingCategoryId = '';
          this.globalMessageService.handle({ message });
          this.getAllCategories();
        }
      });
  }

  deleteCategory(categoryId: string) {
    this.categoriesService
      .deleteCategory({
        categoryId
      })
      .subscribe({
        next: ({ message }) => {
          this.globalMessageService.handle({ message });
          this.getAllCategories();
        }
      });
  }

  getAllCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (allCategories) => (this.allCategories = allCategories)
    });
  }

  disableCreateCategoryButton() {
    return !this.categoryName || !this.categoryDescription;
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
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

  getCategoryByLanguage() {
    return this.categories.find(category => category.categoryLanguage === this.categoryLanguage)!;
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.CATEGORIES);

    await this.fetchUserInfo();

    this.getAllCategories();
  }

  protected readonly dayjs = dayjs;
}
