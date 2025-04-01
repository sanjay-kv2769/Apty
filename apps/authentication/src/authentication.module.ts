import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'libs/config/configuration';
import { DatabaseService as PrismaService } from 'libs/database/database.service';
import { FirebaseService } from './firebase/firebase.service';
import { OtpService } from './Otp/otp.service';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // This makes ConfigModule available globally
    load: [configuration],
  }),],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, PrismaService, FirebaseService, OtpService],
})
export class AuthenticationModule { }
