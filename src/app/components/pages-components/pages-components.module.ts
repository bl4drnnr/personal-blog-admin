import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecoveryKeysComponent } from '@components/recovery-keys/recovery-keys.component';
import { BasicComponentsModule } from '@components/basic-components.module';
import { CreateMfaComponent } from '@components/create-mfa/create-mfa.component';

const components = [RecoveryKeysComponent, CreateMfaComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, BasicComponentsModule],
  exports: [...components]
})
export class PagesComponentsModule {}
