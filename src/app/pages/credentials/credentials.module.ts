import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LoginComponent } from '@pages/login/login.component';
import { RegistrationComponent } from '@pages/registration/registration.component';
import { LayoutsModule } from '@layouts/layouts.module';
import { ComponentsModule } from '@components/components.module';
import { RouterModule, Routes } from '@angular/router';
import { AccountConfirmationComponent } from '@pages/account-confirmation/account-confirmation.component';
import { TranslocoModule } from '@ngneat/transloco';
import { ForgotPasswordComponent } from '@pages/forgot-password/forgot-password.component';
import { RecoverAccountComponent } from '@pages/recover-account/recover-account.component';
import { ResetPasswordComponent } from '@pages/reset-password/reset-password.component';

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
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'recover-account',
    component: RecoverAccountComponent
  },
  {
    path: 'reset-password/:hash',
    component: ResetPasswordComponent
  }
];

const components: any = [
  LoginComponent,
  RegistrationComponent,
  AccountConfirmationComponent,
  ForgotPasswordComponent,
  RecoverAccountComponent,
  ResetPasswordComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    ComponentsModule,
    NgOptimizedImage,
    LayoutsModule,
    TranslocoModule
  ],
  exports: [...components]
})
export class CredentialsModule {}
