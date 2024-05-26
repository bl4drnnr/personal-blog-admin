import { DropdownInterface } from '@interfaces/dropdown.interface';

export interface CreateArticleInterface {
  articleName: string;
  articleDescription: string;
  articleTag: string;
  articleTags: Array<string>;
  articleContent: string;
  articlePicture: string;
  articleCategory: DropdownInterface;
  articleLanguage: string;
}
