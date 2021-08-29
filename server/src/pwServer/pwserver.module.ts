import { Module } from '@nestjs/common';
import { MySQLModule } from 'src/mysql/mysql.module';
import { UsersModule } from 'src/users/users.module';
import { PwServerActionController } from './pwserver-actions.controller';
import { PwServerActionService } from './pwserver-actions.service';
import { PwServerUtilityController } from './pwserver-utility.controller';
import { PwServerUtilityService } from './pwserver-utility.service';

@Module({
  imports: [
    UsersModule,
    MySQLModule,
  ],
  controllers: [
    PwServerActionController, 
    PwServerUtilityController
  ],
  providers: [
    PwServerActionService,
    PwServerUtilityService
  ],
})
export class PwServerModule {}
