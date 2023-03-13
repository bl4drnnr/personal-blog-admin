import { Injectable } from '@nestjs/common';
import { ProxyHttpService } from '@shared/http.service';

@Injectable()
export class ProxyService {
  constructor(private proxyHttpService: ProxyHttpService) {}

  async proxyAction() {
    return await this.proxyHttpService.proxyRequest();
  }
}
