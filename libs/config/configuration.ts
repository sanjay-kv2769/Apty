import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export default registerAs('app', () => ({

    // gateway: {
    //     port: parseInt(process.env.GATEWAY_PORT ?? '3003', 10),
    // },
    PORT: 8080,

    authentication: {
        host: process.env.AUTH_HOST || 'localhost',
        port: parseInt(process.env.AUTH_PORT ?? '3001', 10),
        transport: Transport.TCP,
    },
    user: {
        host: process.env.USER_HOST || 'localhost',
        port: parseInt(process.env.USER_PORT ?? '3002', 10),
        transport: Transport.TCP,
    },

    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT ?? '5432', 10),
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_DATABASE || 'dbname',
    },
    firebase:{
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }
}));
