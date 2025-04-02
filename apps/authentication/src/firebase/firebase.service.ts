import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
    private firebaseApp: admin.app.App;

    constructor() {
        if (!admin.apps.length) {
            this.firebaseApp = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID || '',
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
                }),
            });
        } else {
            this.firebaseApp = admin.app();
        }
    }

    async verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
        try {
            this.firebaseApp.auth().verifyIdToken(token).then((data) => {
                console.log('decodedToken:', data);
            })
            return await this.firebaseApp.auth().verifyIdToken(token);
        } catch (error) {
            console.error('Firebase token verification failed:', error);
            throw new UnauthorizedException('Invalid Firebase tokennnnnn');
        }
    }
}
