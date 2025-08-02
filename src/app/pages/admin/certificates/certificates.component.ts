import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { AboutService } from '@services/about.service';
import { CertificateData } from '@interfaces/about/certificate-data.interface';
import { StaticAssetsService } from '@services/static-assets.service';
import { StaticAsset } from '@payloads/static-asset.interface';

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
  name = '';
  issuedDate = '';
  expirationDate = '';
  description = '';
  orderStr = '0';
  logoAssetId = '';
  logoPreview = '';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private aboutService: AboutService,
    private staticAssetsService: StaticAssetsService
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
    this.name = '';
    this.issuedDate = '';
    this.expirationDate = '';
    this.description = '';
    this.orderStr = '0';
    this.logoAssetId = '';
    this.logoPreview = '';
  }

  populateForm(certificate: CertificateData): void {
    this.name = certificate.name || '';
    this.issuedDate = certificate.issuedDate
      ? certificate.issuedDate.split('T')[0]
      : '';
    this.expirationDate = certificate.expirationDate
      ? certificate.expirationDate.split('T')[0]
      : '';
    this.description = certificate.description || '';
    this.orderStr = (certificate.order || 0).toString();
    this.logoAssetId = certificate.logoId || '';
    this.logoPreview = certificate.logo || ''; // Use the resolved S3 URL
  }

  saveCertificate(): void {
    if (!this.name || !this.issuedDate) {
      alert('Certificate name and issued date are required');
      return;
    }

    const payload: CertificateData = {
      name: this.name,
      issuedDate: this.issuedDate,
      expirationDate: this.expirationDate || undefined,
      logoId: this.logoAssetId || undefined,
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

  onLogoAssetSelected(asset: StaticAsset | null): void {
    if (asset) {
      this.logoAssetId = asset.id;
      // Fetch the S3 URL for preview
      this.staticAssetsService.findById(asset.id).subscribe({
        next: (assetData) => {
          this.logoPreview = assetData.s3Url;
        },
        error: (error) => {
          console.error('Error loading asset preview:', error);
          this.logoPreview = '';
        }
      });
    } else {
      this.logoAssetId = '';
      this.logoPreview = '';
    }
  }

  deleteCertificate(certificate: CertificateData): void {
    if (confirm(`Are you sure you want to delete "${certificate.name}"?`)) {
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
