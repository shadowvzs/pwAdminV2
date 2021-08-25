import { IsInt, IsString } from 'class-validator';
import { Role } from 'src/auth/interfaces/role';

export interface IUserDto {
  readonly id: number;
  readonly username: string;
  readonly access_token?: string;
  readonly refresh_token?: string;
  readonly role: Role;
}

export class UserDto {
  @IsInt()
  readonly id: number;

  @IsString()
  readonly username: string;

  @IsString()
  readonly access_token?: string;

  @IsString()
  readonly refresh_token?: string;

  @IsString()
  readonly role: Role;
}
