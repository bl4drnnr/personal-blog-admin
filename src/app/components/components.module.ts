import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicComponentsModule } from '@components/basic-components.module';
import { LayoutComponentsModule } from '@components/layout-components.module';

@NgModule({
  imports: [CommonModule],
  exports: [BasicComponentsModule, LayoutComponentsModule]
})
export class ComponentsModule {}
