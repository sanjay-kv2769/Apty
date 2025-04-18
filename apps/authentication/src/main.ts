import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthenticationModule } from './authentication.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AuthenticationModule);

  const configService = appContext.get(ConfigService);
  const authConfig = configService.get('app.authentication'); 
 
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthenticationModule,
    {
      transport: Transport.TCP,
      options: {
        host: authConfig.host,  
        port: authConfig.port, 
      },
    }
  );
  console.log(`Authentication service running on ${authConfig.host}:${authConfig.port}`); 

  await app.listen();
}
bootstrap();
