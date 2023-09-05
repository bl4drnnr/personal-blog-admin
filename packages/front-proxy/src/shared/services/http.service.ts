import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiConfigService } from '@shared/config.service';
import { AxiosRequestConfig } from 'axios';
import { UnhandledEndpointException } from '@exceptions/unhandled-endpoint.exception';
import { ProxyActionPayloadInterface } from '@interfaces/proxy-action-payload.interface';

@Injectable()
export class ProxyHttpService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ApiConfigService
  ) {}

  async proxyRequest({
    controller,
    action,
    payload,
    method,
    params,
    accessToken,
    cookies
  }: ProxyActionPayloadInterface): Promise<object> {
    const allowedMethods = this.configService.allowedRequestMethods;
    const allowedControllers = this.configService.allowedControllers;
    const allowedEndpoints = this.configService.allowedEndpoints;

    const originApiUrl = this.configService.originApiUrl;

    if (
      !allowedMethods.includes(method) ||
      !allowedEndpoints.includes(action) ||
      !allowedControllers.includes(controller)
    ) {
      throw new UnhandledEndpointException();
    }

    const { username, password } = this.configService.basicAuthConfig;

    const requestUrl = `${originApiUrl}/${controller}/${action}`;
    const basicAuth = 'Basic ' + btoa(username + ':' + password);

    const requestConfig: AxiosRequestConfig = {
      method,
      url: requestUrl,
      headers: {
        'Content-Type': 'application/json',
        authorization: basicAuth
      }
    };

    const bodySupportMethod = ['POST', 'PATCH', 'DELETE'];

    requestConfig.data = bodySupportMethod.includes(method) ? payload : {};
    requestConfig.params = params ? params : {};

    if (accessToken) requestConfig.headers['X-Access-Token'] = accessToken;
    if (cookies) requestConfig.headers.cookie = cookies;

    return new Promise((resolve, reject) => {
      this.httpService.request(requestConfig).subscribe({
        next: (res) => {
          resolve(res.data);
        },
        error: async (error: any) => {
          let errorMessage = error.response?.data;

          try {
            errorMessage = { messages: JSON.parse(errorMessage.message) };
          } catch (e) {
            errorMessage = error.response?.data;
          }

          reject(
            new HttpException(
              errorMessage || 'internal-server-error',
              error.response?.data?.statusCode || 500
            )
          );
        }
      });
    });
  }
}
