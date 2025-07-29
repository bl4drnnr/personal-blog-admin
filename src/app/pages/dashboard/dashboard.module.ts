import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsModule } from '@layouts/layouts.module';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, LayoutsModule],
  exports: [DashboardComponent]
})
export class DashboardModule {}
