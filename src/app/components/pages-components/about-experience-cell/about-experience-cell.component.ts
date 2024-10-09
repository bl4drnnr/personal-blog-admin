import dayjs from 'dayjs';
import { Component, Input } from '@angular/core';
import { FullExperience } from '@interfaces/full-experience.interface';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'component-about-experience-cell',
  templateUrl: './about-experience-cell.component.html',
  styleUrls: [
    './about-experience-cell.component.scss',
    '../shared/preview.styles.scss',
    '../shared/preview-about.styles.scss'
  ]
})
export class AboutExperienceCellComponent {
  @Input() experiences: Array<FullExperience>;

  constructor(private readonly envService: EnvService) {}

  careersStaticStorageLink = `${this.envService.getStaticStorageLink}/experiences-pictures/`;

  protected readonly dayjs = dayjs;
}
