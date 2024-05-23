import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { GlobalMessageComponent } from '@components/global-message/global-message.component';
import { HeaderComponent } from '@components/header/header.component';
import { FooterComponent } from '@components/footer/footer.component';
import { BasicComponentsModule } from '@components/basic-components.module';

const components = [GlobalMessageComponent, HeaderComponent, FooterComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, NgOptimizedImage, BasicComponentsModule],
  exports: [...components]
})
export class LayoutComponentsModule {}
