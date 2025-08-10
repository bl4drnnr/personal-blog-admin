import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { MenuService } from '@shared/services/menu.service';
import { MenuTileData } from '@interfaces/menu/menu-tile-data.interface';

@Component({
  selector: 'page-menu-tiles',
  templateUrl: './menu-tiles.component.html',
  styleUrls: ['./menu-tiles.component.scss']
})
export class MenuTilesComponent extends BaseAdminComponent implements OnInit {
  tiles: MenuTileData[] = [];
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  editingTile: MenuTileData | null = null;

  // Form fields
  title = '';
  link = '';
  iconId: string = '';
  iconAlt = '';
  imageId: string = '';
  imageAlt = '';
  sortOrderStr = '0';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private menuService: MenuService
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
    return 'Personal Blog | Menu Tiles';
  }

  loadTiles(): void {
    this.menuService.getMenuTiles().subscribe({
      next: (tiles) => {
        this.tiles = tiles;
      },
      error: (error) => {
        console.error('Error loading menu tiles:', error);
      }
    });
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.editingTile = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(tile: MenuTileData): void {
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
    this.link = '';
    this.iconId = '';
    this.iconAlt = '';
    this.imageId = '';
    this.imageAlt = '';
    this.sortOrderStr = '0';
  }

  populateForm(tile: MenuTileData): void {
    this.title = tile.title;
    this.link = tile.link;
    this.iconId = tile.iconId;
    this.iconAlt = tile.iconAlt;
    this.imageId = tile.imageId;
    this.imageAlt = tile.imageAlt;
    this.sortOrderStr = (tile.sortOrder || 0).toString();
  }

  saveTile(): void {
    if (!this.title || !this.link || !this.iconId || !this.imageId) {
      alert('Title, link, icon, and image are required');
      return;
    }

    const payload: MenuTileData = {
      title: this.title,
      link: this.link,
      iconId: this.iconId,
      iconAlt: this.iconAlt,
      imageId: this.imageId,
      imageAlt: this.imageAlt,
      sortOrder: parseInt(this.sortOrderStr) || 0
    };

    if (this.modalMode === 'create') {
      this.menuService.createMenuTile(payload).subscribe({
        next: () => {
          this.loadTiles();
          this.closeModal();
          alert('Menu tile created successfully!');
        },
        error: (error) => {
          console.error('Error creating menu tile:', error);
          alert('Error creating menu tile. Please try again.');
        }
      });
    } else {
      this.menuService.updateMenuTile(this.editingTile!.id!, payload).subscribe({
        next: () => {
          this.loadTiles();
          this.closeModal();
          alert('Menu tile updated successfully!');
        },
        error: (error) => {
          console.error('Error updating menu tile:', error);
          alert('Error updating menu tile. Please try again.');
        }
      });
    }
  }

  deleteTile(tile: MenuTileData): void {
    if (confirm(`Are you sure you want to delete the menu tile "${tile.title}"?`)) {
      this.menuService.deleteMenuTile(tile.id!).subscribe({
        next: () => {
          this.loadTiles();
          alert('Menu tile deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting menu tile:', error);
          alert('Error deleting menu tile. Please try again.');
        }
      });
    }
  }
}
