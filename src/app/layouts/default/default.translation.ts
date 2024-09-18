import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { MessagesTranslation } from '@translations/messages.enum';
import { ComponentsTranslation } from '@translations/components.enum';
import { CredentialsTranslation } from '@translations/credentials.enum';
import { PageTranslation } from '@translations/pages.enum';

export const DefaultTranslation = {
  provide: TRANSLOCO_SCOPE,
  useValue: [
    {
      scope: MessagesTranslation.ERRORS,
      alias: MessagesTranslation.ERRORS_ALIAS
    },
    {
      scope: MessagesTranslation.RESPONSES,
      alias: MessagesTranslation.RESPONSES_ALIAS
    },
    {
      scope: ComponentsTranslation.MFA,
      alias: ComponentsTranslation.MFA_ALIAS
    },
    {
      scope: ComponentsTranslation.RECOVERY_KEYS,
      alias: ComponentsTranslation.RECOVERY_KEYS_ALIAS
    },
    {
      scope: ComponentsTranslation.DROPDOWN,
      alias: ComponentsTranslation.DROPDOWN_ALIAS
    },
    {
      scope: ComponentsTranslation.LINK,
      alias: ComponentsTranslation.LINK_ALIAS
    },
    {
      scope: ComponentsTranslation.BUTTON,
      alias: ComponentsTranslation.BUTTON_ALIAS
    },
    {
      scope: ComponentsTranslation.INPUT,
      alias: ComponentsTranslation.INPUT_ALIAS
    },
    {
      scope: ComponentsTranslation.SIDEBAR,
      alias: ComponentsTranslation.SIDEBAR_ALIAS
    },
    {
      scope: CredentialsTranslation.REGISTRATION,
      alias: CredentialsTranslation.REGISTRATION_ALIAS
    },
    {
      scope: PageTranslation.ARTICLES,
      alias: PageTranslation.ARTICLES_ALIAS
    },
    {
      scope: PageTranslation.CATEGORIES,
      alias: PageTranslation.CATEGORIES_ALIAS
    },
    {
      scope: PageTranslation.AUTHORS,
      alias: PageTranslation.AUTHORS_ALIAS
    },
    {
      scope: PageTranslation.CERTIFICATION,
      alias: PageTranslation.CERTIFICATION_ALIAS
    },
    {
      scope: PageTranslation.EXPERIENCES,
      alias: PageTranslation.EXPERIENCES_ALIAS
    }
  ]
};
