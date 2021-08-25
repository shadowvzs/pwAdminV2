import { Module } from '@nestjs/common';
import { MySQLModule } from 'src/mysql/mysql.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [MySQLModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
