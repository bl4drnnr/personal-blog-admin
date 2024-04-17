import { Controller } from '@interfaces/controller.enum';
import { Method } from '@interfaces/methods.enum';
import { AuthEndpoint } from '@interfaces/auth.enum';
import { RecoveryEndpoint } from '@interfaces/recovery.enum';
import { SecurityEndpoint } from '@interfaces/security.enum';

type EndpointsType = AuthEndpoint | RecoveryEndpoint | SecurityEndpoint;

export interface ProxyRequestInterface {
  controller: Controller;
  action: EndpointsType;
  method: Method;
  payload?: object;
  params?: object;
}
