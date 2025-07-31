import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { AboutService } from '@services/about.service';
import { CertificateData } from '@interfaces/about/certificate-data.interface';

@Component({
  selector: 'page-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent extends BaseAdminComponent implements OnInit {
  certificates: CertificateData[] = [];
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  editingCertificate: CertificateData | null = null;

  // Form data
  title = '';
  issuer = '';
  issuedDate = '';
  expiryDate = '';
  credentialId = '';
  credentialUrl = '';
  description = '';
  orderStr = '0';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private aboutService: AboutService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadCertificates();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Certificates Management';
  }

  loadCertificates(): void {
    this.aboutService.getCertificates().subscribe({
      next: (certificates) => {
        this.certificates = certificates;
      },
      error: (error) => {
        console.error('Error loading certificates:', error);
      }
    });
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.editingCertificate = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(certificate: CertificateData): void {
    this.modalMode = 'edit';
    this.editingCertificate = certificate;
    this.populateForm(certificate);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.title = '';
    this.issuer = '';
    this.issuedDate = '';
    this.expiryDate = '';
    this.credentialId = '';
    this.credentialUrl = '';
    this.description = '';
    this.orderStr = '0';
  }

  populateForm(certificate: CertificateData): void {
    this.title = certificate.title || '';
    this.issuer = certificate.issuer || '';
    this.issuedDate = certificate.issuedDate
      ? certificate.issuedDate.split('T')[0]
      : '';
    this.expiryDate = certificate.expiryDate
      ? certificate.expiryDate.split('T')[0]
      : '';
    this.credentialId = certificate.credentialId || '';
    this.credentialUrl = certificate.credentialUrl || '';
    this.description = certificate.description || '';
    this.orderStr = (certificate.order || 0).toString();
  }

  saveCertificate(): void {
    if (!this.title || !this.issuer) {
      alert('Title and Issuer are required');
      return;
    }

    const payload: CertificateData = {
      title: this.title,
      issuer: this.issuer,
      issuedDate: this.issuedDate || undefined,
      expiryDate: this.expiryDate || undefined,
      credentialId: this.credentialId || undefined,
      credentialUrl: this.credentialUrl || undefined,
      description: this.description || undefined,
      order: parseInt(this.orderStr) || 0
    };

    const operation =
      this.modalMode === 'create'
        ? this.aboutService.createCertificate(payload)
        : this.aboutService.updateCertificate(this.editingCertificate!.id!, payload);

    operation.subscribe({
      next: () => {
        this.loadCertificates();
        this.closeModal();
        alert(
          `Certificate ${this.modalMode === 'create' ? 'created' : 'updated'} successfully!`
        );
      },
      error: (error) => {
        console.error('Error saving certificate:', error);
        alert('Error saving certificate. Please try again.');
      }
    });
  }

  deleteCertificate(certificate: CertificateData): void {
    if (confirm(`Are you sure you want to delete "${certificate.title}"?`)) {
      this.aboutService.deleteCertificate(certificate.id!).subscribe({
        next: () => {
          this.loadCertificates();
          alert('Certificate deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting certificate:', error);
          alert('Error deleting certificate. Please try again.');
        }
      });
    }
  }
}
