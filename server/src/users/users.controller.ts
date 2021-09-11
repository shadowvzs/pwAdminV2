import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UsersService } from './users.service';
import { UserDto } from './dto/User.dto';
import { Role } from 'src/auth/interfaces/role';
import { User } from './entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserUpdateGuard } from './guards/user.update.guard';
import { AddGoldDto } from './dto/AddGold.dto';
import { PwServerClientProvider } from 'src/pwServerClient/pwserverclient.provider';
import { UserRoleItem } from 'src/pwServerClient/interfaces/role-list';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly pwServerClientProvider: PwServerClientProvider,
  ) {}

  @Get()
  @Roles(Role.Moderator, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getList(): Promise<UserDto[]> {
    return this.usersService.getList();
  }

  @Get(':id')
  @Roles(Role.Moderator, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async get(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
    const user = await this.usersService.getDetails(id);
    delete user.passwd;
    delete user.passwd2;
    return user;
  }

  @Delete(':id')
  @Roles(Role.Moderator, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    await this.usersService.delete(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, UserUpdateGuard)
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() user: User
  ): Promise<User> {
    this.usersService.updateUser(user);
    return await this.usersService.getDetails(id);
  }


  @Post('gold')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addGoldToUser(@Body() addGoldDto: AddGoldDto): Promise<boolean> {
    return this.usersService.addGoldToUser(addGoldDto);
  }

  @Put('gm/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async promoteToGM(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
    return this.usersService.promoteToGM(id);
  }

  @Delete('gm/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async demoteFromGM(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
    return this.usersService.demoteFromGM(id);
  }

  @Get('info/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)  
  async getInfo(@Param('id', new ParseIntPipe()) id: number): Promise<any> {
    // include last active role, current gold on user account
    const userInfo = await this.pwServerClientProvider.getInfo(id);
		return userInfo;
  }

  @Get('roles/:id')
  @UseGuards(JwtAuthGuard)
  async getRoleList(@Param('id', new ParseIntPipe()) id: number): Promise<UserRoleItem[]> {
    // list the roles
    const userRoles = await this.pwServerClientProvider.getRoleList(id);
		return userRoles;
  }

  @Post('set-gold/:id/:gold')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)  
  async setGold(@Body() addGoldDto: AddGoldDto): Promise<any> {
    const u = await this.pwServerClientProvider.setGold(addGoldDto);
		return u;
  }
}

