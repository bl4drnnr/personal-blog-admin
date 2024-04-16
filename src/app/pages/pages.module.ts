import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialsModule } from '@pages/credentials.module';
import { DashboardModule } from '@pages/dashboard/dashboard.module';

@NgModule({
  imports: [CommonModule],
  exports: [CredentialsModule, DashboardModule]
})
export class PagesModule {}
