import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LayoutsModule } from '@layouts/layouts.module';
import { CreateArticleComponent } from '@pages/create-article/create-article.component';
import { BasicComponentsModule } from '@components/basic-components.module';
import { FormsModule } from '@angular/forms';
import { DashboardComponentsModule } from '@components/dashboard-components.module';
import { NgxEditorModule } from 'ngx-editor';
import { CategoriesComponent } from '@pages/categories/categories.component';
import { ArticlesComponent } from '@pages/articles/articles.component';
import { ArticleComponent } from '@pages/article/article.component';
import { TranslocoModule } from '@ngneat/transloco';
import { AuthorsComponent } from '@pages/authors/authors.component';
import { AuthorComponent } from '@pages/author/author.component';
import { CreateAuthorComponent } from '@pages/create-author/create-author.component';
import { CertificationComponent } from '@pages/certification/certification.component';
import { CertificationsComponent } from '@pages/certifications/certifications.component';
import { CreateCertificationComponent } from '@pages/create-certification/create-certification.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CreateProjectComponent } from '@pages/create-project/create-project.component';
import { ProjectsComponent } from '@pages/projects/projects.component';
import { CreateExperienceComponent } from '@pages/create-experience/create-experience.component';
import { ExperiencesComponent } from '@pages/experiences/experiences.component';
import { ExperienceComponent } from '@pages/experience/experience.component';
import { ProjectComponent } from '@pages/project/project.component';

const routes: Routes = [
  {
    path: '',
    component: ArticlesComponent,
    pathMatch: 'full'
  },
  {
    path: 'account/create-article',
    component: CreateArticleComponent
  },
  {
    path: 'account/categories',
    component: CategoriesComponent
  },
  {
    path: 'account/articles',
    component: ArticlesComponent
  },
  {
    path: 'account/article/:language/:slug',
    component: ArticleComponent
  },
  {
    path: 'account/authors',
    component: AuthorsComponent
  },
  {
    path: 'account/author/:authorId',
    component: AuthorComponent
  },
  {
    path: 'account/create-author',
    component: CreateAuthorComponent
  },
  {
    path: 'account/certifications',
    component: CertificationsComponent
  },
  {
    path: 'account/certification/:certificationId',
    component: CertificationComponent
  },
  {
    path: 'account/create-certification',
    component: CreateCertificationComponent
  },
  {
    path: 'account/create-project',
    component: CreateProjectComponent
  },
  {
    path: 'account/projects',
    component: ProjectsComponent
  },
  {
    path: 'account/create-experience',
    component: CreateExperienceComponent
  },
  {
    path: 'account/experiences',
    component: ExperiencesComponent
  },
  {
    path: 'account/project/:projectId',
    component: ProjectComponent
  },
  {
    path: 'account/experience/:experienceId',
    component: ExperienceComponent
  }
];

const components = [
  CreateArticleComponent,
  CategoriesComponent,
  ArticlesComponent,
  ArticleComponent,
  AuthorsComponent,
  AuthorComponent,
  CreateAuthorComponent,
  CertificationComponent,
  CertificationsComponent,
  CreateCertificationComponent,
  CreateProjectComponent,
  ProjectsComponent,
  CreateExperienceComponent,
  ExperiencesComponent,
  ExperienceComponent,
  ProjectComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    NgOptimizedImage,
    LayoutsModule,
    BasicComponentsModule,
    FormsModule,
    DashboardComponentsModule,
    NgxEditorModule.forRoot({
      locals: {
        bold: 'Bold',
        italic: 'Italic',
        code: 'Code',
        blockquote: 'Blockquote',
        underline: 'Underline',
        strike: 'Strike',
        bullet_list: 'Bullet List',
        ordered_list: 'Ordered List',
        heading: 'Heading',
        h1: 'Header 1',
        h2: 'Header 2',
        h3: 'Header 3',
        h4: 'Header 4',
        h5: 'Header 5',
        h6: 'Header 6',
        align_left: 'Left Align',
        align_center: 'Center Align',
        align_right: 'Right Align',
        align_justify: 'Justify',
        text_color: 'Text Color',
        background_color: 'Background Color',
        url: 'URL',
        text: 'Text',
        openInNewTab: 'Open in new tab',
        insert: 'Insert',
        altText: 'Alt Text',
        title: 'Title',
        remove: 'Remove',
        enterValidUrl: 'Please enter a valid URL'
      }
    }),
    TranslocoModule,
    PdfViewerModule
  ],
  exports: [...components]
})
export class DashboardModule {}
