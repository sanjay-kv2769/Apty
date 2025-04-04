import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OtpService } from './Otp/otp.service';
import { AuthenticationService } from './authentication.service';


@Controller()
export class AuthenticationController {
  constructor(private readonly otpService: OtpService,
    private authenticationService: AuthenticationService) { }

  @MessagePattern({ cmd: 'auth_ping' })
  handleAuthPing() {
    return { message: 'Auth microservice is online' };
  }
  // ----------Send OTP----------

  @MessagePattern({ cmd: 'send_otp' })
  async sendOtp(@Payload() payload: { phoneNumber: string }) {
    return this.otpService.sendOtp(payload.phoneNumber);
  }
  // ----------Verify OTP----------

  @MessagePattern({ cmd: 'verify_otp' })
  async verifyPhoneOtp(@Payload() data: { phoneNumber: string; otpCode: string }) {
    return this.otpService.verifyOtp(data.phoneNumber, data.otpCode);
  }
  // ----------Verify Firebase Token----------

  @MessagePattern({ cmd: 'firebase_signin' })
  async verifyGoogleOrAppleToken(@Payload() payload: { idToken: string }) {
    const parent = await this.authenticationService.verifyGoogleOrAppleToken(payload);
    return { success: true, message: 'User authenticated', parent };
  }





}
