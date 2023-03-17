export interface ITechStack {
  src: string;
  width: number;
  height: number;
}

export interface IProjectPage {
  link: string;
  text: string;
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

export interface IProject {
  id?: string;
  language?: LanguageType;
  title?: string;
  slug?: string;
  brief?: string;
  tags?: string;
  description?: string;
  projectTags?: Array<string>;
  briefDescription?: string;
  license?: string;
  techStack?: Array<ITechStack>;
  projectPages?: Array<IProjectPage>;
  toc?: object;
  content?: Array<string | IPicture | IList | ICode | ITitle>;
}
