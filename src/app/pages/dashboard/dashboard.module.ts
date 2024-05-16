import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from '@pages/account/account.component';
import { LayoutsModule } from '@layouts/layouts.module';
import { CreatePostComponent } from '@pages/create-post/create-post.component';
import { BasicComponentsModule } from '@components/basic-components.module';
import { FormsModule } from '@angular/forms';
import { DashboardComponentsModule } from '@components/dashboard-components.module';
import { NgxEditorModule } from 'ngx-editor';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'account/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'account/dashboard',
    component: AccountComponent
  },
  {
    path: 'account/create-post',
    component: CreatePostComponent
  }
];

const components = [AccountComponent, CreatePostComponent];

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
