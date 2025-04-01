import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'libs/config/configuration';
import { DatabaseService as PrismaService } from 'libs/database/database.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
  }),],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule { }
