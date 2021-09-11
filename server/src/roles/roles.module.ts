import { Module } from '@nestjs/common';
import { MySQLModule } from 'src/mysql/mysql.module';
import { PwServerClientModule } from 'src/pwServerClient/pwserverclient.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [
    MySQLModule,
    PwServerClientModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
