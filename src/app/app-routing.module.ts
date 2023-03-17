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
import { AccountConfirmation } from '@pages/account-confirmation/account-confirmation.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'account-confirmation', component: AccountConfirmation },
  {
    path: 'account-confirmation/:confirmationHash',
    component: AccountConfirmation
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [IsAuthenticatedGuard]
  },
  {
    path: 'posts',
    component: PostsComponent,
    canActivate: [IsAuthenticatedGuard]
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [IsAuthenticatedGuard]
  },
  {
    path: 'post',
    component: PostComponent,
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
    path: 'project',
    component: ProjectComponent,
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
