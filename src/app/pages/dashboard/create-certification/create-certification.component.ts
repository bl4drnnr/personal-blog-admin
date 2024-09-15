import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CertificationsService } from '@services/certifications.service';
import { TranslationService } from '@services/translation.service';
import { RefreshTokensService } from '@services/refresh-token.service';
import { UserInfoResponse } from '@responses/user-info.interface';
import { Titles } from '@interfaces/titles.enum';
import { GlobalMessageService } from '@shared/global-message.service';
import { MessagesTranslation } from '@translations/messages.enum';

@Component({
  selector: 'page-create-certification',
  templateUrl: './create-certification.component.html',
  styleUrl: './create-certification.component.scss'
})
export class CreateCertificationComponent implements OnInit {
  certName: string;
  certDescription: string;
  selectedFiles?: FileList;
  certPicture: string;
  certDocs: string;
  certDocsFileInfo: File | null;
  pdfSrc: string;
  certificationDocument: FormData | null;
  obtainingDate: string;
  expirationDate: string;
  obtainedSkill: string;
  obtainedSkills: Array<string> = [];
  authorId: string;

  userInfo: UserInfoResponse;

  constructor(
    private readonly router: Router,
    private readonly certificationsService: CertificationsService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  createCertification() {
    const obtainingDate = new Date(this.obtainingDate);
    const expirationDate = new Date(this.expirationDate);

    const payload = {
      certName: this.certName,
      certDescription: this.certDescription,
      certPicture: this.certPicture,
      certDocs: '',
      obtainedSkills: this.obtainedSkills,
      authorId: this.authorId,
      obtainingDate,
      expirationDate
    };

    this.certificationsService
      .certificationFileUpload(this.certificationDocument as FormData)
      .subscribe({
        next: async ({ message, certificationFileName }) => {
          const translationMessage =
            await this.translationService.translateText(
              message,
              MessagesTranslation.RESPONSES
            );

          this.globalMessageService.handle({ message: translationMessage });

          payload.certDocs = certificationFileName;

          this.certificationsService
            .createCertification({ ...payload })
            .subscribe({
              next: async ({ certificationId }) => {
                await this.handleRedirect(
                  `account/certificate/${certificationId}`
                );
              }
            });
        }
      });
  }

  async addObtainedSkills() {
    if (this.obtainedSkill === ' ') return;

    const isSkillPresent = this.obtainedSkills.includes(this.obtainedSkill);

    if (isSkillPresent) {
      const translationMessage = await this.translationService.translateText(
        'tag-is-already-on-the-list',
        MessagesTranslation.RESPONSES
      );

      await this.globalMessageService.handleWarning({
        message: translationMessage
      });
    } else {
      this.obtainedSkills.push(this.obtainedSkill);
    }

    this.obtainedSkill = '';
  }

  deleteObtainedSkill(obtainedSkill: string) {
    this.obtainedSkills.splice(this.obtainedSkills.indexOf(obtainedSkill), 1);
  }

  clearCertPicture() {
    this.certPicture = '';
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
      this.certPicture = reader.result as string;
    };
  }

  selectCertificationDocument(event: any) {
    const fileList: FileList = event.target.files;

    if (fileList.length < 0) return;

    const file: File = fileList[0];
    this.certDocs = file.name;
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

  disableCreateCertButton() {
    return (
      !this.certName ||
      !this.certDescription ||
      !this.certPicture ||
      !this.certDocs ||
      !this.certificationDocument ||
      this.obtainedSkills.length === 0 ||
      !this.obtainingDate ||
      !this.obtainingDate
    );
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

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.CREATE_CERTIFICATION);

    await this.fetchUserInfo();
  }
}
