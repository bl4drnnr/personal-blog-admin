import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { LicenseService } from '@services/license.service';
import { LicenseTileData } from '@interfaces/license/license-tile-data.interface';

@Component({
  selector: 'page-license-tiles',
  templateUrl: './license-tiles.component.html',
  styleUrls: ['./license-tiles.component.scss']
})
export class LicenseTilesComponent extends BaseAdminComponent implements OnInit {
  tiles: LicenseTileData[] = [];
  isLoading = true;
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  editingTile: LicenseTileData | null = null;

  // Form fields
  title = '';
  description = '';
  links: Array<{ label: string; url: string }> = [];
  linkLabel = '';
  linkUrl = '';
  sortOrderStr = '0';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private licenseService: LicenseService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadTiles();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | License Tiles';
  }

  loadTiles(): void {
    this.licenseService.getLicenseTiles().subscribe({
      next: (tiles) => {
        this.tiles = tiles;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading license tiles:', error);
        this.isLoading = false;
      }
    });
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.editingTile = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(tile: LicenseTileData): void {
    this.modalMode = 'edit';
    this.editingTile = tile;
    this.populateForm(tile);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
    this.editingTile = null;
  }

  resetForm(): void {
    this.title = '';
    this.description = '';
    this.links = [];
    this.linkLabel = '';
    this.linkUrl = '';
    this.sortOrderStr = '0';
  }

  populateForm(tile: LicenseTileData): void {
    this.title = tile.title;
    this.description = tile.description;
    this.links = [...tile.links];
    this.sortOrderStr = (tile.sortOrder || 0).toString();
  }

  // Link management
  addLink(): void {
    const label = this.linkLabel.trim();
    const url = this.linkUrl.trim();

    if (label && url) {
      this.links.push({ label, url });
      this.linkLabel = '';
      this.linkUrl = '';
    }
  }

  removeLink(index: number): void {
    this.links.splice(index, 1);
  }

  saveTile(): void {
    if (!this.title || !this.description) {
      alert('Title and description are required');
      return;
    }

    const payload: LicenseTileData = {
      title: this.title,
      description: this.description,
      links: this.links,
      sortOrder: parseInt(this.sortOrderStr) || 0
    };

    if (this.modalMode === 'create') {
      this.licenseService.createLicenseTile(payload).subscribe({
        next: () => {
          this.loadTiles();
          this.closeModal();
          alert('License tile created successfully!');
        },
        error: (error) => {
          console.error('Error creating license tile:', error);
          alert('Error creating license tile. Please try again.');
        }
      });
    } else {
      this.licenseService
        .updateLicenseTile(this.editingTile!.id!, payload)
        .subscribe({
          next: () => {
            this.loadTiles();
            this.closeModal();
            alert('License tile updated successfully!');
          },
          error: (error) => {
            console.error('Error updating license tile:', error);
            alert('Error updating license tile. Please try again.');
          }
        });
    }
  }

  deleteTile(tile: LicenseTileData): void {
    if (
      confirm(`Are you sure you want to delete the license tile "${tile.title}"?`)
    ) {
      this.licenseService.deleteLicenseTile(tile.id!).subscribe({
        next: () => {
          this.loadTiles();
          alert('License tile deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting license tile:', error);
          alert('Error deleting license tile. Please try again.');
        }
      });
    }
  }
}
