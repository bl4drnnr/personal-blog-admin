import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { AboutService } from '@services/about.service';
import { ExperienceData } from '@interfaces/about/experience-data.interface';

@Component({
  selector: 'page-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.scss']
})
export class ExperiencesComponent extends BaseAdminComponent implements OnInit {
  experiences: ExperienceData[] = [];
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  editingExperience: ExperienceData | null = null;

  // Form data
  title = '';
  description = '';
  companyName = '';
  orderStr = '0';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private aboutService: AboutService
  ) {
    super(router, refreshTokensService);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.loadExperiences();
  }

  protected override onUserInfoLoaded(): void {
    this.titleService.setTitle(this.getPageTitle());
  }

  private getPageTitle(): string {
    return 'Personal Blog | Experiences Management';
  }

  loadExperiences(): void {
    this.aboutService.getExperiences().subscribe({
      next: (experiences) => {
        this.experiences = experiences;
      },
      error: (error) => {
        console.error('Error loading experiences:', error);
      }
    });
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.editingExperience = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(experience: ExperienceData): void {
    this.modalMode = 'edit';
    this.editingExperience = experience;
    this.populateForm(experience);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.title = '';
    this.description = '';
    this.companyName = '';
    this.orderStr = '0';
  }

  populateForm(experience: ExperienceData): void {
    this.title = experience.title || '';
    this.description = experience.description || '';
    this.companyName = experience.companyName || '';
    this.orderStr = (experience.order || 0).toString();
  }

  saveExperience(): void {
    if (!this.title || !this.companyName) {
      alert('Title and Company Name are required');
      return;
    }

    const payload: ExperienceData = {
      title: this.title,
      description: this.description || undefined,
      companyName: this.companyName,
      order: parseInt(this.orderStr) || 0
    };

    if (this.modalMode === 'create') {
      this.aboutService.createExperience(payload).subscribe({
        next: () => {
          this.loadExperiences();
          this.closeModal();
          alert('Experience created successfully!');
        },
        error: () => {
          alert('Error saving experience. Please try again.');
        }
      });
    } else {
      this.aboutService
        .updateExperience(this.editingExperience!.id!, payload)
        .subscribe({
          next: () => {
            this.loadExperiences();
            this.closeModal();
            alert('Experience updated successfully!');
          },
          error: () => {
            alert('Error saving experience. Please try again.');
          }
        });
    }
  }

  deleteExperience(experience: ExperienceData): void {
    if (
      confirm(
        `Are you sure you want to delete "${experience.title}" at ${experience.companyName}?`
      )
    ) {
      this.aboutService.deleteExperience(experience.id!).subscribe({
        next: () => {
          this.loadExperiences();
          alert('Experience deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting experience:', error);
          alert('Error deleting experience. Please try again.');
        }
      });
    }
  }
}
