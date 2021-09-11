import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { MySQLModule } from './mysql/mysql.module';
import { PwServerModule } from './pwServer/pwserver.module';
import { PwServerClientModule } from './pwServerClient/pwserverclient.module';
import configs from './configs/core';

@Module({
  imports: [  
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client/dist'),
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configs]
    }),
    MySQLModule,
    AuthModule, 
    PwServerModule,
    UsersModule,
    RolesModule,
    PwServerClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
