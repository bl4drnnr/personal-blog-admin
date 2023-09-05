import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicComponentsModule } from '@components/basic-components.module';
import { LayoutComponentsModule } from '@components/layout-components.module';

@NgModule({
  exports: [
    BasicComponentsModule,
    LayoutComponentsModule
  ],
  imports: [CommonModule]
})
export class ComponentsModule {}
