import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LoginComponent } from '@pages/login/login.component';
import { ComponentsModule } from '@components/components.module';
import {RouterModule, Routes} from "@angular/router";
import {ModeToggleModule} from "@components/theme-toggle/theme-toggle.module";

const components = [
  LoginComponent,
];

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    redirectTo: 'dashboard'
  },
  {
    path: 'index',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  declarations: [...components],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    ComponentsModule,
    NgOptimizedImage,
    ModeToggleModule
  ],
  exports: [...components]
})
export class CredentialsModule {}
