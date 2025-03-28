import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        try {
            await this.$connect();
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Database connection failed:', error.message);
            process.exit(1);
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
        console.log('🔌 Database disconnected');
    }
}

// @Injectable()
// export class DatabaseService extends PrismaClient implements
//     OnModuleInit {
//     async onModuleInit() {
//         await this.$connect();
//     }
// }