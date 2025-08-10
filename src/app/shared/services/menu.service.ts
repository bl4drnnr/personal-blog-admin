import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Method } from '@interfaces/methods.enum';
import { Controller } from '@interfaces/controller.enum';
import { MenuPageData } from '@interfaces/menu/menu-page-data.interface';
import { MenuTileData } from '@interfaces/menu/menu-tile-data.interface';
import { MenuEndpoint } from '@interfaces/menu.enum';
import { MenuPageCreatedResponse } from '@responses/menu-page-created.interface';
import { MenuPageUpdatedResponse } from '@responses/menu-page-updated.interface';
import { MenuTileCreatedResponse } from '@responses/menu-tile-created.interface';
import { MenuTileUpdatedResponse } from '@responses/menu-tile-updated.interface';
import { MenuTileDeletedResponse } from '@responses/menu-tile-deleted.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private readonly apiService: ApiService) {}

  // Menu Page Methods
  getMenuPageSettings(): Observable<MenuPageData> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.MENU,
      action: MenuEndpoint.GET_MENU_PAGE
    });
  }

  createMenuPage(payload: MenuPageData): Observable<MenuPageCreatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.MENU,
      action: MenuEndpoint.CREATE_MENU_PAGE,
      payload
    });
  }

  updateMenuPage(
    id: string,
    payload: MenuPageData
  ): Observable<MenuPageUpdatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.MENU,
      action: MenuEndpoint.UPDATE_MENU_PAGE,
      params: { id },
      payload
    });
  }

  // Menu Tile Methods
  getMenuTiles(): Observable<MenuTileData[]> {
    return this.apiService.apiProxyRequest({
      method: Method.GET,
      controller: Controller.MENU,
      action: MenuEndpoint.GET_MENU_TILES
    });
  }

  createMenuTile(payload: MenuTileData): Observable<MenuTileCreatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.POST,
      controller: Controller.MENU,
      action: MenuEndpoint.CREATE_MENU_TILE,
      payload
    });
  }

  updateMenuTile(
    id: string,
    payload: MenuTileData
  ): Observable<MenuTileUpdatedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.PUT,
      controller: Controller.MENU,
      action: MenuEndpoint.UPDATE_MENU_TILE,
      params: { id },
      payload
    });
  }

  deleteMenuTile(id: string): Observable<MenuTileDeletedResponse> {
    return this.apiService.apiProxyRequest({
      method: Method.DELETE,
      controller: Controller.MENU,
      action: MenuEndpoint.DELETE_MENU_TILE,
      params: { id }
    });
  }
}
