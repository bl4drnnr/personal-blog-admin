import { Injectable } from '@nestjs/common';
import { ProxyHttpService } from '@shared/http.service';

@Injectable()
export class ProxyService {
  constructor(private proxyHttpService: ProxyHttpService) {}

  async proxyAction({
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
    return await this.proxyHttpService.proxyRequest({
      controller,
      action,
      payload,
      method,
      headers
    });
  }
}
