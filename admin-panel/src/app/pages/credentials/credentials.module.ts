import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LoginComponent } from '@pages/login/login.component';
import { ComponentsModule } from '@components/components.module';
import { RouterModule, Routes } from '@angular/router';
import { ModeToggleModule } from '@components/theme-toggle/theme-toggle.module';
import { RegistrationComponent } from './registration/registration.component';
import { AccountModule } from '@pages/account/account.module';
import { AccountConfirmationComponent } from '@pages/account-confirmation/account-confirmation.component';
import { PagesComponentsModule } from '@components/pages-components/pages-components.module';
import {LayoutsModule} from "@layouts/layouts.module";

const components = [
  LoginComponent,
  RegistrationComponent,
  AccountConfirmationComponent
];

const routes: Routes = [
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    redirectTo: 'dashboard'
  },
  {
    path: 'account-confirmation/:hash',
    component: AccountConfirmationComponent
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
    AccountModule,
    CommonModule,
    ComponentsModule,
    NgOptimizedImage,
    ModeToggleModule,
    PagesComponentsModule,
    LayoutsModule
  ],
  exports: [...components]
})
export class CredentialsModule {}
