import { Module } from '@nestjs/common';
import { MySQLModule } from 'src/mysql/mysql.module';
import { PwServerClientModule } from 'src/pwServerClient/pwserverclient.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MySQLModule,
    PwServerClientModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
