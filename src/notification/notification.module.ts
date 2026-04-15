import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cors from 'cors';
import { MailerModule } from 'mailer/mailer.module';
import { QueueModule } from 'queue/queue.module';
import { NotificationController } from './notification.controller';
import { NotificationMiddleware } from './notification.middleware';

const notificationsHandlerCors = cors({
  origin: ['https://upstash.com'],
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Upstash-Signature'],
});

@Module({
  imports: [QueueModule, MailerModule],
  controllers: [NotificationController],
  providers: [NotificationMiddleware],
})
export class NotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(notificationsHandlerCors, NotificationMiddleware)
      .forRoutes('/notification/handler');
  }
}
