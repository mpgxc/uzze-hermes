import { LoggerModule } from '@mpgxc/logger';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationMiddleware } from 'notification/notification.moddleware';
import { NotificationController } from './notification/notification.controller';
import { QueueModule } from './queue/queue.module';

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
    consumer.apply(NotificationMiddleware).forRoutes('/notification/handler');
  }
}
