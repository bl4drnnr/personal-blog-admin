import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialsModule } from '@pages/credentials.module';
import { DashboardModule } from '@pages/dashboard/dashboard.module';
import { LayoutsModule } from '@layouts/layouts.module';

// Site Configuration
import { SiteConfigComponent } from '@pages/admin/site-config/site-config.component';

// Content Management
import { ArticlesComponent } from '@pages/admin/articles/articles.component';
import { ProjectsComponent } from '@pages/admin/projects/projects.component';
import { PagesComponent } from '@pages/admin/pages/pages.component';
import { HomePageManagementComponent } from '@pages/admin/pages/home/home-page-management.component';
import { FaqManagementComponent } from '@pages/admin/pages/faq/faq-management.component';

// About Section
import { AboutComponent } from '@pages/admin/about/about.component';
import { ExperiencesComponent } from '@pages/admin/experiences/experiences.component';
import { CertificatesComponent } from '@pages/admin/certificates/certificates.component';

// Changelog
import { ChangelogEntriesComponent } from '@pages/admin/changelog/entries/changelog-entries.component';
import { ChangelogSettingsComponent } from '@pages/admin/changelog/settings/changelog-settings.component';

// License
import { LicenseTilesComponent } from '@pages/admin/license/tiles/license-tiles.component';
import { LicenseSettingsComponent } from '@pages/admin/license/settings/license-settings.component';

// Privacy Policy
import { PrivacySectionsComponent } from '@pages/admin/privacy/sections/privacy-sections.component';
import { PrivacySettingsComponent } from '@pages/admin/privacy/settings/privacy-settings.component';

// Static Assets
import { StaticAssetsComponent } from '@pages/admin/static-assets/static-assets.component';

// User Management
import { UserInfoComponent } from '@pages/users/user-info/user-info.component';
import { SecuritySettingsComponent } from '@pages/security/settings/security-settings.component';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/components.module';

const adminComponents = [
  // Site Configuration
  SiteConfigComponent,
  // Content Management
  ArticlesComponent,
  ProjectsComponent,
  PagesComponent,
  HomePageManagementComponent,
  FaqManagementComponent,
  // About Section
  AboutComponent,
  ExperiencesComponent,
  CertificatesComponent,
  // Changelog
  ChangelogEntriesComponent,
  ChangelogSettingsComponent,
  // License
  LicenseTilesComponent,
  LicenseSettingsComponent,
  // Privacy Policy
  PrivacySectionsComponent,
  PrivacySettingsComponent,
  // Static Assets
  StaticAssetsComponent,
  // User Management
  UserInfoComponent,
  SecuritySettingsComponent
];

@NgModule({
  declarations: [...adminComponents],
  imports: [CommonModule, LayoutsModule, FormsModule, ComponentsModule],
  exports: [CredentialsModule, DashboardModule, ...adminComponents]
})
export class PagesModule {}
