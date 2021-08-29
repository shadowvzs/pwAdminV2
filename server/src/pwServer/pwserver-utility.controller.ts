import { Controller, Get } from '@nestjs/common';
// import { Role } from 'src/auth/interfaces/types';
// import { Roles } from '../common/decorators/roles.decorator';
// import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { Config, ServerStatus } from './interfaces/serverStatus';
import { PwServerUtilityService } from './pwserver-utility.service';

@Controller('pwserver-utility')
export class PwServerUtilityController {
  constructor(private readonly pwService: PwServerUtilityService) {}

  @Get('statuses')
  async statuses(): Promise<ServerStatus[]> {
    return this.pwService.getStatuses();
  }

  @Get('configs')
  async configs(): Promise<Config[]> {
    return this.pwService.getConfigs();
  }

}
