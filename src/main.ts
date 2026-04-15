import { LoggerService } from '@mpgxc/logger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule);

  const config = await app.resolve(ConfigService);
  const logger = await app.resolve(LoggerService);

  const allowedOrigins = config
    .get<string>('ALLOWED_ORIGINS', '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    methods: ['GET', 'POST'],
  });

  app.use(helmet());
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = config.getOrThrow<number>('PORT');
  await app.listen(port);

  const server = app.getHttpServer();
  server.keepAliveTimeout = 75_000;
  server.headersTimeout = 76_000;

  logger.debug(`Server running on: ${await app.getUrl()}`);
})();

