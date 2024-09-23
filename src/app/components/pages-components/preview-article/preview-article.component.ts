import { Component, Input } from '@angular/core';
import dayjs from 'dayjs';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'page-component-preview-article',
  templateUrl: './preview-article.component.html',
  styleUrl: './preview-article.component.scss'
})
export class PreviewArticleComponent {
  @Input() articleCategory: string;
  @Input() articleName: string;
  @Input() articleCreatedAt: Date;
  @Input() articlePicture: string | ArrayBuffer | null;
  @Input() articleImage: string;
  @Input() articleContent: string;

  constructor(private readonly envService: EnvService) {}

  staticStorage = `${this.envService.getStaticStorageLink}/articles-main-pictures/`;

  protected readonly dayjs = dayjs;
}
