import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/interfaces/role';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/users/entity/user.entity';
import { AddGoldDto } from './dto/AddGold.dto';
import { PwServerActionService } from './pwserver-actions.service';

@Controller('pwserver-actions')
export class PwServerActionController {
  constructor(private readonly pwService: PwServerActionService) {}

  @Post('gold')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addGoldToUser(@Body() addGoldDto: AddGoldDto): Promise<boolean> {
    return this.pwService.addGoldToUser(addGoldDto);
  }

  @Put('gm/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async promoteToGM(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
    return this.pwService.promoteToGM(id);
  }

  @Delete('gm/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async demoteFromGM(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
    return this.pwService.demoteFromGM(id);
  }

  // @Get('configs')
  // async configs(): Promise<Config[]> {
  //   return this.pwService.getConfigs();
  // }

}
