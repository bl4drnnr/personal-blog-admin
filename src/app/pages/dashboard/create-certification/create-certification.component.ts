import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CertificationsService } from '@services/certifications.service';
import { TranslationService } from '@services/translation.service';
import { RefreshTokensService } from '@services/refresh-token.service';
import { UserInfoResponse } from '@responses/user-info.interface';
import { Titles } from '@interfaces/titles.enum';
import { GlobalMessageService } from '@shared/global-message.service';
import { MessagesTranslation } from '@translations/messages.enum';
import { AuthorsService } from '@services/authors.service';
import { ListAuthor } from '@interfaces/list-author.interface';
import { CreateCertInterface } from '@interfaces/create-cert.interface';

@Component({
  selector: 'page-create-certification',
  templateUrl: './create-certification.component.html',
  styleUrls: [
    './create-certification.component.scss',
    '../shared/certification.styles.scss'
  ]
})
export class CreateCertificationComponent implements OnInit {
  certifications: Array<CreateCertInterface> = [
    {
      certName: '',
      certDescription: '',
      certPicture: '',
      certDocs: '',
      obtainingDate: new Date(),
      expirationDate: new Date(),
      obtainedSkills: [],
      certLanguage: 'EN',
      authorId: '',
      authorName: ''
    },
    {
      certName: '',
      certDescription: '',
      certPicture: '',
      certDocs: '',
      obtainingDate: new Date(),
      expirationDate: new Date(),
      obtainedSkills: [],
      certLanguage: 'PL',
      authorId: '',
      authorName: ''
    },
    {
      certName: '',
      certDescription: '',
      certPicture: '',
      certDocs: '',
      obtainingDate: new Date(),
      expirationDate: new Date(),
      obtainedSkills: [],
      certLanguage: 'RU',
      authorId: '',
      authorName: ''
    }
  ];

  certName: string;
  certDescription: string;
  selectedFiles?: FileList;
  certPicture: string;
  certDocs: string;
  certDocsFileInfo: File | null;
  certLanguage: string = 'EN';
  pdfSrc: string;
  certificationDocument: FormData | null;
  obtainingDate: string;
  expirationDate: string;
  certObtainedSkill: string;
  certObtainedSkills: Array<string> = [];
  authorId: string;
  authorSearchQuery: string;

  userInfo: UserInfoResponse;
  authors: Array<ListAuthor> = [];

  constructor(
    private readonly router: Router,
    private readonly certificationsService: CertificationsService,
    private readonly authorsService: AuthorsService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  createCertification() {
    this.certificationsService
      .certificationFileUpload(this.certificationDocument as FormData)
      .subscribe({
        next: async ({ message, certificationFileName }) => {
          await this.showResponseMessage(message);

          const certifications = this.certifications.map((cert) => ({
            certName: cert.certName,
            certDescription: cert.certDescription,
            certPicture: cert.certPicture,
            certDocs: certificationFileName,
            obtainingDate: cert.obtainingDate,
            expirationDate: cert.expirationDate,
            obtainedSkills: cert.obtainedSkills,
            certLanguage: cert.certLanguage,
            authorId: cert.authorId
          }));

          this.certificationsService
            .createCertification({ certifications })
            .subscribe({
              next: async () => {
                await this.handleRedirect('account/certifications');
              }
            });
        }
      });
  }

  listAuthors() {
    const listAuthorsPayload = {
      page: '0',
      pageSize: '5',
      order: 'created_at',
      orderBy: 'DESC',
      query: this.authorSearchQuery
    };

    this.authorsService.listAuthors({ ...listAuthorsPayload }).subscribe({
      next: ({ rows }) => (this.authors = rows)
    });
  }

  handleAuthorQuery(authorQuery: string) {
    this.authorSearchQuery = authorQuery;
    if (this.authorSearchQuery) this.listAuthors();
    else this.authors = [];
  }

  selectAuthor(author: ListAuthor) {
    this.authorId = author.id;
    const cert = this.getCertByLanguage();

    cert.authorId = author.id;
    cert.authorName = `${author.firstName} ${author.lastName}`;

    this.authors = [];
  }

  getCertSkills() {
    const cert = this.getCertByLanguage();
    return cert.obtainedSkills;
  }

  getAuthorName() {
    const cert = this.getCertByLanguage();
    return cert.authorName!;
  }

  async addObtainedSkills() {
    if (this.certObtainedSkill === ' ') return;

    const cert = this.getCertByLanguage();

    const isSkillPresent = cert.obtainedSkills.includes(
      this.certObtainedSkill.trim()
    );

    if (isSkillPresent) {
      await this.globalMessageService.handleWarning({
        message: 'tag-is-already-on-the-list'
      });
    } else {
      cert.obtainedSkills.push(this.certObtainedSkill.trim());
    }

    this.certObtainedSkill = '';
  }

  deleteObtainedSkill(obtainedSkill: string) {
    const cert = this.getCertByLanguage();

    cert.obtainedSkills.splice(cert.obtainedSkills.indexOf(obtainedSkill), 1);
  }

  clearCertPicture() {
    this.certPicture = '';
    this.certifications.map((cert) => (cert.certPicture = ''));
  }

  clearCertDocument() {
    this.certDocsFileInfo = null;
    this.certificationDocument = null;
  }

  selectCertificationPicture(event: any) {
    this.selectedFiles = event.target.files;

    if (!this.selectedFiles) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      this.certifications.map(
        (cert) => (cert.certPicture = reader.result as string)
      );
      this.certPicture = reader.result as string;
    };
  }

  selectCertificationDocument(event: any) {
    const fileList: FileList = event.target.files;

    if (fileList.length < 0) return;

    const file: File = fileList[0];

    this.certDocs = file.name;
    this.certifications.map((cert) => (cert.certDocs = file.name));
    this.certDocsFileInfo = file;

    this.certificationDocument = new FormData();
    this.certificationDocument.append('certificateFile', file, file.name);

    const $img: any = document.querySelector('#certificatePdf');

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      };

      reader.readAsArrayBuffer($img.files[0]);
    }
  }

  modifyCertName(certName: string) {
    this.certName = certName;
    const cert = this.getCertByLanguage();
    cert.certName = certName;
  }

  modifyCertDescription(certDescription: string) {
    this.certDescription = certDescription;
    const cert = this.getCertByLanguage();
    cert.certDescription = certDescription;
  }

  modifyCertObtainingDate(certObtainingDate: string) {
    this.obtainingDate = certObtainingDate;
    const cert = this.getCertByLanguage();
    cert.obtainingDate = new Date(certObtainingDate);
  }

  modifyCertExpirationDate(certExpirationDate: string) {
    this.expirationDate = certExpirationDate;
    const cert = this.getCertByLanguage();
    cert.expirationDate = new Date(certExpirationDate);
  }

  changeCertLanguage(certLanguage: string) {
    this.certLanguage = certLanguage;

    const cert = this.getCertByLanguage();

    this.certName = cert.certName;
    this.certDescription = cert.certDescription;
    this.certObtainedSkills = cert.obtainedSkills;
    this.authorId = cert.authorId;
  }

  disableCreateCertButton() {
    return (
      !this.certName ||
      !this.certDescription ||
      !this.certPicture ||
      !this.certDocs ||
      !this.certificationDocument ||
      !this.authorId ||
      this.certObtainedSkills.length === 0 ||
      !this.obtainingDate ||
      !this.obtainingDate
    );
  }

  getCertByLanguage() {
    return this.certifications.find(
      (cert) => cert.certLanguage === this.certLanguage
    )!;
  }

  async fetchUserInfo() {
    const userInfoRequest = await this.refreshTokensService.refreshTokens();
    if (userInfoRequest) {
      userInfoRequest.subscribe({
        next: (userInfo) => (this.userInfo = userInfo),
        error: async () => {
          localStorage.removeItem('_at');
          await this.handleRedirect('login');
        }
      });
    }
  }

  async showResponseMessage(message: string) {
    const translationMessage = await this.translationService.translateText(
      message,
      MessagesTranslation.RESPONSES
    );
    this.globalMessageService.handle({
      message: translationMessage
    });
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.CREATE_CERTIFICATION);

    await this.fetchUserInfo();
  }
}
