import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'libs/config/configuration';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // This makes ConfigModule available globally
    load: [configuration],
  }),],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule { }
