import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { UserModule } from './user.module';


async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(UserModule);

  const configService = appContext.get(ConfigService);

  const userConfig = configService.get('app.user');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: {
        host: userConfig.host,
        port: userConfig.post,
      },
    }
  );

  await app.listen();
}
bootstrap();
