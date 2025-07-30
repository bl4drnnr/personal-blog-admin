import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { StaticAssetsService } from '@services/static-assets.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { StaticAsset } from '@payloads/static-asset.interface';
import { UploadFilePayload } from '@payloads/upload-file.interface';
import { UploadBase64Payload } from '@payloads/upload-base64.interface';

@Component({
  selector: 'page-static-assets',
  templateUrl: './static-assets.component.html',
  styleUrls: ['./static-assets.component.scss']
})
export class StaticAssetsComponent extends BaseAdminComponent implements OnInit {
  assets: StaticAsset[] = [];
  isLoading = false;
  isUploading = false;
  showUploadForm = false;

  // Upload form properties
  selectedFile: File | null = null;
  assetName = '';
  assetDescription = '';
  previewUrl: string | null = null;
  uploadMode: 'file' | 'base64' = 'file';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private staticAssetsService: StaticAssetsService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadAssets();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Static Assets';
  }

  loadAssets(): void {
    this.isLoading = true;
    this.staticAssetsService.getStaticAssets().subscribe({
      next: (assets) => {
        this.assets = assets;
        this.isLoading = false;
      },
      error: () => {
        this.globalMessageService.handle({
          message: 'Failed to load assets',
          isError: true
        });
        this.isLoading = false;
      }
    });
  }

  toggleUploadForm(): void {
    this.showUploadForm = !this.showUploadForm;
    if (!this.showUploadForm) {
      this.resetForm();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Generate preview for images
      if (this.selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrl = e.target?.result as string;
        };
        reader.readAsDataURL(this.selectedFile);
      }

      // Auto-fill name field with filename (without extension)
      if (!this.assetName) {
        const fileName = this.selectedFile.name;
        this.assetName =
          fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      }
    }
  }

  uploadAsset(): void {
    if (!this.selectedFile || !this.assetName.trim()) {
      this.globalMessageService.handle({
        message: 'Please select a file and provide a name',
        isError: true
      });
      return;
    }

    this.isUploading = true;

    // Convert file to base64
    this.convertFileToBase64(this.selectedFile)
      .then((base64File) => {
        const payload: UploadFilePayload = {
          name: this.assetName.trim(),
          base64File,
          description: this.assetDescription.trim() || undefined
        };

        // Use the updated uploadFile method that sends base64 in JSON body
        this.staticAssetsService.uploadFile(payload).subscribe({
          next: () => {
            this.globalMessageService.handle({
              message: `Asset "${payload.name}" uploaded successfully to S3`,
              isError: false
            });
            this.resetForm();
            this.showUploadForm = false;
            this.loadAssets();
            this.isUploading = false;
          },
          error: (error) => {
            console.error('Upload error:', error);
            const errorMessage =
              error?.error?.message || 'Failed to upload asset to S3';
            this.globalMessageService.handle({
              message: errorMessage,
              isError: true
            });
            this.isUploading = false;
          }
        });
      })
      .catch((error) => {
        console.error('File conversion error:', error);
        this.globalMessageService.handle({
          message: 'Failed to process file',
          isError: true
        });
        this.isUploading = false;
      });
  }

  deleteAsset(asset: StaticAsset): void {
    if (confirm(`Are you sure you want to delete "${asset.name}"?`)) {
      this.staticAssetsService.deleteStaticAsset(asset.id).subscribe({
        next: () => {
          this.globalMessageService.handle({
            message: 'Asset deleted successfully',
            isError: false
          });
          this.loadAssets();
        },
        error: () => {
          this.globalMessageService.handle({
            message: 'Failed to delete asset',
            isError: true
          });
        }
      });
    }
  }

  copyUrl(url: string): void {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        this.globalMessageService.handle({
          message: 'URL copied to clipboard',
          isError: false
        });
      })
      .catch(() => {
        this.globalMessageService.handle({
          message: 'Failed to copy URL',
          isError: true
        });
      });
  }

  uploadBase64Image(): void {
    if (!this.previewUrl || !this.assetName.trim()) {
      this.globalMessageService.handle({
        message: 'Please select an image and provide a name',
        isError: true
      });
      return;
    }

    this.isUploading = true;

    const payload: UploadBase64Payload = {
      name: this.assetName.trim(),
      base64Image: this.previewUrl,
      description: this.assetDescription.trim() || undefined
    };

    this.staticAssetsService.uploadBase64Image(payload).subscribe({
      next: () => {
        this.globalMessageService.handle({
          message: `Image "${payload.name}" uploaded successfully to S3`,
          isError: false
        });
        this.resetForm();
        this.showUploadForm = false;
        this.loadAssets();
        this.isUploading = false;
      },
      error: (error) => {
        console.error('Base64 upload error:', error);
        const errorMessage = error?.error?.message || 'Failed to upload image to S3';
        this.globalMessageService.handle({
          message: errorMessage,
          isError: true
        });
        this.isUploading = false;
      }
    });
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  private resetForm(): void {
    this.selectedFile = null;
    this.assetName = '';
    this.assetDescription = '';
    this.previewUrl = null;
    this.uploadMode = 'file';
  }
}
