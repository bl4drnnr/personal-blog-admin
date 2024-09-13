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

type EndpointsType =
  | AuthEndpoint
  | RecoveryEndpoint
  | SecurityEndpoint
  | UsersEndpoint
  | ConfirmationHashEndpoint
  | ArticlesEndpoint
  | CategoriesEndpoint
  | AuthorsEndpoint
  | CertificationEndpoint;

export interface ProxyRequestInterface {
  controller: Controller;
  action: EndpointsType;
  method: Method;
  payload?: object;
  params?: any;
}
