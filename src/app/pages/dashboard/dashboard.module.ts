import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutsModule } from '@layouts/layouts.module';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, RouterModule, LayoutsModule],
  exports: [DashboardComponent]
})
export class DashboardModule {}
