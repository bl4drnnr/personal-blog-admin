import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { GlobalMessageService } from '@shared/global-components-services/global-message.service';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { ProjectsService } from '@services/projects.service';
import { ListProjectInterface } from '@interfaces/list-project.interface';

// Using the interface from API types
type Project = ListProjectInterface;

@Component({
  selector: 'page-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent extends BaseAdminComponent {
  projects: Project[] = [];
  totalProjects: number = 0;

  // Pagination
  currentPage: string = '0';
  itemsPerPage: string = '10';

  // Search and filters
  searchQuery: string = '';
  selectedStatus: string = '';

  // Sorting
  sortBy: string = 'createdAt';
  sortOrder: string = 'desc';

  // Dropdown options
  sortOptions: DropdownInterface[] = [
    { key: 'createdAt', value: 'Created Date' },
    { key: 'updatedAt', value: 'Updated Date' },
    { key: 'projectName', value: 'Title' }
  ];

  orderOptions: DropdownInterface[] = [
    { key: 'desc', value: 'Descending' },
    { key: 'asc', value: 'Ascending' }
  ];

  statusOptions: DropdownInterface[] = [
    { key: '', value: 'All Projects' },
    { key: 'true', value: 'Published' },
    { key: 'false', value: 'Draft' }
  ];

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private globalMessageService: GlobalMessageService,
    private projectsService: ProjectsService
  ) {
    super(router, refreshTokensService);
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
    this.loadProjects();
  }

  private getPageTitle(): string {
    return 'Personal Blog | Projects';
  }

  loadProjects(): void {
    const payload = {
      ...(this.searchQuery && { query: this.searchQuery }),
      page: this.currentPage,
      pageSize: this.itemsPerPage,
      order: this.sortOrder.toUpperCase() as 'ASC' | 'DESC',
      orderBy: this.sortBy,
      published: this.selectedStatus
    };

    this.projectsService.listProjects(payload).subscribe({
      next: (response) => {
        this.projects = response.rows;
        this.totalProjects = response.count;
      },
      error: (error) => {
        this.globalMessageService.handleError('Failed to load projects');
        console.error('Error loading projects:', error);
      }
    });
  }

  // Pagination handlers
  setCurrentPage(page: string): void {
    this.currentPage = page;
    this.loadProjects();
  }

  setItemsPerPage(itemsPerPage: string): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = '0';
    this.loadProjects();
  }

  // Search handler
  onSearchChange(): void {
    this.currentPage = '0';
    this.loadProjects();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearchChange();
  }

  // Filter handlers
  onStatusChange(option: DropdownInterface): void {
    this.selectedStatus = option.key;
    this.currentPage = '0';
    this.loadProjects();
  }

  // Sort handlers
  onSortByChange(option: DropdownInterface): void {
    this.sortBy = option.key;
    this.currentPage = '0';
    this.loadProjects();
  }

  onSortOrderChange(option: DropdownInterface): void {
    this.sortOrder = option.key;
    this.currentPage = '0';
    this.loadProjects();
  }

  // Project actions
  async editProject(project: Project): Promise<void> {
    await this.router.navigate(['/admin/projects/edit', project.projectSlug]);
  }

  async createNewProject(): Promise<void> {
    await this.router.navigate(['/admin/projects/create']);
  }

  toggleActiveStatus(project: Project): void {
    this.projectsService.changePublishStatus(project.id).subscribe({
      next: () => {
        this.globalMessageService.handle({
          message: 'Project status changed successfully'
        });
        this.loadProjects();
      },
      error: (error) => {
        this.globalMessageService.handleError('Failed to change project status');
        console.error('Error changing project status:', error);
      }
    });
  }

  deleteProject(project: Project): void {
    if (confirm(`Are you sure you want to delete "${project.projectName}"?`)) {
      this.projectsService.deleteProject(project.id).subscribe({
        next: () => {
          this.globalMessageService.handle({
            message: 'Project deleted successfully'
          });
          this.loadProjects();
        },
        error: (error) => {
          this.globalMessageService.handleError('Failed to delete project');
          console.error('Error deleting project:', error);
        }
      });
    }
  }

  getSelectedSortOption(): DropdownInterface {
    return (
      this.sortOptions.find((option) => option.key === this.sortBy) ||
      this.sortOptions[0]
    );
  }

  getSelectedOrderOption(): DropdownInterface {
    return (
      this.orderOptions.find((option) => option.key === this.sortOrder) ||
      this.orderOptions[0]
    );
  }

  getSelectedStatusOption(): DropdownInterface {
    return (
      this.statusOptions.find((option) => option.key === this.selectedStatus) ||
      this.statusOptions[0]
    );
  }
}
