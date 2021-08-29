import { IsInt } from 'class-validator';

export class AddGoldDto {

  @IsInt()
  readonly userId: number;

  @IsInt()
  readonly amount: number;
}
