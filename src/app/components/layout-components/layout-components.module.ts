import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { GlobalMessageComponent } from '@components/global-message/global-message.component';

const components = [GlobalMessageComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, NgOptimizedImage],
  exports: [...components]
})
export class LayoutComponentsModule {}
