import { registerAs } from '@nestjs/config'
import { Transport } from '@nestjs/microservices';


export default registerAs('app', () => ({

    authentication: {
        host: process.env.AUTH_HOST || 'localhost',
        port: parseInt(process.env.AUTH_PORT, 10) || 5432,
        transport: Transport.TCP,
    },
    user: {
        host: process.env.USER_HOST || 'localhost',
        port: parseInt(process.env.USER_PORT, 10) || 3001,
        transport: Transport.TCP,

    },
    database: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 3002,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    },
}));


