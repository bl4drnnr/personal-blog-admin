import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialsModule } from '@pages/credentials.module';

@NgModule({
  imports: [CommonModule],
  exports: [CredentialsModule]
})
export class PagesModule {}
