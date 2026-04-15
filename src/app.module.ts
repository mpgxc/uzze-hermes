import { LoggerModule } from '@mpgxc/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { envValidationSchema } from 'config/env.validation';
import { HealthModule } from 'health/health.module';
import { NotificationModule } from 'notification/notification.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 30,
      },
    ]),
    NotificationModule,
    HealthModule,
  ],
})
export class AppModule {}

