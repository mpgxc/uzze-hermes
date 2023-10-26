import { LoggerModule } from '@mpgxc/logger';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as cors from 'cors';
import { NotificationMiddleware } from 'notification/notification.middleware';
import { NotificationController } from './notification/notification.controller';
import { QueueModule } from './queue/queue.module';

const notificationsHandlerCors = cors({
  origin: ['https://upstash.com'],
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Upstash-Signature'],
});

@Module({
  imports: [
    LoggerModule.forRoot({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    QueueModule,
  ],
  controllers: [NotificationController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(notificationsHandlerCors, NotificationMiddleware)
      .forRoutes('/notification/handler');
  }
}
