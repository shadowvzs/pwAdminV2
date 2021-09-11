import { Module } from '@nestjs/common';
import { PwServerClientController } from './pwserverclient.controller';
import { PwServerClientProvider } from './pwserverclient.provider';

@Module({
  controllers: [ PwServerClientController ],
  providers: [ PwServerClientProvider ],
  exports: [PwServerClientProvider],
})
export class PwServerClientModule {}
