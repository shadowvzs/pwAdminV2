import md5 from 'md5';
import { Role } from 'src/auth/interfaces/role';
import { jsDate2MySqlDateTime } from 'src/common/helpers/dateConvert';

export enum Gender {
  Female = 0,
  Male = 1
}

export class User {
  public id: number;
  public name: string;
  public passwd: string;
  public prompt = '';
  public answer = '';
  public truename = '';
  public idnumber = '';
  public email: string;
  public mobilenumber = '';
  public province = '';
  public city = '';
  public phonenumber = '';
  public address = '';
  public postalcode = '12345678';
  public gender: Gender = Gender.Male;
  public birthday = '2000-01-01 00:00:00';
  public creatime = jsDate2MySqlDateTime();
  public qq = '';
  public passwd2: string;
  public role: Role = Role.User;
  public credit = 0;
  public avatar = '';
  public access_token?: string;
  public refresh_token?: string;

  public online?: number;
  public gm?: number;

  public async setPassword(rawPassword: string, username = this.name): Promise<string> {
    this.name = username;
    const hash = `0x${md5(username + rawPassword)}`;
    this.passwd = hash;
    this.passwd2 = hash;
    return hash;  
  }

  public async comparePassword(rawPassword: string): Promise<boolean> {
    const hash = `0x${md5(this.name + rawPassword)}`;
    return hash === this.passwd;
  }
}