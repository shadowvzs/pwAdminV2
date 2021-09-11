import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {

  constructor(private configService: ConfigService) {}

  @Get('runtime')
  public runtime(): void {
    return this.configService.get('WEB_VERSION');
  }

}

