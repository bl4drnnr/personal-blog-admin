import { Controller } from '@interfaces/controller.enum';
import { Method } from '@interfaces/methods.enum';
import { AuthEndpoint } from '@interfaces/auth.enum';
import { ConfirmationHashEndpoint } from '@interfaces/confirmation-hash.enum';
import { SecurityEndpoint } from '@interfaces/security.enum';
import { RecoveryEndpoint } from '@interfaces/recovery.enum';
import { PostsEndpoint } from '@interfaces/posts.enum';

type EndpointsType =
  | AuthEndpoint
  | ConfirmationHashEndpoint
  | SecurityEndpoint
  | RecoveryEndpoint
  | PostsEndpoint;

export interface ProxyRequestInterface {
  controller: Controller;
  action: EndpointsType;
  method: Method;
  payload?: object;
  params?: object;
  accessToken?: string;
}
