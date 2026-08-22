import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import type { NextFunction, Request, Response } from 'express';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './infrastructure/app.module';

// Prisma devuelve ids como BigInt y JSON.stringify no los serializa:
// sin este polyfill toda respuesta con `user.id` lanza TypeError (500).
(BigInt.prototype as unknown as { toJSON: () => number }).toJSON =
  function toJSON() {
    return Number(this);
  };

// La documentación (/docs, /docs-json) queda privada: exige un JWT válido
// por header Bearer o por query param (?token=), para poder abrirla desde
// el navegador tras hacer login.
function docsAuth(jwtService: JwtService) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const bearer = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;
    const queryToken =
      typeof req.query.token === 'string' ? req.query.token : undefined;
    const token = bearer ?? queryToken;

    if (!token) {
      res
        .status(401)
        .send('Token requerido: inicia sesión y abre /docs?token=<jwt>');
      return;
    }

    try {
      jwtService.verify(token);
      next();
    } catch {
      res.status(401).send('Token inválido o expirado');
    }
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Rechaza payloads inválidos con 400 antes de llegar al use-case,
  // y elimina propiedades que no estén en el DTO (whitelist).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('HCM API')
    .setDescription(
      'API del sistema de gestión hospitalaria del Hospital Central de Maracay.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const jwtService = app.get(JwtService);
  app.use(['/docs', '/docs-json'], docsAuth(jwtService));
  app.use('/docs-json', (_req: Request, res: Response) => res.json(document));
  app.use(
    '/docs',
    apiReference({
      url: '/docs-json',
      pageTitle: 'HCM API — Documentación',
    }),
  );

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
