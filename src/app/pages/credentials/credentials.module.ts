import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '@pages/login/login.component';
import { LayoutsModule } from '@layouts/layouts.module';
import { ComponentsModule } from '@components/components.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, ComponentsModule, LayoutsModule],
  exports: [LoginComponent]
})
export class CredentialsModule {}
