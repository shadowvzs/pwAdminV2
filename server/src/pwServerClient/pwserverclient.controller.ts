import { Controller, Get } from '@nestjs/common';
import { ChatMessageDto } from './dto/ChatMessage.dto';
import { ChannelType } from './interfaces/chat';
import { PwServerClientProvider } from './pwserverclient.provider';

// used only for faster test and it will be removed later
@Controller('pwserverclient')
export class PwServerClientController {
  constructor(private readonly pwServerClientProvider: PwServerClientProvider) {}

  @Get('msg')
  async sendMessage(): Promise<any> {
    const c = new ChatMessageDto();
    Object.assign(c, { 
      roleId: -1,
      message: 'my message',
      channel: ChannelType.World
    });

    const u = await this.pwServerClientProvider.sendChatMessage(c);
		return u;
  }

  @Get('online')
  async getOnline(): Promise<any> {
    return this.pwServerClientProvider.getOnlineList(1040);
  }
}
