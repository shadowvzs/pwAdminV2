import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: string, user: User, info: Error): any {
      console.log(err,user,info)
        if (err || info || !user) {
          throw err || info || new UnauthorizedException();
        }
    
        return user;
    }
}
