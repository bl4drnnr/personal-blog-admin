import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@pages/login/login.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';

// Site Configuration
import { SiteConfigComponent } from '@pages/admin/site-config/site-config.component';

// Content Management
import { ArticlesComponent } from '@pages/admin/articles/articles.component';
import { EditArticleComponent } from '@pages/admin/articles/edit/edit-article.component';
import { CreateArticleComponent } from '@pages/admin/articles/create/create-article.component';
import { ProjectsComponent } from '@pages/admin/projects/projects.component';
import { EditProjectComponent } from '@pages/admin/projects/edit/edit-project.component';
import { CreateProjectComponent } from '@pages/admin/projects/create/create-project.component';
import { PagesComponent } from '@pages/admin/pages/pages.component';
import { HomePageManagementComponent } from '@pages/admin/pages/home/home-page-management.component';
import { BlogPageManagementComponent } from '@pages/admin/pages/blog/blog-page-management.component';
import { ProjectsPageManagementComponent } from '@pages/admin/pages/projects/projects-page-management.component';
import { FaqManagementComponent } from '@pages/admin/pages/faq/faq-management.component';
import { WhysSectionManagementComponent } from '@pages/admin/pages/whys-section/whys-section-management.component';
import { ContactPageManagementComponent } from '@pages/admin/pages/contact/contact-page-management.component';
import { SubscribePageManagementComponent } from '@pages/admin/pages/subscribe/subscribe-page-management.component';
import { ContactMessagesComponent } from '@pages/admin/contact/messages/contact-messages.component';

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

// Menu
import { MenuTilesComponent } from '@pages/admin/menu/tiles/menu-tiles.component';
import { MenuSettingsComponent } from '@pages/admin/menu/settings/menu-settings.component';

// Static Assets
import { StaticAssetsComponent } from '@pages/admin/static-assets/static-assets.component';

// Maintenance Mode
import { MaintenanceComponent } from '@pages/admin/maintenance/maintenance.component';

// Password Protection Mode
import { PasswordProtectionComponent } from '@pages/admin/password-protection/password-protection.component';

// User Management
import { UserInfoComponent } from '@pages/users/user-info/user-info.component';
import { SecuritySettingsComponent } from '@pages/security/settings/security-settings.component';
import { NewsletterSubscriptionsComponent } from '@pages/admin/newsletters/subscriptions/newsletter-subscriptions.component';

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
    path: 'admin/posts/create',
    component: CreateArticleComponent
  },
  {
    path: 'admin/posts/edit/:slug',
    component: EditArticleComponent
  },
  {
    path: 'admin/projects',
    component: ProjectsComponent
  },
  {
    path: 'admin/projects/create',
    component: CreateProjectComponent
  },
  {
    path: 'admin/projects/edit/:slug',
    component: EditProjectComponent
  },
  {
    path: 'admin/pages',
    component: PagesComponent
  },
  {
    path: 'admin/pages/home',
    component: HomePageManagementComponent
  },
  {
    path: 'admin/pages/blog',
    component: BlogPageManagementComponent
  },
  {
    path: 'admin/pages/projects',
    component: ProjectsPageManagementComponent
  },
  {
    path: 'admin/pages/faq',
    component: FaqManagementComponent
  },
  {
    path: 'admin/pages/whys-section',
    component: WhysSectionManagementComponent
  },
  {
    path: 'admin/pages/contact',
    component: ContactPageManagementComponent
  },
  {
    path: 'admin/pages/subscribe',
    component: SubscribePageManagementComponent
  },
  {
    path: 'admin/contact/messages',
    component: ContactMessagesComponent
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
  // Menu
  {
    path: 'admin/menu/tiles',
    component: MenuTilesComponent
  },
  {
    path: 'admin/menu/page',
    component: MenuSettingsComponent
  },
  // Static Assets
  {
    path: 'admin/static-assets',
    component: StaticAssetsComponent
  },
  // Maintenance Mode
  {
    path: 'admin/maintenance',
    component: MaintenanceComponent
  },
  // Password Protection Mode
  {
    path: 'admin/password-protection',
    component: PasswordProtectionComponent
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
    path: 'admin/newsletters/subscriptions',
    component: NewsletterSubscriptionsComponent
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
