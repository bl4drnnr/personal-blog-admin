import { Controller, Post } from '@nestjs/common';
import { ProxyService } from '@proxy/proxy.service';

@Controller('proxy')
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @Post('')
  async proxyAction() {
    return await this.proxyService.proxyAction();
  }
}
