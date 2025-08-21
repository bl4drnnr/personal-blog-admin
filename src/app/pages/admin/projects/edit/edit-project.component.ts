import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { ProjectsService } from '@services/projects.service';
import { GlobalMessageService } from '@shared/global-components-services/global-message.service';
import { ListProjectInterface } from '@interfaces/api/list-project.interface';

@Component({
  selector: 'page-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['../../../../shared/styles/admin-edit-page.scss']
})
export class EditProjectComponent extends BaseAdminComponent implements OnInit {
  projectSlug: string = '';
  project: ListProjectInterface = {
    id: '',
    projectSlug: '',
    projectName: '',
    projectDescription: '',
    content: '',
    projectImage: '',
    projectTags: [],
    metaKeywords: '',
    projectPosted: false,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Form fields
  projectName: string = '';
  description: string = '';
  content: string = '';
  processedContent: string = '';
  projectImageId: string = '';
  tags: string[] = [];
  tagInput: string = '';
  metaKeywords: string = '';
  published: boolean = false;
  featured: boolean = false;

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private route: ActivatedRoute,
    private titleService: Title,
    private projectsService: ProjectsService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.projectSlug = this.route.snapshot.paramMap.get('slug')!;
  }

  protected override async onUserInfoLoaded(): Promise<void> {
    this.titleService.setTitle(this.getPageTitle());
    await this.loadProject();
  }

  private getPageTitle(): string {
    return 'Personal Blog | Edit Project';
  }

  async loadProject(): Promise<void> {
    if (!this.projectSlug) {
      await this.router.navigate(['/admin/projects']);
      return;
    }

    this.projectsService.getProjectBySlug(this.projectSlug).subscribe({
      next: (response) => {
        this.project = {
          id: response.id,
          projectSlug: response.slug,
          projectName: response.title,
          projectDescription: response.description,
          content: response.content,
          projectImage: response.featuredImageId,
          projectTags: response.tags || [],
          metaKeywords: response.metaKeywords,
          projectPosted: response.published,
          featured: response.featured,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt
        };
        this.projectName = response.title;
        this.description = response.description;
        this.content = response.content;
        this.processedContent = response.content; // Initialize with same content
        this.projectImageId = response.featuredImageId;
        this.tags = response.tags || [];
        this.metaKeywords = response.metaKeywords;
        this.published = response.published;
        this.featured = response.featured;
      },
      error: async (error) => {
        console.error('Error loading project:', error);
        this.globalMessageService.handle({
          message: 'Error loading project',
          isError: true
        });
        await this.router.navigate(['/admin/projects']);
      }
    });
  }

  addTag(): void {
    if (this.tagInput.trim() && !this.tags.includes(this.tagInput.trim())) {
      this.tags.push(this.tagInput.trim());
      this.tagInput = '';
    }
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
  }

  onTagInputKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  saveProject(): void {
    if (!this.projectName.trim() || !this.content.trim()) {
      this.globalMessageService.handle({
        message: 'Project name and content are required',
        isError: true
      });
      return;
    }

    // Use processed content (with tables converted to HTML) for saving
    const contentToSave = this.processedContent || this.content;

    const projectData = {
      projectId: this.project.id,
      projectTitle: this.projectName,
      projectDescription: this.description,
      projectContent: contentToSave,
      projectFeaturedImageId: this.projectImageId,
      projectTags: this.tags,
      projectMetaKeywords: this.metaKeywords
    };

    this.projectsService.updateProject(projectData).subscribe({
      next: () => {
        this.globalMessageService.handle({
          message: 'Project saved successfully'
        });
      },
      error: (error) => {
        console.error('Error saving project:', error);
        this.globalMessageService.handle({
          message: 'Error saving project',
          isError: true
        });
      }
    });
  }

  async cancel(): Promise<void> {
    await this.router.navigate(['/admin/projects']);
  }

  changePublishStatus(): void {
    if (!this.project.id) {
      this.globalMessageService.handle({
        message: 'Project not loaded',
        isError: true
      });
      return;
    }

    this.projectsService.changePublishStatus(this.project.id).subscribe({
      next: (response) => {
        this.published = response.published;
        this.globalMessageService.handle({
          message: `Project ${this.published ? 'published' : 'unpublished'} successfully`
        });
      },
      error: (error) => {
        console.error('Error changing publish status:', error);
        this.globalMessageService.handle({
          message: 'Error changing publish status',
          isError: true
        });
      }
    });
  }

  toggleFeatured(): void {
    if (!this.project.id) {
      this.globalMessageService.handle({
        message: 'Project not loaded',
        isError: true
      });
      return;
    }

    this.projectsService.changeFeaturedStatus(this.project.id).subscribe({
      next: (response) => {
        this.featured = response.featured;
        this.globalMessageService.handle({
          message: `Project ${this.featured ? 'featured' : 'unfeatured'} successfully`
        });
      },
      error: (error) => {
        console.error('Error changing featured status:', error);
        this.globalMessageService.handle({
          message: 'Error changing featured status',
          isError: true
        });
      }
    });
  }

  deleteProject(): void {
    if (
      this.project &&
      confirm(`Are you sure you want to delete "${this.project.projectName}"?`)
    ) {
      this.projectsService.deleteProject(this.project.id).subscribe({
        next: async () => {
          this.globalMessageService.handle({
            message: 'Project deleted successfully'
          });
          await this.router.navigate(['/admin/projects']);
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          this.globalMessageService.handle({
            message: 'Error deleting project',
            isError: true
          });
        }
      });
    }
  }
}
