import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RefreshTokensService } from '@services/refresh-token.service';
import { BaseAdminComponent } from '@shared/components/base-admin.component';
import { AboutService } from '@services/about.service';
import { ExperienceData } from '@interfaces/about/experience-data.interface';
import { StaticAssetsService } from '@services/static-assets.service';
import { StaticAsset } from '@payloads/static-asset.interface';
import { PositionData } from '@interfaces/about/position-data.interface';

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

  // Position modal
  showPositionModal = false;
  positionModalMode: 'create' | 'edit' = 'create';
  editingPosition: PositionData | null = null;
  currentExperience: ExperienceData | null = null;

  // Experience form data
  companyName = '';
  companyWebsite = '';
  orderStr = '0';
  logoAssetId = '';
  logoPreview = '';

  // Position form data
  positionTitle = '';
  positionDescription = '';
  positionStartDate = '';
  positionEndDate = '';
  positionSkills: string[] = [];
  positionSkillsInput = '';
  positionOrderStr = '0';

  constructor(
    protected override router: Router,
    protected override refreshTokensService: RefreshTokensService,
    private titleService: Title,
    private aboutService: AboutService,
    private staticAssetsService: StaticAssetsService
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
    this.companyName = '';
    this.companyWebsite = '';
    this.orderStr = '0';
    this.logoAssetId = '';
    this.logoPreview = '';
  }

  populateForm(experience: ExperienceData): void {
    this.companyName = experience.companyName || '';
    this.companyWebsite = experience.companyWebsite || '';
    this.orderStr = (experience.order || 0).toString();
    this.logoAssetId = experience.logoId || '';
    this.logoPreview = experience.companyLogo || ''; // Use the resolved S3 URL
  }

  saveExperience(): void {
    if (!this.companyName) {
      alert('Company Name is required');
      return;
    }

    const payload: ExperienceData = {
      companyName: this.companyName,
      companyWebsite: this.companyWebsite || undefined,
      logoId: this.logoAssetId || undefined,
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

  onLogoAssetSelected(asset: StaticAsset | null): void {
    if (asset) {
      this.logoAssetId = asset.id;
      // Fetch the S3 URL for preview
      this.staticAssetsService.findById(asset.id).subscribe({
        next: (assetData) => {
          this.logoPreview = assetData.s3Url;
        },
        error: (error) => {
          console.error('Error loading asset preview:', error);
          this.logoPreview = '';
        }
      });
    } else {
      this.logoAssetId = '';
      this.logoPreview = '';
    }
  }

  deleteExperience(experience: ExperienceData): void {
    if (
      confirm(
        `Are you sure you want to delete experience at "${experience.companyName}"?`
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

  // Position management methods
  openAddPositionModal(experience: ExperienceData): void {
    this.positionModalMode = 'create';
    this.currentExperience = experience;
    this.editingPosition = null;
    this.resetPositionForm();
    this.showPositionModal = true;
  }

  openEditPositionModal(experience: ExperienceData, position: PositionData): void {
    this.positionModalMode = 'edit';
    this.currentExperience = experience;
    this.editingPosition = position;
    this.populatePositionForm(position);
    this.showPositionModal = true;
  }

  closePositionModal(): void {
    this.showPositionModal = false;
    this.resetPositionForm();
    this.currentExperience = null;
    this.editingPosition = null;
  }

  resetPositionForm(): void {
    this.positionTitle = '';
    this.positionDescription = '';
    this.positionStartDate = '';
    this.positionEndDate = '';
    this.positionSkills = [];
    this.positionSkillsInput = '';
    this.positionOrderStr = '0';
  }

  populatePositionForm(position: PositionData): void {
    this.positionTitle = position.title || '';
    this.positionDescription = position.description || '';
    this.positionStartDate = position.startDate || '';
    this.positionEndDate = position.endDate || '';
    this.positionSkills = [...(position.skills || [])];
    this.positionSkillsInput = '';
    this.positionOrderStr = (position.order || 0).toString();
  }

  savePosition(): void {
    if (!this.positionTitle || !this.currentExperience) {
      alert('Position title is required');
      return;
    }

    const payload: PositionData = {
      title: this.positionTitle,
      description: this.positionDescription || undefined,
      startDate: this.positionStartDate || undefined,
      endDate: this.positionEndDate || undefined,
      skills: this.positionSkills.length > 0 ? this.positionSkills : undefined,
      order: parseInt(this.positionOrderStr) || 0
    };

    if (this.positionModalMode === 'create') {
      this.aboutService
        .createPosition(this.currentExperience.id!, payload)
        .subscribe({
          next: () => {
            this.loadExperiences();
            this.closePositionModal();
            alert('Position created successfully!');
          },
          error: (error) => {
            console.error('Error creating position:', error);
            alert('Error creating position. Please try again.');
          }
        });
    } else {
      this.aboutService
        .updatePosition(this.editingPosition!.id!, payload)
        .subscribe({
          next: () => {
            this.loadExperiences();
            this.closePositionModal();
            alert('Position updated successfully!');
          },
          error: (error) => {
            console.error('Error updating position:', error);
            alert('Error updating position. Please try again.');
          }
        });
    }
  }

  deletePosition(experience: ExperienceData, position: PositionData): void {
    if (
      confirm(`Are you sure you want to delete the position "${position.title}"?`)
    ) {
      this.aboutService.deletePosition(position.id!).subscribe({
        next: () => {
          this.loadExperiences();
          alert('Position deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting position:', error);
          alert('Error deleting position. Please try again.');
        }
      });
    }
  }

  // Skills management methods
  addSkill(): void {
    const skill = this.positionSkillsInput.trim();
    if (skill && !this.positionSkills.includes(skill)) {
      this.positionSkills.push(skill);
      this.positionSkillsInput = '';
    }
  }

  removeSkill(index: number): void {
    this.positionSkills.splice(index, 1);
  }

  onSkillKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addSkill();
    }
  }
}
