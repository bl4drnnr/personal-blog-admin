import { PageTranslation } from '@translations/pages.enum';
import { MessagesTranslation } from '@translations/messages.enum';
import { CredentialsTranslation } from '@translations/credentials.enum';
import { ComponentsTranslation } from '@translations/components.enum';

export type TranslationType =
  | PageTranslation
  | MessagesTranslation
  | CredentialsTranslation
  | ComponentsTranslation;
