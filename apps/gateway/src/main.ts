import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  const port = process.env.PORT || 3000;
  console.log(`Gateway API running on http://localhost:${port}`)

  await app.listen(port);
}
bootstrap();
