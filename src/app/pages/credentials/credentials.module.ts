import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LoginComponent } from '@pages/login/login.component';
import { RegistrationComponent } from '@pages/registration/registration.component';
import { LayoutsModule } from '@layouts/layouts.module';
import { ComponentsModule } from '@components/components.module';
import { RouterModule, Routes } from '@angular/router';
import { AccountConfirmationComponent } from '@pages/account-confirmation/account-confirmation.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'account-confirmation/:hash',
    component: AccountConfirmationComponent
  }
];

const components: any = [
  LoginComponent,
  RegistrationComponent,
  AccountConfirmationComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    ComponentsModule,
    NgOptimizedImage,
    LayoutsModule
  ],
  exports: [...components]
})
export class CredentialsModule {}
