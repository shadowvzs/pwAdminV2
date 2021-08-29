import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(private readonly reflector: Reflector) {
      super();
    }

    handleRequest(err: string, user: User, info: Error): any {
        if (err || info || !user) {
          throw err || info || new UnauthorizedException();
        }
    
        return user;
    }
}
