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
import { EditCertificationPayload } from '@payloads/edit-certification.interface';
import { ValidationService } from '@services/validation.service';

@Component({
  selector: 'page-certification',
  templateUrl: './certification.component.html',
  styleUrls: [
    './certification.component.scss',
    '../shared/certification.styles.scss'
  ]
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
    private readonly validationService: ValidationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  staticStorageCertPics = `${this.envService.getStaticStorageLink}/certs-pictures/`;
  staticStorageCertFiles = `${this.envService.getStaticStorageLink}/certs-files/`;

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
          ).format('YYYY-MM-DD');
          this.certificationExpirationDate = dayjs(
            certification.expirationDate
          ).format('YYYY-MM-DD');
          this.certificationObtainedSkills = [...certification.obtainedSkills];
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

  editCertification() {
    const editCertificationPayload: EditCertificationPayload = {
      certificationId: this.certificationId
    };

    const areCertSkillsEqual = this.validationService.areArraysEqual(
      this.certification.obtainedSkills,
      this.certificationObtainedSkills
    );

    if (this.certification.certName !== this.certificationName)
      editCertificationPayload.certName = this.certificationName;
    if (this.certification.certDescription !== this.certificationDescription)
      editCertificationPayload.certDescription = this.certificationDescription;
    if (
      dayjs(this.certificationObtainingDate).format('YYYY-MM-DD') !==
      dayjs(this.certification.obtainingDate).format('YYYY-MM-DD')
    )
      editCertificationPayload.obtainingDate = new Date(
        this.certificationObtainingDate
      );
    if (
      dayjs(this.certificationExpirationDate).format('YYYY-MM-DD') !==
      dayjs(this.certification.expirationDate).format('YYYY-MM-DD')
    )
      editCertificationPayload.expirationDate = new Date(
        this.certificationExpirationDate
      );
    if (this.certNewPicture)
      editCertificationPayload.certPicture = this.certNewPicture as string;
    if (!areCertSkillsEqual)
      editCertificationPayload.obtainedSkills = this.certificationObtainedSkills;

    if (this.certificationNewDocs) {
      this.certificationsService
        .certificationFileUpload(this.certificationNewDocs)
        .subscribe({
          next: async ({ message, certificationFileName }) => {
            const translationMessage = await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
            this.globalMessageService.handle({
              message: translationMessage
            });

            editCertificationPayload.certDocs = certificationFileName;

            this.certificationsService
              .editCertification({ ...editCertificationPayload })
              .subscribe({
                next: async ({ message }) => {
                  const translationMessage =
                    await this.translationService.translateText(
                      message,
                      MessagesTranslation.RESPONSES
                    );
                  this.globalMessageService.handle({
                    message: translationMessage
                  });
                  this.certificationEditMode = false;
                  this.getCertificationById();
                }
              });
          }
        });
    } else {
      this.certificationsService
        .editCertification({ ...editCertificationPayload })
        .subscribe({
          next: async ({ message }) => {
            const translationMessage = await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );
            this.globalMessageService.handle({
              message: translationMessage
            });
            this.certificationEditMode = false;
            this.getCertificationById();
          }
        });
    }

    this.certNewPicture = null;
    this.certNewDocsFileInfo = null;
    this.certificationNewDocs = null;
  }

  changeCertificationSelectionStatus(certCommonId: string) {
    this.certificationsService
      .changeCertificationSelectionStatus({ certCommonId })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage = await this.translationService.translateText(
            message,
            MessagesTranslation.RESPONSES
          );
          this.globalMessageService.handle({
            message: translationMessage
          });
          this.getCertificationById();
        }
      });
  }

  deleteCertification() {
    this.certificationsService
      .deleteCertification({ certCommonId: this.certification.certCommonId })
      .subscribe({
        next: async ({ message }) => {
          const translationMessage = await this.translationService.translateText(
            message,
            MessagesTranslation.RESPONSES
          );
          this.globalMessageService.handle({
            message: translationMessage
          });
          await this.handleRedirect('account/certifications');
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

  selectCertificationNewPicture(event: any) {
    this.selectedFiles = event.target.files;

    if (!this.selectedFiles) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      this.certNewPicture = reader.result as string;
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
    const areCertSkillsEqual = this.validationService.areArraysEqual(
      this.certification.obtainedSkills,
      this.certificationObtainedSkills
    );

    return (
      this.certificationName !== this.certification.certName ||
      this.certificationDescription !== this.certificationDescription ||
      dayjs(this.certificationObtainingDate).format('YYYY-MM-DD') !==
        dayjs(this.certification.obtainingDate).format('YYYY-MM-DD') ||
      dayjs(this.certificationExpirationDate).format('YYYY-MM-DD') !==
        dayjs(this.certification.expirationDate).format('YYYY-MM-DD') ||
      this.certNewPicture ||
      this.certificationNewDocs ||
      !areCertSkillsEqual
    );
  }

  async addObtainedSkills() {
    if (this.certificationObtainedSkill === ' ') return;

    const isSkillPresent = this.certificationObtainedSkills.includes(
      this.certificationObtainedSkill.trim()
    );

    if (isSkillPresent) {
      await this.globalMessageService.handleWarning({
        message: 'tag-is-already-on-the-list'
      });
    } else {
      this.certificationObtainedSkills.push(this.certificationObtainedSkill.trim());
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
