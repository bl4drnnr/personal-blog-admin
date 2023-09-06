import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FooterComponent } from '@components/footer/footer.component';
import { GlobalMessageComponent } from '@components/global-message/global-message.component';
import { HeaderComponent } from '@components/header/header.component';
import { LoaderComponent } from '@components/loader/loader.component';
import { BasicComponentsModule } from '@components/basic-components.module';
import { ModeToggleModule } from '@components/theme-toggle/theme-toggle.module';
import { DashboardSidebarComponent } from '@components/dashboard-sidebar/dashboard-sidebar.component';

const components = [
  FooterComponent,
  GlobalMessageComponent,
  HeaderComponent,
  LoaderComponent,
  DashboardSidebarComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    NgOptimizedImage,
    BasicComponentsModule,
    ModeToggleModule
  ],
  exports: [...components]
})
export class LayoutComponentsModule {}
