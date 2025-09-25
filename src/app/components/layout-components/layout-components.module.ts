import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GlobalMessageComponent } from '@components/global-message/global-message.component';
import { HeaderComponent } from '@components/header/header.component';
import { BasicComponentsModule } from '@components/basic-components.module';
import { LoaderComponent } from '@components/loader/loader.component';
import { SidebarComponent } from '@components/sidebar/sidebar.component';

const components = [
  GlobalMessageComponent,
  HeaderComponent,
  LoaderComponent,
  SidebarComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterModule,
    FormsModule,
    BasicComponentsModule
  ],
  exports: [...components]
})
export class LayoutComponentsModule {}
