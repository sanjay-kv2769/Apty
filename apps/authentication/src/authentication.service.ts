import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService as PrismaService } from 'libs/database/database.service';
import { FirebaseService } from './firebase/firebase.service';
import { v4 as uuid } from 'uuid';
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) { }

  async verifyGoogleOrAppleToken(tokenObj: { idToken: string }) {
    try {

      const token = tokenObj.idToken
      const decodedToken = await this.firebaseService.verifyIdToken(token);
      const { uid, email, phone_number } = decodedToken;

      let parent = await this.prisma.parent.findUnique({
        where: { firebaseUid: uid },
      });

      if (!parent) {
        const parentId = uuid();
        // console.log("uuidv4", parentId);

        parent = await this.prisma.parent.create({
          data: {
            id: parentId,
            firebaseUid: uid,
            email,
            phoneNumber: phone_number,
            phoneVerified: !!phone_number,
            accountStatus: 'active',
          },
        });
      }

      // Upsert ParentAuthMethod
      await this.prisma.parentAuthMethod.upsert({
        where: {
          parentId_methodType_providerId: {
            parentId: parent.id,
            methodType: decodedToken.firebase?.sign_in_provider, // or 'apple', from token:decodedToken.firebase?.sign_in_provider 
            providerId: uid,
          },
        },
        update: {
          isVerified: true,
          isPrimary: true,
        },
        create: {
          id: uuid(),
          parentId: parent.id,
          methodType: decodedToken.firebase?.sign_in_provider, // 'google' or 'apple'
          providerId: uid,
          isVerified: true,
          isPrimary: true,
        },
      });

      return parent;
    } catch (error) {
      console.error('Firebase authentication error:', error);
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

}







