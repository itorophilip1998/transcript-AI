import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.debug('Listening on port:', process.env.PORT);
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
