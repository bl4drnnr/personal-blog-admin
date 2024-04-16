import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicComponentsModule } from '@components/basic-components.module';
import { DashboardComponentsModule } from '@components/dashboard-components.module';

@NgModule({
  imports: [CommonModule],
  exports: [BasicComponentsModule, DashboardComponentsModule]
})
export class ComponentsModule {}
