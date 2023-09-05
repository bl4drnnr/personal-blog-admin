import { Controller } from '@interfaces/controller.enum';
import { Method } from '@interfaces/methods.enum';
import { AuthEndpoint } from '@interfaces/auth.enum';

type EndpointsType = AuthEndpoint;

export interface ProxyRequestInterface {
  controller: Controller;
  action: EndpointsType;
  method: Method;
  payload?: object;
  params?: object;
  accessToken?: string;
}
