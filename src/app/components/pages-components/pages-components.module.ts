import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecoveryKeysComponent } from '@components/recovery-keys/recovery-keys.component';
import { BasicComponentsModule } from '@components/basic-components.module';
import { CreateMfaComponent } from '@components/create-mfa/create-mfa.component';
import { CreatePasswordComponent } from '@components/create-password/create-password.component';
import { TranslocoModule } from '@ngneat/transloco';
import { PreviewArticleComponent } from '@components/preview-article/preview-article.component';
import { PreviewAboutComponent } from '@components/preview-about/preview-about.component';
import { AboutCertsCellComponent } from '@components/about-certs-cell/about-certs-cell.component';
import { AboutExperienceCellComponent } from '@components/about-experience-cell/about-experience-cell.component';
import { AboutAuthorCellComponent } from '@components/about-author-cell/about-author-cell.component';

const components = [
  RecoveryKeysComponent,
  CreateMfaComponent,
  CreatePasswordComponent,
  PreviewArticleComponent,
  PreviewAboutComponent,
  AboutCertsCellComponent,
  AboutExperienceCellComponent,
  AboutAuthorCellComponent
];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, BasicComponentsModule, TranslocoModule],
  exports: [...components]
})
export class PagesComponentsModule {}
