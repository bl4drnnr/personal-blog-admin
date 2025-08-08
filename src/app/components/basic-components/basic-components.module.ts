import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';
import { ButtonComponent } from '@components/button/button.component';
import { CheckboxComponent } from '@components/checkbox/checkbox.component';
import { DropdownComponent } from '@components/dropdown/dropdown.component';
import { InputComponent } from '@components/input/input.component';
import { InputMfaComponent } from '@components/input-mfa/input-mfa.component';
import { ModalComponent } from '@components/modal/modal.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { SpinnerComponent } from '@components/spinner/spinner.component';
import { LinkComponent } from '@components/link/link.component';
import { QrMfaComponent } from '@components/qr-mfa/qr-mfa.component';
import { ArrowComponent } from '@components/arrow/arrow.component';
import { TextareaComponent } from '@components/textarea/textarea.component';
import { SocialLinkComponent } from '@components/social-link/social-link.component';
import { AssetSelectorComponent } from '@components/asset-selector/asset-selector.component';
import { HtmlEditorComponent } from '@components/html-editor/html-editor.component';

const components: any = [
  ButtonComponent,
  CheckboxComponent,
  DropdownComponent,
  InputComponent,
  InputMfaComponent,
  ModalComponent,
  PaginationComponent,
  SpinnerComponent,
  LinkComponent,
  QrMfaComponent,
  ArrowComponent,
  TextareaComponent,
  SocialLinkComponent,
  AssetSelectorComponent,
  HtmlEditorComponent
];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, NgOptimizedImage, FormsModule, NgxEditorModule],
  exports: [...components]
})
export class BasicComponentsModule {}
