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
import { CategoryInterface } from '@payloads/category.interface';
import { MessagesTranslation } from '@translations/messages.enum';

@Component({
  selector: 'page-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Array<CategoryInterface> = [
    {
      categoryName: '',
      categoryDescription: '',
      categoryLanguage: 'pl'
    },
    {
      categoryName: '',
      categoryDescription: '',
      categoryLanguage: 'en'
    },
    {
      categoryName: '',
      categoryDescription: '',
      categoryLanguage: 'ru'
    }
  ];

  categoryName: string;
  categoryDescription: string;
  categoryLanguage: string = 'en';
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
      .createCategory({ categories: this.categories })
      .subscribe({
        next: async ({ message }) => {
          this.categoryName = '';
          this.categoryDescription = '';
          this.categoryLanguage = 'en';

          this.categories = [
            {
              categoryName: '',
              categoryDescription: '',
              categoryLanguage: 'pl'
            },
            {
              categoryName: '',
              categoryDescription: '',
              categoryLanguage: 'en'
            },
            {
              categoryName: '',
              categoryDescription: '',
              categoryLanguage: 'ru'
            }
          ];

          const translationMessage =
            await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
          this.globalMessageService.handle({ message: translationMessage });
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
        next: async ({ message }) => {
          this.editingCategoryId = '';
          const translationMessage =
            await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
          this.globalMessageService.handle({ message: translationMessage });
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
        next: async ({ message }) => {
          const translationMessage =
            await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
          this.globalMessageService.handle({ message: translationMessage });
          this.getAllCategories();
        }
      });
  }

  getAllCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (allCategories) => (this.allCategories = allCategories)
    });
  }

  changeCategoryName(categoryName: string) {
    this.categoryName = categoryName;
    const category = this.getCategoryByLanguage();
    category.categoryName = categoryName;
  }

  changeCategoryDescription(categoryDescription: string) {
    this.categoryDescription = categoryDescription;
    const category = this.getCategoryByLanguage();
    category.categoryDescription = categoryDescription;
  }

  changeCategoryLanguage(categoryLanguage: string) {
    this.categoryLanguage = categoryLanguage;

    const category = this.getCategoryByLanguage();

    this.categoryName = category.categoryName;
    this.categoryDescription = category.categoryDescription;
  }

  disableCreateCategoryButton() {
    const category1 = this.categories[0];
    const category2 = this.categories[1];
    const category3 = this.categories[2];
    return (
      !category1.categoryName ||
      !category1.categoryDescription ||
      !category2.categoryName ||
      !category2.categoryDescription ||
      !category3.categoryName ||
      !category3.categoryDescription
    );
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
    return this.categories.find(
      (category) => category.categoryLanguage === this.categoryLanguage
    )!;
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.CATEGORIES);

    await this.fetchUserInfo();

    this.getAllCategories();
  }

  protected readonly dayjs = dayjs;
}
