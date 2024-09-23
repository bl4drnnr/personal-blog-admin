import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecoveryKeysComponent } from '@components/recovery-keys/recovery-keys.component';
import { BasicComponentsModule } from '@components/basic-components.module';
import { CreateMfaComponent } from '@components/create-mfa/create-mfa.component';
import { CreatePasswordComponent } from '@components/create-password/create-password.component';
import { TranslocoModule } from '@ngneat/transloco';
import { PreviewArticleComponent } from '@components/preview-article/preview-article.component';

const components = [
  RecoveryKeysComponent,
  CreateMfaComponent,
  CreatePasswordComponent,
  PreviewArticleComponent
];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, BasicComponentsModule, TranslocoModule],
  exports: [...components]
})
export class PagesComponentsModule {}
