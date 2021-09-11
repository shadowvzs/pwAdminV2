import { Module } from '@nestjs/common';
import { MySQLModule } from 'src/mysql/mysql.module';
import { PwServerClientModule } from 'src/pwServerClient/pwserverclient.module';
import { UsersModule } from 'src/users/users.module';
import { PwServerController } from './pwserver.controller';
import { PwServerService } from './pwserver.service';

@Module({
  imports: [
    UsersModule,
    MySQLModule,
    PwServerClientModule
  ],
  controllers: [
    PwServerController
  ],
  providers: [
    PwServerService
  ],
})
export class PwServerModule {}
