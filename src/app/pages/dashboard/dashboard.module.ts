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
    path: 'account/article/:slug',
    component: ArticleComponent
  }
];

const components = [
  CreateArticleComponent,
  CategoriesComponent,
  ArticlesComponent,
  ArticleComponent
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
    })
  ],
  exports: [...components]
})
export class DashboardModule {}
