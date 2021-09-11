import { IsInt, IsString } from 'class-validator';
import { ChannelType } from '../interfaces/chat';

export class ChatMessageDto {

  @IsString()
  readonly message: string;

  @IsInt()
  readonly channel?: ChannelType;

  @IsInt()
  readonly roleId?: number;

  @IsInt()
  readonly emoticonId?: number = 0;
}
