import dayjs from 'dayjs';
import { Component, Input } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { ListCertification } from '@interfaces/list-certification.interface';

@Component({
  selector: 'component-about-certs-cell',
  templateUrl: './about-certs-cell.component.html',
  styleUrls: [
    './about-certs-cell.component.scss',
    '../shared/preview.styles.scss',
    '../shared/preview-about.styles.scss'
  ]
})
export class AboutCertsCellComponent {
  @Input() certs: Array<ListCertification>;

  constructor(private readonly envService: EnvService) {}

  certsDocsStaticStorageLink: string = `${this.envService.getStaticStorageLink}/certs-files/`;
  certsPicsStaticStorageLink: string = `${this.envService.getStaticStorageLink}/certs-pictures/`;

  downloadCert(certLink: string) {
    window.open(this.certsDocsStaticStorageLink + certLink, '_blank');
  }

  protected readonly dayjs = dayjs;
}
