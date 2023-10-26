import { LoggerService } from '@mpgxc/logger';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  const config = await app.resolve(ConfigService);
  const logger = await app.resolve(LoggerService);

  await app.listen(config.getOrThrow('PORT'));

  logger.debug(`Server running on: ${await app.getUrl()}`);
})();
