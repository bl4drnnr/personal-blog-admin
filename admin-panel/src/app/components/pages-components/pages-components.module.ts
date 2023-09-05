import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BasicComponentsModule } from '@components/basic-components.module';
import { CreateMfaComponent } from '@components/pages-components/create-mfa/create-mfa.component';
import { RecoveryKeysComponent } from '@components/pages-components/recovery-keys/recovery-keys.component';

const components = [CreateMfaComponent, RecoveryKeysComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, NgOptimizedImage, BasicComponentsModule],
  exports: [...components]
})
export class PagesComponentsModule {}
