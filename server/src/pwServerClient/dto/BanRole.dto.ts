import { IsInt, IsString } from 'class-validator';
import { BanType } from '../interfaces/common';

export class BanRoleDto {

  @IsInt()
  readonly targetRoleId: number;

  @IsString()
  readonly reason: string;

  @IsInt()
  readonly bannerRoleId: number = -1;

  @IsInt()
  readonly duration: number = 3000;

  @IsInt()
  readonly type: BanType = BanType.Role;
  
}
