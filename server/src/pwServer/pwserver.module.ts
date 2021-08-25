import { Module } from '@nestjs/common';
import { PwServerUtilityController } from './pwserver-utility.controller';
import { PwServerUtilityService } from './pwserver-utility.service';

@Module({
  controllers: [PwServerUtilityController],
  providers: [PwServerUtilityService],
})
export class PwServerModule {}
