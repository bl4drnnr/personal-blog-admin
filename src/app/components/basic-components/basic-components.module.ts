import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@components/button/button.component';
import { CheckboxComponent } from '@components/checkbox/checkbox.component';
import { DropdownComponent } from '@components/dropdown/dropdown.component';
import { InputComponent } from '@components/input/input.component';
import { InputMfaComponent } from '@components/input-mfa/input-mfa.component';
import { ModalComponent } from '@components/modal/modal.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { SpinnerComponent } from '@components/spinner/spinner.component';
import { LinkComponent } from '@components/link/link.component';
import { EmojiComponent } from '@components/emoji/emoji.component';
import { QrMfaComponent } from '@components/qr-mfa/qr-mfa.component';
import { ArrowComponent } from '@components/arrow/arrow.component';
import { TextareaComponent } from '@components/textarea/textarea.component';
import { ChangeLanguageComponent } from '@components/change-language/change-language.component';
import { TranslocoModule } from '@ngneat/transloco';

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
  EmojiComponent,
  QrMfaComponent,
  ArrowComponent,
  TextareaComponent,
  ChangeLanguageComponent
];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, NgOptimizedImage, FormsModule, TranslocoModule],
  exports: [...components]
})
export class BasicComponentsModule {}
