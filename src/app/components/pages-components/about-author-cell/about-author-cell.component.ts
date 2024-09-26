import { Component, Input } from '@angular/core';
import { SocialInterface } from '@interfaces/social.interface';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'component-about-author-cell',
  templateUrl: './about-author-cell.component.html',
  styleUrl: '../shared/preview.styles.scss'
})
export class AboutAuthorCellComponent {
  @Input() image: string;
  @Input() title: string;
  @Input() firstName: string;
  @Input() lastName: string;
  @Input() description: string;
  @Input() socialLinks: Array<SocialInterface>;

  constructor(private readonly envService: EnvService) {}

  authorsStaticStorage = `${this.envService.getStaticStorageLink}/authors-pictures/`;
}
