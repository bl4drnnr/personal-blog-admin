export interface ILink {
  name: string;
  link: string;
}

export interface IPicture {
  type: 'picture';
  width: string;
  resource: string;
}

export interface IList {
  type: 'list-numeric' | 'list-bullet';
  items: Array<any>;
  style: string;
}

export interface ICode {
  type: 'code';
  lang: string;
  content: string;
}

export interface ITitle {
  type: 'title' | 'subtitle' | 'subsubtitle';
  content: string;
}

export enum LanguageType {
  pl = 'pl',
  ru = 'ru',
  en = 'en'
}

export enum PostType {
  theory = 'theory',
  practice = 'practice'
}

export interface IPost {
  id?: string;
  language?: LanguageType;
  title?: string;
  slug?: string;
  tags?: string;
  type?: Array<PostType>;
  description?: string;
  pageDescription?: string;
  searchTags?: Array<string>;
  intro?: string;
  toc?: object;
  content?: Array<string | IPicture | IList | ICode | ITitle>;
  references?: Array<ILink>;
}
