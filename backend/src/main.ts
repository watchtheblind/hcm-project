import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/app.module';

// Prisma devuelve ids como BigInt y JSON.stringify no los serializa:
// sin este polyfill toda respuesta con `user.id` lanza TypeError (500).
(BigInt.prototype as unknown as { toJSON: () => number }).toJSON =
  function toJSON() {
    return Number(this);
  };

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
