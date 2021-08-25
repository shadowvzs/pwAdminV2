import { Injectable } from '@nestjs/common';
import { MySQLProvider } from 'src/mysql/mysql.provider';
import { entity2Dto } from './converters/entity2Dto';
import { UserDto } from './dto/User.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  private readonly users: UserDto[];

  constructor(
    private readonly mysqlProvider: MySQLProvider,
  ) {}

  async create(user: User): Promise<User | undefined> {
    try {
      const query = await this.mysqlProvider.query<User>(`call adduser(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        user.name,
        user.passwd,
        user.prompt,
        user.answer,
        user.truename,
        user.idnumber,
        user.email,
        user.mobilenumber,
        user.province,
        user.city,
        user.phonenumber,
        user.address,
        user.postalcode,
        user.gender,
        user.birthday,
        user.qq,
        user.passwd2
      ]);
     if (query[0].affectedRows) {
      return await this.findOne(user.name, 'name');
     }
    } catch (err) {
      throw new Error(err?.sqlMessage);
    }
    throw new Error('Something went wrong');
  }

  async findOne(value: string | number, field = 'id'): Promise<User | undefined> {
    const dbUser = await this.mysqlProvider.findOne<User>(`SELECT * FROM users WHERE ${field}=?`, [value]);
    const user = dbUser ? Object.assign<User, User>(new User, dbUser) : dbUser;
    return user;
  }

  async getList(): Promise<UserDto[]> {
    const users = await this.mysqlProvider.findOne<User[]>(`SELECT * FROM users WHERE`);
    return users.map(entity2Dto);
  }
}
