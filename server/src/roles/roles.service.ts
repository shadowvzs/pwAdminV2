import { Injectable } from '@nestjs/common';
import { MySQLProvider } from 'src/mysql/mysql.provider';

@Injectable()
export class RolesService {

  constructor(
    private readonly mysqlProvider: MySQLProvider,
  ) {}
}
