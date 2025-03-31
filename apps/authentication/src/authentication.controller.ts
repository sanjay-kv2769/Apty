import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DatabaseService as PrismaService } from 'libs/database/database.service';
import { FirebaseService } from './firebase/firebase.service';
import { OtpService } from './Otp/otp.service';
import { AuthenticationService } from './authentication.service';


@Controller()
export class AuthenticationController {
  constructor(private readonly otpService: OtpService,
    private readonly firebaseService: FirebaseService,
    private readonly prisma: PrismaService) { }
  private authenticationService: AuthenticationService


  @MessagePattern({ cmd: 'send-otp' })
  async sendOtp(@Payload() phoneNumber: string) {
    return this.otpService.sendOtp(phoneNumber);
  }

  @MessagePattern({ cmd: 'verify-otp' })
  async verifyPhoneOtp(@Payload() data: { phoneNumber: string; otpCode: string }) {
    return this.otpService.verifyOtp(data.phoneNumber, data.otpCode);
  }
  @MessagePattern({ cmd: 'firebase-signin' })
  async verifyGoogleOrAppleToken(@Payload() idToken: string) {
    const parent = await this.authenticationService.verifyGoogleOrAppleToken(idToken);
    return { success: true, message: 'User authenticated', parent };
  }



}
