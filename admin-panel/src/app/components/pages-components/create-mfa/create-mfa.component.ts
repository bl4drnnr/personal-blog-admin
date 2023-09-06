import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { MfaService } from '@services/mfa.service';

@Component({
  selector: 'page-component-mfa',
  templateUrl: './create-mfa.component.html',
  styleUrls: [
    './create-mfa.component.scss',
    '../../../pages/credentials/shared/credentials.component.scss'
  ]
})
export class CreateMfaComponent {
  @Input() hash: string;
  @Input() email: string;
  @Input() password: string;
  @Output() confirmUserMfa = new EventEmitter<void>();

  qrCode: string;
  code: string;
  twoFaToken: string;
  showQr = true;

  selectedMfaOption: DropdownInterface;
  mfaOptions: Array<DropdownInterface> = [
    { key: 'mfa', value: 'Authentication application' }
  ];

  constructor(private readonly mfaService: MfaService) {}

  async changeMfaOption() {
    this.selectedMfaOption = this.mfaOptions[0];
    await this.generateTwoFaQrCode();
  }

  async setUserMfa() {
    if (!this.isAllFieldsCorrect()) return;
    await this.verifyTwoFaQrCode();
  }

  isAllFieldsCorrect() {
    return this.qrCode && this.code && this.code.length === 6;
  }

  private async verifyTwoFaQrCode() {
    if (this.hash) {
      this.mfaService
        .registrationVerifyTwoFaQrCode({
          hash: this.hash,
          code: this.code,
          twoFaToken: this.twoFaToken
        })
        .subscribe({
          next: () => this.confirmUserMfa.emit()
        });
    } else if (this.email && this.password) {
      this.mfaService
        .loginVerifyTwoFaQrCode({
          email: this.email,
          password: this.password,
          code: this.code,
          twoFaToken: this.twoFaToken
        })
        .subscribe({
          next: () => this.confirmUserMfa.emit()
        });
    }
  }

  private async generateTwoFaQrCode() {
    this.qrCode = '';
    this.twoFaToken = '';

    if (this.hash) {
      this.mfaService
        .registrationGenerateTwoFaQrCode({ hash: this.hash })
        .subscribe({
          next: ({ qr, secret }) => {
            this.qrCode = qr;
            this.twoFaToken = secret;
          }
        });
    } else if (this.email && this.password) {
      this.mfaService
        .loginGenerateTwoFaQrCode({
          email: this.email,
          password: this.password
        })
        .subscribe({
          next: ({ qr, secret }) => {
            this.qrCode = qr;
            this.twoFaToken = secret;
          }
        });
    }
  }
}
