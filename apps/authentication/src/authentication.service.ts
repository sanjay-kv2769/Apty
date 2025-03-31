import { Injectable,UnauthorizedException } from '@nestjs/common';
import { DatabaseService as PrismaService } from 'libs/database/database.service';
import { FirebaseService } from './firebase/firebase.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) { }

  async verifyPhoneOtp(phoneNumber: string, otp: string) {
    if (otp !== '123456') {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Mark phone number as verified
    return this.prisma.parent.updateMany({
      where: { phoneNumber },
      data: { phoneVerified: true },
    });
  }

  async verifyGoogleOrAppleToken(token: string) {
    const decodedToken = await this.firebaseService.verifyIdToken(token);
    const { uid, email, phone_number } = decodedToken;

    let parent = await this.prisma.parent.findUnique({
      where: { firebaseUid: uid },
    });

    if (!parent) {
      parent = await this.prisma.parent.create({
        data: {
          firebaseUid: uid,
          email,
          phoneNumber: phone_number,
          phoneVerified: !!phone_number,
          accountStatus: 'active',
        },
      });
    }

    return parent;
  }
}







