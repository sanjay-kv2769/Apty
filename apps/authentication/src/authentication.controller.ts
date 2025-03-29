import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { DatabaseService as PrismaService } from 'libs/database/database.service';
import { FirebaseService } from './firebase/firebase.service';
import { OtpService } from './Otp/otp.service';


@Controller()
export class AuthenticationController {
  constructor(private readonly otpService: OtpService,
    private readonly firebaseService: FirebaseService,
    private readonly prisma: PrismaService) { }


  @MessagePattern({cmd:'send-otp'})
  async sendOtp(@Payload() phoneNumber: string) {
    return this.otpService.sendOtp(phoneNumber);
  }

  @MessagePattern({cmd:'verify-otp'})
  async verifyPhoneOtp(@Payload() data: { phoneNumber: string; otpCode: string }) {
    return this.otpService.verifyOtp(data.phoneNumber, data.otpCode);
  }

  @MessagePattern({cmd:'firebase-signin'})
  async verifyGoogleOrAppleToken(@Payload() idToken: string) {
    const decodedToken = await this.firebaseService.verifyIdToken(idToken);

    let parent = await this.prisma.parent.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!parent) {
      parent = await this.prisma.parent.create({
        data: {
          firebaseUid: decodedToken.uid,
          email: decodedToken.email,
          phoneNumber: decodedToken.phone_number,
          phoneVerified: !!decodedToken.phone_number,
          passwordHash: '',
          pinHash: '',
        },
      });
    }

    return { success: true, message: 'User authenticated', parent };
  }


// =======================================================================================
  // @Post('send-otp')
  // async sendOtp(@Body('phoneNumber') phoneNumber: string) {
  //   return this.otpService.sendOtp(phoneNumber);
  // }

  // @Post('verify-otp')
  // async verifyOtp(@Body() body: { phoneNumber: string; otpCode: string }) {
  //   return this.otpService.verifyOtp(body.phoneNumber, body.otpCode);
  // }

  // @Post('firebase-signin')
  // async firebaseSignIn(@Body('idToken') idToken: string) {
  //   const decodedToken = await this.firebaseService.verifyIdToken(idToken);

  //   let parent = await this.prisma.parent.findUnique({
  //     where: { firebaseUid: decodedToken.uid },
  //   });

  //   if (!parent) {
  //     parent = await this.prisma.parent.create({
  //       data: {
  //         firebaseUid: decodedToken.uid,
  //         email: decodedToken.email,
  //         phoneNumber: decodedToken.phone_number,
  //         phoneVerified: decodedToken.phone_number ? true : false,
  //         passwordHash: '',
  //         pinHash: '',
  //       },
  //     });
  //   }

  //   return { success: true, message: 'User authenticated', parent };
  // }


  // @MessagePattern({ cmd: 'send_otp' })
  // async handleSendOtp(data: { phoneNumber: string }) {
  //   return this.otpService.sendOtp(data.phoneNumber);
  // }

  // @MessagePattern({ cmd: 'verify_otp' })
  // async handleVerifyOtp(data: { phoneNumber: string; otpCode: string }) {
  //   return this.otpService.verifyOtp(data.phoneNumber, data.otpCode);
  // }

  // @MessagePattern({ cmd: 'firebase_signin' })
  // async handleFirebaseSignIn(data: { idToken: string }) {
  //   return this.firebaseService.verifyIdToken(data.idToken);
  // }



  // @Get('test')
  // testAuth() {
  //   return { message: 'Authentication Service is running!' };
  // }

  // @MessagePattern({ cmd: 'auth_ping' })
  // handleAuthPing() {
  //   return { message: 'Auth microservice is online' };
  // }

  // @MessagePattern({ cmd: 'register' })
  // async register(@Payload() data: { email: string; phoneNumber: string; phoneNumberVerified: boolean; password: string; name: string }) {
  //   return {}
  // }



}
