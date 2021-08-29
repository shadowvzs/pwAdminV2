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
      // const query = await this.mysqlProvider.execute<User>(`call adduser(:name, :passwd, :prompt, :answer, :truename, :idnumber, :email, :mobilenumber, :province, :city, :phonenumber, :address, :postalcode, :gender, :birthday, :qq, :passwd2)`, user);
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
    const users = await this.mysqlProvider.query<User>(`SELECT users.*, COUNT(auth.userid)>0 as gm,COUNT(point.zoneid) as online FROM users LEFT JOIN auth ON users.id=auth.userid AND auth.zoneid = 1 LEFT JOIN point ON users.id=point.uid AND point.zoneid IS NOT NULL GROUP BY users.id`);
    return users[0].map(entity2Dto);
  }

  async getDetails(value: string | number): Promise<User | undefined> {
    const dbUser = await this.mysqlProvider.findOne<User>(`SELECT users.*, COUNT(auth.userid)>0 as gm,COUNT(point.zoneid) as online FROM users LEFT JOIN auth ON users.id=auth.userid AND auth.zoneid = 1 LEFT JOIN point ON users.id=point.uid AND point.zoneid IS NOT NULL WHERE users.id=? GROUP BY users.id`, [value]);
    const user = dbUser ? Object.assign<User, User>(new User, dbUser) : dbUser;
    return user;
  }

  async updateUser(user: User): Promise<boolean> {
    const newUser = Object.assign(new User(), user);
    if (newUser.passwd) {
      newUser.setPassword(newUser.passwd);
    } else {
      delete newUser.passwd;
      delete newUser.passwd2;
    }
    delete newUser.online;
    delete newUser.gm;
    if (newUser.creatime) { newUser.creatime = newUser.creatime.replace('T', ' ').substr(0, 19); }
    if (newUser.birthday) { newUser.birthday = newUser.birthday.replace('T', ' ').substr(0, 19); }
    const req = this.mysqlProvider.update('users', newUser as Record<string, any>, [[user.id]]);
    return req;
  }
}
