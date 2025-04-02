import { Injectable } from '@nestjs/common';
import { DatabaseService as PrismaService } from 'libs/database/database.service';
import { addMinutes } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class OtpService {
    constructor(private prisma: PrismaService) { }

    async sendOtp(phoneNumber: string) {
        const otpCode = '1234567';
        const expiresAt = addMinutes(new Date(), 5);
        const otpVerificationId = uuid();

        const otpVerification = await this.prisma.otpVerification.upsert({
            where: { phoneNumber },
            update: { otpCode, expiresAt, verified: false },
            create: { id: otpVerificationId, phoneNumber, otpCode, expiresAt, verified: false, purpose: 'login' },
        });
        return { message: 'OTP sent successfully', otpCode };
    }

    async verifyOtp(phoneNumber: string, otpCode: string) {
        // Finding OTP in DB
        const otpEntry = await this.prisma.otpVerification.findFirst({
            where: { phoneNumber, otpCode, verified: false },
        });

        // Verifying OTP
        if (!otpEntry || otpEntry.otpCode !== otpCode) {
            throw new RpcException('Invalid OTP')
            // return { success: false, message: 'Invalid OTP' };
        }

        // Phone number verification
        await this.prisma.otpVerification.update({
            where: { id: otpEntry.id },
            data: { verified: true },
        });

        // Creating new parent
        let parent = await this.prisma.parent.findUnique({
            where: { phoneNumber: phoneNumber },
        });

        if (!parent) {
            const parentId = uuid();
            parent = await this.prisma.parent.create({
                data: {
                    id: parentId,
                    phoneNumber: phoneNumber,
                    phoneVerified: true,
                    accountStatus: 'active',
                },
            });
        }

        //  Upsert ParentAuthMethod
        await this.prisma.parentAuthMethod.upsert({
            where: {
                parentId_methodType_providerId: {
                    parentId: parent.id,
                    methodType: 'otp',
                    providerId: phoneNumber,
                },
            },
            update: {
                isVerified: true,
                isPrimary: true,
            },
            create: {
                id: uuid(),
                parentId: parent.id,
                methodType: 'otp',
                providerId: phoneNumber,
                isVerified: true,
                isPrimary: true,
            },
        });

        return { success: true, message: 'Phone number verified successfully', parent };
    }
}


