import { Controller, Param, Post, Body, Headers } from '@nestjs/common';
import { ProxyService } from '@proxy/proxy.service';

@Controller('proxy')
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @Post(':controller/:action')
  async proxyAction(
    @Param('controller') controller: string,
    @Param('action') action: string,
    @Body() { method, payload }: { method: string; payload?: object },
    @Headers() headers?: object
  ) {
    return await this.proxyService.proxyAction({
      controller,
      action,
      payload,
      method,
      headers
    });
  }
}
