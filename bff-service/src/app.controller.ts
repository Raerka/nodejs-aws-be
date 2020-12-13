import { Controller, All, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @All('/:service')
  process(@Param('service') service, @Req() request) {
    return this.appService.process(service, request);
  }
}
