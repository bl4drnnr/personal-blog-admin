import { Component, Input, OnInit } from '@angular/core';
import { AuthorsService } from '@services/authors.service';
import { ExperienceService } from '@services/experience.service';
import { CertificationsService } from '@services/certifications.service';
import { EnvService } from '@shared/env.service';
import { GetSelectedAuthorResponse } from '@responses/get-selected-author.interface';

@Component({
  selector: 'page-component-preview-about',
  templateUrl: './preview-about.component.html',
  styleUrls: ['../shared/preview-about.styles.scss', '../shared/preview.styles.scss']
})
export class PreviewAboutComponent implements OnInit {
  @Input() getMembers: boolean = false;
  @Input() getExperience: boolean = false;
  @Input() getCertifications: boolean = false;

  selectedAuthor: GetSelectedAuthorResponse;
  selectedExperiences: Array<any> = [];
  selectedCertifications: Array<any> = [];

  constructor(
    private readonly envService: EnvService,
    private readonly authorsService: AuthorsService,
    private readonly experienceService: ExperienceService,
    private readonly certificationsService: CertificationsService
  ) {}

  experienceStaticStorage = `${this.envService.getStaticStorageLink}/experiences-pictures/`;
  certsFilesStaticStorage = `${this.envService.getStaticStorageLink}/certs-files/`;
  certsPicsStaticStorage = `${this.envService.getStaticStorageLink}/certs-pictures/`;

  getSelectedAuthor() {
    this.authorsService.getSelectedAuthor().subscribe({
      next: (author) => (this.selectedAuthor = author)
    });
  }

  getSelectedExperience() {}

  getSelectedCertifications() {}

  ngOnInit() {
    if (this.getMembers) this.getSelectedAuthor();
    if (this.getExperience) this.getSelectedExperience();
    if (this.getCertifications) this.getSelectedCertifications();
  }
}
