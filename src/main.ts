import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from "rxjs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT);
}
bootstrap();
