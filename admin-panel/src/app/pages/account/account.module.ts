import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { LayoutsModule } from '@layouts/layouts.module';
import { PostsComponent } from './posts/posts.component';
import { PostComponent } from './post/post.component';

const components = [
  DashboardComponent,
  SettingsComponent,
  PostsComponent,
  PostComponent
];

const routes: Routes = [
  {
    path: 'account/dashboard',
    component: DashboardComponent
  },
  {
    path: 'account/settings',
    component: SettingsComponent
  },
  {
    path: 'account/posts',
    component: PostsComponent
  },
  {
    path: 'account/post/:slug',
    component: PostComponent
  },
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [...components],
  imports: [RouterModule.forRoot(routes), CommonModule, LayoutsModule],
  exports: [...components]
})
export class AccountModule {}
