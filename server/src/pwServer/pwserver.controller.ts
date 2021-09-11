import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/interfaces/role';
import { Roles } from 'src/common/decorators/roles.decorator';
// import { Role } from 'src/auth/interfaces/types';
// import { Roles } from '../common/decorators/roles.decorator';
// import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { Config, ServerStatus } from './interfaces/serverStatus';
import { PwServerService } from './pwserver.service';

@Controller('pwserver')
export class PwServerController {
  constructor(private readonly pwService: PwServerService) {}

  @Get('statuses')
  async statuses(): Promise<ServerStatus[]> {
    return this.pwService.getStatuses();
  }

  @Get('configs')
  async configs(): Promise<Config[]> {
    return this.pwService.getConfigs();
  }

  @Get('static-data/:name')
  @Roles(Role.Moderator, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)  
  async getStaticData(@Param('name') name: string): Promise<Config[]> {
    return this.pwService.getStaticData(name);
  }
}
