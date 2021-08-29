import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MySQLModule } from 'src/mysql/mysql.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { TokenService } from './tokens.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MySQLModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    TokenService,
    LocalStrategy, 
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
