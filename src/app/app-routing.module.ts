import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@pages/home/home.component';
import { LoginComponent } from '@pages/login/login.component';
import { PostsComponent } from '@pages/posts/posts.component';
import { ProjectsComponent } from '@pages/projects/projects.component';
import { ProjectComponent } from '@pages/project/project.component';
import { PostComponent } from '@pages/post/post.component';
import { IsAuthenticatedGuard } from '@guards/is-authenticated.guard';
import { RegistrationComponent } from '@pages/registration/registration.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [IsAuthenticatedGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [IsAuthenticatedGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  {
    path: 'posts',
    component: PostsComponent,
    children: [
      {
        path: ':id',
        component: PostComponent,
        canActivate: [IsAuthenticatedGuard]
      }
    ],
    canActivate: [IsAuthenticatedGuard]
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    children: [
      {
        path: ':id',
        component: ProjectComponent,
        canActivate: [IsAuthenticatedGuard]
      }
    ],
    canActivate: [IsAuthenticatedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
