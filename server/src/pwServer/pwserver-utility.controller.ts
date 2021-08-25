import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
// import { Role } from 'src/auth/interfaces/types';
// import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
// import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { Config, ServerStatus } from './interfaces/serverStatus';
import { PwServerUtilityService } from './pwserver-utility.service';


// @UseGuards(RolesGuard)
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
