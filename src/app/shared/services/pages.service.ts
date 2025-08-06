import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/api.service';
import { Method } from '@interfaces/methods.enum';
import { HomePageData } from '@interfaces/pages/home-page-data.interface';
import { UpdateHomePageData } from '@interfaces/pages/update-home-page-data.interface';
import { BlogPageData } from '@interfaces/pages/blog-page-data.interface';
import { UpdateBlogPageData } from '@interfaces/pages/update-blog-page-data.interface';
import { ProjectsPageData } from '@interfaces/pages/projects-page-data.interface';
import { UpdateProjectsPageData } from '@interfaces/pages/update-projects-page-data.interface';
import {
  ContactPageData,
  ContactTileData
} from '@interfaces/pages/contact-page-data.interface';
import { PagesEndpoint } from '@interfaces/pages.enum';
import { Controller } from '@interfaces/controller.enum';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  constructor(private readonly apiService: ApiService) {}

  getAdminHomePageData(): Observable<HomePageData> {
    return this.apiService.apiProxyRequest({
      controller: Controller.PAGES,
      action: PagesEndpoint.GET_ADMIN_HOME_PAGE_DATA,
      method: Method.GET
    });
  }

  updateHomePage(data: UpdateHomePageData): Observable<any> {
    return this.apiService.apiProxyRequest({
      controller: Controller.PAGES,
      action: PagesEndpoint.UPDATE_HOME_PAGE,
      method: Method.PUT,
      payload: data
    });
  }

  getAdminBlogPageData(): Observable<BlogPageData> {
    return this.apiService.apiProxyRequest({
      controller: Controller.PAGES,
      action: PagesEndpoint.GET_ADMIN_BLOG_PAGE_DATA,
      method: Method.GET
    });
  }

  updateBlogPage(data: UpdateBlogPageData): Observable<any> {
    return this.apiService.apiProxyRequest({
      controller: Controller.PAGES,
      action: PagesEndpoint.UPDATE_BLOG_PAGE,
      method: Method.PUT,
      payload: data
    });
  }

  getAdminProjectsPageData(): Observable<ProjectsPageData> {
    return this.apiService.apiProxyRequest({
      controller: Controller.PAGES,
      action: PagesEndpoint.GET_ADMIN_PROJECTS_PAGE_DATA,
      method: Method.GET
    });
  }

  updateProjectsPage(data: UpdateProjectsPageData): Observable<any> {
    return this.apiService.apiProxyRequest({
      controller: Controller.PAGES,
      action: PagesEndpoint.UPDATE_PROJECTS_PAGE,
      method: Method.PUT,
      payload: data
    });
  }

  getAdminContactPageData(): Observable<ContactPageData> {
    return this.apiService.apiProxyRequest({
      controller: Controller.CONTACT,
      action: PagesEndpoint.GET_ADMIN_CONTACT_PAGE_DATA,
      method: Method.GET
    });
  }

  updateContactPage(data: any): Observable<any> {
    return this.apiService.apiProxyRequest({
      controller: Controller.CONTACT,
      action: PagesEndpoint.UPDATE_CONTACT_PAGE,
      method: Method.PUT,
      payload: data
    });
  }

  // Contact Tiles Management
  createContactTile(data: Partial<ContactTileData>): Observable<ContactTileData> {
    return this.apiService.apiProxyRequest({
      controller: Controller.CONTACT,
      action: PagesEndpoint.CREATE_TILES,
      method: Method.POST,
      payload: data
    });
  }

  updateContactTile(payload: Partial<ContactTileData>): Observable<ContactTileData> {
    return this.apiService.apiProxyRequest({
      controller: Controller.CONTACT,
      action: PagesEndpoint.UPDATE_TILES,
      method: Method.PUT,
      payload
    });
  }

  deleteContactTile(tileId: string): Observable<void> {
    return this.apiService.apiProxyRequest({
      controller: Controller.CONTACT,
      action: PagesEndpoint.DELETE_TILES,
      method: Method.DELETE,
      params: { tileId }
    });
  }

  reorderContactTiles(tileIds: string[]): Observable<ContactTileData[]> {
    return this.apiService.apiProxyRequest({
      controller: Controller.CONTACT,
      action: PagesEndpoint.REORDER_TILES,
      method: Method.PUT,
      payload: { tileIds }
    });
  }
}
