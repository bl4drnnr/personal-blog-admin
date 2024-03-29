import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from '@components/button/button.component';
import { CheckboxComponent } from '@components/checkbox/checkbox.component';
import { DropdownComponent } from '@components/dropdown/dropdown.component';
import { EmojiComponent } from '@components/emoji/emoji.component';
import { InputComponent } from '@components/input/input.component';
import { InputButtonComponent } from '@components/input-button/input-button.component';
import { InputMfaComponent } from '@components/input-mfa/input-mfa.component';
import { LinkComponent } from '@components/link/link.component';
import { ModalComponent } from '@components/modal/modal.component';
import { SpinnerComponent } from '@components/spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { ModeToggleModule } from '@components/theme-toggle/theme-toggle.module';
import { CopyClipboardDirective } from '@directives/clipboard.directive';
import { QrMfaComponent } from './qr-mfa/qr-mfa.component';
import { ArrowComponent } from './arrow/arrow.component';

const components = [
  ButtonComponent,
  CheckboxComponent,
  DropdownComponent,
  EmojiComponent,
  InputComponent,
  InputButtonComponent,
  InputMfaComponent,
  LinkComponent,
  ModalComponent,
  SpinnerComponent,
  CopyClipboardDirective,
  QrMfaComponent,
  ArrowComponent
];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, NgOptimizedImage, FormsModule, ModeToggleModule],
  exports: [...components]
})
export class BasicComponentsModule {}
