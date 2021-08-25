import { Module } from '@nestjs/common';
import {  ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { CoreModule } from './core/core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MySQLModule } from './mysql/mysql.module';
import { PwServerModule } from './pwServer/pwserver.module';

@Module({
  imports: [  
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client/dist'),
      exclude: ['/api*'],
    }),
    CoreModule, 
    MySQLModule,
    AuthModule, 
    UsersModule,
    PwServerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
