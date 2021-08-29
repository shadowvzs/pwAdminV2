import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from '../constants';
import { AccessTokenPayload } from '../interfaces/token';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private usersService: UsersService;

  constructor(usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      signOptions: { expiresIn: '5m' },
    });
  
    this.usersService = usersService;
  }

  async validate(payload: AccessTokenPayload): Promise<User> {
    const { sub: id } = payload;
    const user = await this.usersService.findOne(+id);
    if (!user) { return null; }
    return user;
  }
}
