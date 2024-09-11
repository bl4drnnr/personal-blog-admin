import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { BasicComponentsModule } from '@components/basic-components.module';
import { TranslocoModule } from '@ngneat/transloco';

const components = [SidebarComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, BasicComponentsModule, TranslocoModule],
  exports: [...components]
})
export class DashboardComponentsModule {}
