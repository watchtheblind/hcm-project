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

// Lee una cookie de forma manual (evita depender de cookie-parser solo
// para esto).
function getCookie(req: Request, name: string): string | undefined {
  const raw = req.headers.cookie;
  if (!raw) return undefined;
  for (const part of raw.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return undefined;
}

// La documentación (/docs, /docs-json) queda privada: exige un JWT válido
// por header Bearer, query param (?token=) o cookie docs_token. La cookie
// existe porque el fetch interno de Scalar hacia /docs-json sale desde el
// navegador sin headers propios: al abrir /docs?token=..., dejamos el JWT
// en una cookie same-origin para que ese fetch pase el guard.
function docsAuth(jwtService: JwtService) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const bearer = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;
    const queryToken =
      typeof req.query.token === 'string' ? req.query.token : undefined;
    const token = bearer ?? queryToken ?? getCookie(req, 'docs_token');

    if (!token) {
      res
        .status(401)
        .send('Token requerido: inicia sesión y abre /docs?token=<jwt>');
      return;
    }

    try {
      jwtService.verify(token);
      // Al entrar con ?token= (o Bearer) dejamos la cookie para que el
      // fetch interno de Scalar hacia /docs-json pase sin headers.
      if ((queryToken || bearer) && !getCookie(req, 'docs_token')) {
        res.cookie('docs_token', token, {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 8 * 60 * 60 * 1000,
        });
      }
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
