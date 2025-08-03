import { Controller } from '@interfaces/controller.enum';
import { Method } from '@interfaces/methods.enum';
import { AuthEndpoint } from '@interfaces/auth.enum';
import { RecoveryEndpoint } from '@interfaces/recovery.enum';
import { SecurityEndpoint } from '@interfaces/security.enum';
import { UsersEndpoint } from '@interfaces/users.enum';
import { ConfirmationHashEndpoint } from '@interfaces/confirmation-hash.enum';
import { ArticlesEndpoint } from '@interfaces/articles.enum';
import { CategoriesEndpoint } from '@interfaces/categories.enum';
import { AuthorsEndpoint } from '@interfaces/authors.enum';
import { CertificationEndpoint } from '@interfaces/certifications.enum';
import { ExperienceEndpoint } from '@interfaces/experience.enum';
import { SocialEndpoint } from '@interfaces/socials.enum';
import { ChangelogEndpoint } from '@interfaces/changelog.enum';
import { StaticAssetsEndpoint } from '@interfaces/static-assets.enum';
import { SiteConfigEndpoint } from '@interfaces/site-config.enum';
import { AboutEndpoint } from '@interfaces/about.enum';
import { LicenseEndpoint } from '@interfaces/license.enum';
import { PrivacyEndpoint } from '@interfaces/privacy.enum';
import { PagesEndpoint } from '@interfaces/pages.enum';

type EndpointsType =
  | AuthEndpoint
  | RecoveryEndpoint
  | SecurityEndpoint
  | UsersEndpoint
  | ConfirmationHashEndpoint
  | ArticlesEndpoint
  | CategoriesEndpoint
  | AuthorsEndpoint
  | CertificationEndpoint
  | ExperienceEndpoint
  | SocialEndpoint
  | ChangelogEndpoint
  | StaticAssetsEndpoint
  | SiteConfigEndpoint
  | AboutEndpoint
  | LicenseEndpoint
  | PrivacyEndpoint
  | PagesEndpoint;

export interface ProxyRequestInterface {
  controller: Controller;
  action: EndpointsType;
  method: Method;
  payload?: object;
  params?: any;
  isFileUpload?: boolean;
}
