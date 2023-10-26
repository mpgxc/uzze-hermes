import { Module } from '@nestjs/common';
import { QueueProvider } from 'queue/queue.interface';
import { QStashService } from './qstash/qstash.service';

export const QueueContainerInject = Object.freeze({
  QueueProvider: {
    provide: QueueProvider,
    useClass: QStashService,
  },
});

@Module({
  providers: [QueueContainerInject.QueueProvider],
  exports: [QueueContainerInject.QueueProvider],
})
export class QueueModule {}
