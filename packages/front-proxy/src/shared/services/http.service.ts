import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiConfigService } from '@shared/config.service';

@Injectable()
export class ProxyHttpService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ApiConfigService
  ) {}

  async proxyRequest() {
    //
  }
}
