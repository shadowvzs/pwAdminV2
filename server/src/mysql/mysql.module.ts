import { Module } from '@nestjs/common';
import { MySQLProvider } from './mysql.provider';

@Module({
  providers: [MySQLProvider],
  exports: [MySQLProvider],
})
export class MySQLModule {}
