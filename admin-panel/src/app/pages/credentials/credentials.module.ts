import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LoginComponent } from '@pages/login/login.component';
import { ComponentsModule } from '@components/components.module';
import {RouterModule, Routes} from "@angular/router";

const components = [
  LoginComponent,
];

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  declarations: [...components],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    ComponentsModule,
    NgOptimizedImage
  ],
  exports: [...components]
})
export class CredentialsModule {}
