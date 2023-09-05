import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CredentialsLayout } from '@layouts/credentials/credentials.layout';
import { RouterModule } from '@angular/router';
import { DefaultLayout } from '@layouts/default/default.layout';
import { ComponentsModule } from '@components/components.module';
import { ModeToggleModule } from '@components/theme-toggle/theme-toggle.module';

const components = [DefaultLayout, CredentialsLayout];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    ComponentsModule,
    ModeToggleModule
  ],
  exports: [...components]
})
export class LayoutsModule {}
