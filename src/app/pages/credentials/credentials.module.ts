import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

const components: any = [];

@NgModule({
  declarations: [...components],
  imports: [RouterModule.forRoot(routes), CommonModule, NgOptimizedImage],
  exports: []
})
export class CredentialsModule {}
