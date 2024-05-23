import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { BasicComponentsModule } from '@components/basic-components.module';

const components = [SidebarComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, BasicComponentsModule],
  exports: [...components]
})
export class DashboardComponentsModule {}
