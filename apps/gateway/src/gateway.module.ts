import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import configuration from 'libs/config/configuration';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // Makes configuration available globally
    load: [configuration], // Loads the configuration.ts file
  }),],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule { }
