import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@pages/home/home.component';
import { LoginComponent } from '@pages/login/login.component';
import { PostsComponent } from '@pages/posts/posts.component';
import { ProjectsComponent } from '@pages/projects/projects.component';
import { ProjectComponent } from '@pages/project/project.component';
import { PostComponent } from '@pages/post/post.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'posts',
    component: PostsComponent,
    children: [{ path: ':id', component: PostComponent }]
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    children: [{ path: ':id', component: ProjectComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
