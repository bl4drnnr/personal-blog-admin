import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from '@pages/account/account.component';
import { LayoutsModule } from '@layouts/layouts.module';
import { CreatePostComponent } from '@pages/create-post/create-post.component';
import { BasicComponentsModule } from '@components/basic-components.module';
import { FormsModule } from '@angular/forms';
import { DashboardComponentsModule } from '@components/dashboard-components.module';

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
  },
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
    DashboardComponentsModule
  ],
  exports: [...components]
})
export class DashboardModule {}
