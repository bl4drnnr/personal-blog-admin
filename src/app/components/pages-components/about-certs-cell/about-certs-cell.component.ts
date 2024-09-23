import dayjs from 'dayjs';
import { Component, Input } from '@angular/core';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'component-about-certs-cell',
  templateUrl: './about-certs-cell.component.html',
  styleUrl: './about-certs-cell.component.scss'
})
export class AboutCertsCellComponent {
  @Input() certs: Array<string>;

  constructor(private readonly envService: EnvService) {}

  certsDocsStaticStorageLink: string = `${this.envService.getStaticStorageLink}/certs-files/`;
  certsPicsStaticStorageLink: string = `${this.envService.getStaticStorageLink}/certs-pictures/`;

  downloadCert(certLink: string) {
    window.open(this.certsDocsStaticStorageLink + certLink, '_blank');
  }

  protected readonly dayjs = dayjs;
}
