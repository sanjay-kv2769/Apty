import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import configuration from 'libs/config/configuration';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // Makes configuration available globally
    load: [configuration], // Loads the configuration.ts file
  }),
  ClientsModule.register([
    {
      name: 'AUTH_SERVICE',
      transport: Transport.TCP,
      options: { host: process.env.AUTH_HOST || 'localhost', port: parseInt(process.env.AUTH_PORT ?? '3001', 10) },
    },
    {
      name: 'USER_SERVICE',
      transport: Transport.TCP,
      options: { host: process.env.USER_HOST || 'localhost', port: parseInt(process.env.USER_PORT ?? '3002', 10) },
    },
  ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule { }
