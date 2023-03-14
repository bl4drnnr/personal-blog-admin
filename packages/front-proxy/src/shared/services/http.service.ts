import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiConfigService } from '@shared/config.service';

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
    headers
  }: {
    controller: string;
    action: string;
    payload?: object;
    method: string;
    headers?: object;
  }) {
    const allowedMethods = this.configService.allowedRequestMethods;
    const allowedControllers = this.configService.allowedControllers;
    const allowedEndpoints = this.configService.allowedEndpoints;

    const originApiUrl = this.configService.originApiUrl;

    if (
      !allowedMethods.includes(method) ||
      !allowedEndpoints.includes(action) ||
      !allowedControllers.includes(controller)
    )
      throw new BadRequestException('no-method-controller-or-action');

    const { username, password } = this.configService.basicAuthConfig;

    const requestUrl = `${originApiUrl}/${controller}/${action}`;
    const basicAuth = 'Basic ' + btoa(username + ':' + password);

    headers = { ...headers, 'authorization': basicAuth }

    if (method === 'POST') {
      return this.httpService.post(requestUrl, { ...payload }, { headers });
    } else if (method === 'GET') {
      return this.httpService.get(requestUrl, { headers });
    }
  }
}
