import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { CategoriesEndpoint } from '@interfaces/categories.enum';
import { Observable } from 'rxjs';
import { GetCategoryResponse } from '@responses/get-category.interface';
import { CreateCategoryPayload } from '@payloads/create-category.interface';
import { CategoryCreatedResponse } from '@responses/category-created.interface';
import { EditCategoryPayload } from '@payloads/edit-category.interface';
import { CategoryEditedResponse } from '@responses/category-edited.interface';
import { DeleteCategoryInterface } from '@payloads/delete-category.interface';
import { CategoryDeletedInterface } from '@responses/category-deleted.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private readonly apiService: ApiService) {}

  createCategory(
    payload: Array<CreateCategoryPayload>
  ): Observable<CategoryCreatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.CATEGORIES,
      action: CategoriesEndpoint.CREATE,
      payload
    });
  }

  getAllCategories(): Observable<Array<GetCategoryResponse>> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.CATEGORIES,
      action: CategoriesEndpoint.GET_ALL
    });
  }

  editCategory(
    payload: EditCategoryPayload
  ): Observable<CategoryEditedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PATCH,
      controller: Controller.CATEGORIES,
      action: CategoriesEndpoint.EDIT,
      payload
    });
  }

  deleteCategory(
    params: DeleteCategoryInterface
  ): Observable<CategoryDeletedInterface> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.CATEGORIES,
      action: CategoriesEndpoint.DELETE,
      params
    });
  }
}
