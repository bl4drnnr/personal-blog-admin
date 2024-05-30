import { CategoryInterface } from '@payloads/category.interface';

export interface CreateCategoryPayload {
  categories: Array<CategoryInterface>;
}
