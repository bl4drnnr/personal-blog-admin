import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { ProjectsService } from '@services/projects.service';
import { GlobalMessageService } from '@shared/global-components-services/global-message.service';
import { CreateProjectPayload } from '@payloads/create-project.interface';

@Component({
  selector: 'page-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['../../../../shared/styles/admin-edit-page.scss']
})
export class CreateProjectComponent extends BaseAdminComponent implements OnInit {
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
    private titleService: Title,
    private projectsService: ProjectsService,
    private globalMessageService: GlobalMessageService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
  }

  protected override async onUserInfoLoaded(): Promise<void> {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Create New Project';
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

  areFieldsCorrect(): boolean {
    if (
      !this.projectName.trim() ||
      !this.content.trim() ||
      !this.description.trim() ||
      !this.projectImageId.trim()
    ) {
      this.globalMessageService.handle({
        message:
          'Project name, content, description, and featured image are all required',
        isError: true
      });
      return false;
    } else {
      return true;
    }
  }

  createProject(): void {
    if (!this.areFieldsCorrect()) return;

    // Use processed content (with tables converted to HTML) for saving
    const contentToSave = this.processedContent || this.content;

    const payload: CreateProjectPayload = {
      projectTitle: this.projectName,
      projectDescription: this.description,
      projectContent: contentToSave,
      projectTags: this.tags,
      projectMetaKeywords: this.metaKeywords,
      projectFeaturedImageId: this.projectImageId,
      projectPublished: false
    };

    this.projectsService.createProject(payload).subscribe({
      next: async (createdProject) => {
        this.globalMessageService.handle({
          message: 'Project created successfully'
        });
        // Navigate to edit page for the newly created project
        await this.router.navigate(['/admin/projects/edit', createdProject.slug]);
      },
      error: (error) => {
        console.error('Error creating project:', error);
        this.globalMessageService.handle({
          message: 'Error creating project',
          isError: true
        });
      }
    });
  }

  async cancel(): Promise<void> {
    await this.router.navigate(['/admin/projects']);
  }

  publishProject(): void {
    if (!this.areFieldsCorrect()) return;

    // Use processed content (with tables converted to HTML) for saving
    const contentToSave = this.processedContent || this.content;

    const payload: CreateProjectPayload = {
      projectTitle: this.projectName,
      projectDescription: this.description,
      projectContent: contentToSave,
      projectTags: this.tags,
      projectMetaKeywords: this.metaKeywords,
      projectFeaturedImageId: this.projectImageId,
      projectPublished: true
    };

    this.projectsService.createProject(payload).subscribe({
      next: async (createdProject) => {
        this.globalMessageService.handle({
          message: 'Project published successfully'
        });
        // Navigate to edit page for the newly created project
        await this.router.navigate(['/admin/projects/edit', createdProject.slug]);
      },
      error: (error) => {
        console.error('Error publishing project:', error);
        this.globalMessageService.handle({
          message: 'Error publishing project',
          isError: true
        });
      }
    });
  }

  toggleFeatured(): void {
    this.featured = !this.featured;
  }
}
