import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@pages/login/login.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';

// Site Configuration
import { SiteConfigComponent } from '@pages/admin/site-config/site-config.component';

// Content Management
import { ArticlesComponent } from '@pages/admin/articles/articles.component';
import { ProjectsComponent } from '@pages/admin/projects/projects.component';
import { PagesComponent } from '@pages/admin/pages/pages.component';

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

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  // Site Configuration
  {
    path: 'admin/site/config',
    component: SiteConfigComponent
  },
  // Content Management
  {
    path: 'admin/posts',
    component: ArticlesComponent
  },
  {
    path: 'admin/projects',
    component: ProjectsComponent
  },
  {
    path: 'admin/pages',
    component: PagesComponent
  },
  // About Section
  {
    path: 'admin/about',
    component: AboutComponent
  },
  {
    path: 'admin/experiences',
    component: ExperiencesComponent
  },
  {
    path: 'admin/certificates',
    component: CertificatesComponent
  },
  // Changelog
  {
    path: 'admin/changelog/entries',
    component: ChangelogEntriesComponent
  },
  {
    path: 'admin/changelog/page',
    component: ChangelogSettingsComponent
  },
  // License
  {
    path: 'admin/license/tiles',
    component: LicenseTilesComponent
  },
  {
    path: 'admin/license/page',
    component: LicenseSettingsComponent
  },
  // Privacy Policy
  {
    path: 'admin/privacy/sections',
    component: PrivacySectionsComponent
  },
  {
    path: 'admin/privacy/page',
    component: PrivacySettingsComponent
  },
  // Static Assets
  {
    path: 'admin/static-assets',
    component: StaticAssetsComponent
  },
  // User Management
  {
    path: 'users/user-info',
    component: UserInfoComponent
  },
  {
    path: 'security/settings',
    component: SecuritySettingsComponent
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
