import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/auth/interfaces/role';

@Injectable()
export class UserUpdateGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const oldUser = request.user; // it's undefined
    const newUser = request.body;
    // if user edit his own data and not moderator then he cannot edit his id, name, role
    // if user is not admin then cannot edit password, id, role, email for other users
    if (oldUser.id !== newUser.id && (
      newUser.role < Role.Moderator || (
        newUser.role < Role.Admin &&
        (
          newUser.passwd.length > 0 ||
          newUser.id !== oldUser.id ||
          newUser.role !== oldUser.role ||
          newUser.email !== oldUser.email
        )
      )
    ) || (
      oldUser.id !== newUser.id &&
      newUser.role < Role.Moderator &&
      (
        newUser.role !== oldUser.role ||
        oldUser.id !== newUser.id ||
        oldUser.name !== newUser.name
      )
    )) {        
      return false;
    }

    // cannot change the username (name) without giving a new password
    if (oldUser.name !== newUser.name && newUser.passwd === '') {
      return false;
    }

    return true;
  }
}