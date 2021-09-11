import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/auth/interfaces/role';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesService } from './roles.service';
import { PwServerClientProvider } from 'src/pwServerClient/pwserverclient.provider';


@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly pwServerClientProvider: PwServerClientProvider
  ) {}

  @Get(':id')
  @Roles(Role.Moderator, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)  
  async getRole(@Param('id', new ParseIntPipe()) id: number): Promise<any> {

    return this.pwServerClientProvider.getRoleBean(id);
  }
}

