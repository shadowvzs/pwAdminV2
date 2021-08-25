import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get('test')
  public test(): string {
    return 'rest';
  }

}

