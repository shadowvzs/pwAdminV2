import { Controller, Get, Post, Request } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UsersService } from './users.service';
import { UserDto } from './dto/User.dto';
import { Role } from 'src/auth/interfaces/role';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  async getList(): Promise<UserDto[]> {
    return this.usersService.getList();
  }
}

