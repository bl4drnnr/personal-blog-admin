import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BasicComponentsModule } from '@components/basic-components.module';
import { CreateMfaComponent } from '@components/pages-components/create-mfa/create-mfa.component';
import { RecoveryKeysComponent } from '@components/pages-components/recovery-keys/recovery-keys.component';
import { CreatePasswordComponent } from '@components/pages-components/create-password/create-password.component';

const components = [
  CreateMfaComponent,
  RecoveryKeysComponent,
  CreatePasswordComponent
];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, NgOptimizedImage, BasicComponentsModule],
  exports: [...components]
})
export class PagesComponentsModule {}
