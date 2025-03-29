import { Injectable } from '@nestjs/common';
import { DatabaseService as PrismaService } from 'libs/database/database.service';
import { OtpVerification } from '@prisma/client';
import { addMinutes } from 'date-fns';


@Injectable()
export class OtpService {
    constructor(private prisma: PrismaService) { }

    async sendOtp(phoneNumber: string) {
        const otpCode = '123456'; // Static for now
        const expiresAt = addMinutes(new Date(), 5);

        await this.prisma.otpVerification.upsert({
            where: { phoneNumber },
            update: { otpCode, expiresAt, verified: false },
            create: { phoneNumber, otpCode, expiresAt, verified: false, purpose: 'login' },
        });

        return { message: 'OTP sent successfully', otpCode }; // Remove `otpCode` in production
    }

    async verifyOtp(phoneNumber: string, otpCode: string) {
        const otpEntry = await this.prisma.otpVerification.findFirst({
            where: { phoneNumber, otpCode, verified: false },
        });

        if (!otpEntry || otpEntry.otpCode !== '123456') {
            return { success: false, message: 'Invalid OTP' };
        }

        await this.prisma.otpVerification.update({
            where: { id: otpEntry.id },
            data: { verified: true },
        });

        await this.prisma.parent.update({
            where: { phoneNumber },
            data: { phoneVerified: true },
        });

        return { success: true, message: 'Phone number verified successfully' };
    }
}
