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
    @Headers('registration-authorization') signUpApiAuthToken?: string
  ) {
    console.log({
      controller,
      action,
      payload,
      method,
      signUpApiAuthToken
    });
    return await this.proxyService.proxyAction({
      controller,
      action,
      payload,
      method,
      signUpApiAuthToken
    });
  }
}
