import { Body, Controller, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UsersService } from './users.service';
import { UserDto } from './dto/User.dto';
import { Role } from 'src/auth/interfaces/role';
import { User } from './entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserUpdateGuard } from './guards/user.update.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, UserUpdateGuard)
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() user: User
  ): Promise<User> {
    this.usersService.updateUser(user);
    return await this.usersService.getDetails(id);
  }
}

