import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { LayoutsModule } from '@layouts/layouts.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, LayoutsModule],
  exports: [DashboardComponent]
})
export class DashboardModule {}
