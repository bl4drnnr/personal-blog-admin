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
import { UpdateAssetPayload } from '@payloads/update-asset.interface';
import { SearchAssetsQuery } from '@payloads/search-assets.interface';

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

  // Pagination properties
  currentPage = 0;
  pageSize = 12;
  totalAssets = 0;
  totalPages = 0;

  // Search and sort properties
  searchQuery = '';
  sortBy = 'createdAt';
  sortOrder: 'ASC' | 'DESC' = 'DESC';

  // Upload form properties
  selectedFile: File | null = null;
  assetName = '';
  assetDescription = '';
  assetType: 'icon' | 'projectPicture' | 'articlePicture' | 'staticAsset' = 'staticAsset';
  previewUrl: string | null = null;
  uploadMode: 'file' | 'base64' = 'file';

  // Edit form properties
  showEditForm = false;
  editingAsset: StaticAsset | null = null;
  editAssetName = '';
  editAssetDescription = '';
  editAssetType: 'icon' | 'projectPicture' | 'articlePicture' | 'staticAsset' =
    'staticAsset';
  isUpdating = false;

  // Asset type options for dropdown
  assetTypeOptions = [
    { value: 'icon', label: 'Icon' },
    { value: 'projectPicture', label: 'Project Picture' },
    { value: 'articlePicture', label: 'Article Picture' },
    { value: 'staticAsset', label: 'Static Asset' }
  ];

  // Math object for template
  Math = Math;

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

    const query: SearchAssetsQuery = {
      search: this.searchQuery,
      page: this.currentPage,
      pageSize: this.pageSize,
      orderBy: this.sortBy,
      order: this.sortOrder
    };

    this.staticAssetsService.getStaticAssets(query).subscribe({
      next: (response) => {
        this.assets = response.assets;
        this.totalAssets = response.total;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
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
          description: this.assetDescription.trim() || undefined,
          assetType: this.assetType
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
      description: this.assetDescription.trim() || undefined,
      assetType: this.assetType
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

  performSearch(): void {
    this.currentPage = 0; // Reset to first page when searching
    this.loadAssets();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadAssets();
  }

  onSortChange(): void {
    this.currentPage = 0; // Reset to first page when sorting changes
    this.loadAssets();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadAssets();
    }
  }

  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(0, this.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(this.totalPages - 1, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }

  getFileIcon(url: string): string {
    if (url.includes('.svg')) {
      return '🎨';
    } else if (url.includes('.csv')) {
      return '📊';
    } else if (url.includes('.pdf')) {
      return '📄';
    } else if (url.includes('.doc') || url.includes('.docx')) {
      return '📝';
    } else if (
      url.includes('.mp4') ||
      url.includes('.avi') ||
      url.includes('.mov')
    ) {
      return '🎥';
    }
    return '📄';
  }

  getAssetTypeLabel(assetType: string): string {
    switch (assetType) {
      case 'icon':
        return 'Icon';
      case 'projectPicture':
        return 'Project Picture';
      case 'articlePicture':
        return 'Article Picture';
      case 'staticAsset':
        return 'Static Asset';
      default:
        return 'Unknown';
    }
  }

  getAssetTypeClass(assetType: string): string {
    switch (assetType) {
      case 'icon':
        return 'asset-type-icon';
      case 'projectPicture':
        return 'asset-type-project';
      case 'articlePicture':
        return 'asset-type-article';
      case 'staticAsset':
        return 'asset-type-static';
      default:
        return 'asset-type-unknown';
    }
  }

  editAsset(asset: StaticAsset): void {
    this.editingAsset = asset;
    this.editAssetName = asset.name;
    this.editAssetDescription = asset.description || '';
    this.editAssetType = asset.assetType;
    this.showEditForm = true;
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.resetEditForm();
  }

  updateAsset(): void {
    if (!this.editingAsset || !this.editAssetName.trim()) {
      this.globalMessageService.handle({
        message: 'Please provide a valid asset name',
        isError: true
      });
      return;
    }

    this.isUpdating = true;

    const payload: UpdateAssetPayload = {
      id: this.editingAsset.id,
      name: this.editAssetName.trim(),
      description: this.editAssetDescription.trim() || undefined,
      assetType: this.editAssetType
    };

    this.staticAssetsService.updateAsset(payload).subscribe({
      next: () => {
        this.globalMessageService.handle({
          message: `Asset "${payload.name}" updated successfully`,
          isError: false
        });
        this.showEditForm = false;
        this.resetEditForm();
        this.loadAssets();
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Update error:', error);
        const errorMessage = error?.error?.message || 'Failed to update asset';
        this.globalMessageService.handle({
          message: errorMessage,
          isError: true
        });
        this.isUpdating = false;
      }
    });
  }

  private resetForm(): void {
    this.selectedFile = null;
    this.assetName = '';
    this.assetDescription = '';
    this.assetType = 'staticAsset';
    this.previewUrl = null;
    this.uploadMode = 'file';
  }

  private resetEditForm(): void {
    this.editingAsset = null;
    this.editAssetName = '';
    this.editAssetDescription = '';
    this.editAssetType = 'staticAsset';
  }
}
