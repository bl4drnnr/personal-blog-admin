import dayjs from 'dayjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RefreshTokensService } from '@services/refresh-token.service';
import { UserInfoResponse } from '@responses/user-info.interface';
import { EnvService } from '@shared/env.service';
import { CertificationsService } from '@services/certifications.service';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { GetCertificationByIdResponse } from '@responses/get-certification-by-id.interface';
import { MessagesTranslation } from '@translations/messages.enum';
import { GlobalMessageService } from '@shared/global-message.service';
import { AuthorsService } from '@services/authors.service';
import { ListAuthor } from '@interfaces/list-author.interface';
import { GetAuthorByIdResponse } from '@responses/get-author-by-id.interface';

@Component({
  selector: 'page-certification',
  templateUrl: './certification.component.html',
  styleUrl: './certification.component.scss'
})
export class CertificationComponent implements OnInit {
  certification: GetCertificationByIdResponse;

  certificationId: string;
  authorId: string;
  authorSearchQuery: string;
  authors: Array<ListAuthor> = [];
  author: GetAuthorByIdResponse;

  certificationName: string;
  certificationDescription: string;
  certificationPicture: string;
  certificationDocs: string;
  certificationObtainingDate: string;
  certificationExpirationDate: string;
  certificationObtainedSkill: string;
  certificationObtainedSkills: Array<string>;
  isSelected: boolean;
  certificationAuthorId: string;
  certificationCreatedAt: Date;
  certificationUpdatedAt: Date;
  certificationEditMode = false;

  userInfo: UserInfoResponse;
  selectedFiles?: FileList;
  certNewPicture: string | ArrayBuffer | null = '';
  certNewDocsName: string;
  certNewDocsFileInfo: File | null;
  certificationNewDocs: FormData | null;
  pdfSrc: string;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly envService: EnvService,
    private readonly translationService: TranslationService,
    private readonly certificationsService: CertificationsService,
    private readonly authorsService: AuthorsService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  staticStorage = `${this.envService.getStaticStorageLink}/certs-pictures/`;

  getCertificationById() {
    this.certificationsService
      .getCertificationById({
        certificationId: this.certificationId
      })
      .subscribe({
        next: (certification) => {
          this.translationService.setPageTitle(Titles.CERTIFICATION, {
            certName: certification.certName
          });
          this.certification = certification;
          this.authorId = certification.authorId;
          this.certificationName = certification.certName;
          this.certificationDescription = certification.certDescription;
          this.certificationPicture = certification.certPicture;
          this.certificationDocs = certification.certDocs;
          this.certificationObtainingDate = dayjs(
            certification.obtainingDate
          ).format('DD/MM/YYYY');
          this.certificationExpirationDate = dayjs(
            certification.expirationDate
          ).format('DD/MM/YYYY');
          this.certificationObtainedSkills = certification.obtainedSkills;
          this.isSelected = certification.isSelected;
          this.certificationAuthorId = certification.authorId;
          this.certificationCreatedAt = certification.createdAt;
          this.certificationUpdatedAt = certification.updatedAt;

          this.getAuthorById();
        },
        error: async () => await this.handleRedirect('account/certifications')
      });
  }

  handleAuthorQuery(authorQuery: string) {
    this.authorSearchQuery = authorQuery;
    if (this.authorSearchQuery) this.listAuthors();
    else this.authors = [];
  }

  selectAuthor(author: ListAuthor) {
    this.authorId = author.id;
    this.authorSearchQuery = `${author.firstName} ${author.lastName}`;
    this.authors = [];
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

  getAuthorById() {
    this.authorsService.getAuthorById({ authorId: this.authorId }).subscribe({
      next: (author) => {
        this.author = author;
        this.selectAuthor(author);
      }
    });
  }

  editCertification() {}

  changeCertificationSelectionStatus(certificationId: string) {
    this.certificationsService
      .changeCertificationSelectionStatus({ certificationId })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage =
            await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
          this.globalMessageService.handle({ message: translationMessage });
          this.getCertificationById();
        }
      });
  }

  deleteCertification(certificationId: string) {
    this.certificationsService
      .deleteCertification({ certificationId })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage =
            await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
          this.globalMessageService.handle({ message: translationMessage });
          this.getCertificationById();
        }
      });
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

  clearCertDocument() {
    this.certNewDocsFileInfo = null;
    this.certificationNewDocs = null;
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
    if (!this.selectedFiles) return;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.certNewPicture = reader.result;
    };
  }

  selectCertificationDocument(event: any) {
    const fileList: FileList = event.target.files;

    if (fileList.length < 0) return;

    const file: File = fileList[0];
    this.certNewDocsName = file.name;
    this.certNewDocsFileInfo = file;

    this.certificationNewDocs = new FormData();
    this.certificationNewDocs.append('certificateFile', file, file.name);

    const $img: any = document.querySelector('#certificatePdf');

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      };

      reader.readAsArrayBuffer($img.files[0]);
    }
  }

  certificationEdited() {
    return true;
  }

  async addObtainedSkills() {
    if (this.certificationObtainedSkill === ' ') return;

    const isSkillPresent = this.certificationObtainedSkills.includes(
      this.certificationObtainedSkill
    );

    if (isSkillPresent) {
      const translationMessage = await this.translationService.translateText(
        'tag-is-already-on-the-list',
        MessagesTranslation.RESPONSES
      );

      await this.globalMessageService.handleWarning({
        message: translationMessage
      });
    } else {
      this.certificationObtainedSkills.push(this.certificationObtainedSkill);
    }

    this.certificationObtainedSkill = '';
  }

  deleteObtainedSkill(obtainedSkill: string) {
    this.certificationObtainedSkills.splice(
      this.certificationObtainedSkills.indexOf(obtainedSkill),
      1
    );
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const certificationId = params.get('certificationId');

      if (!certificationId)
        return await this.handleRedirect('account/certifications');

      this.certificationId = certificationId;

      await this.fetchUserInfo();

      this.getCertificationById();
    });
  }

  protected readonly dayjs = dayjs;
}
