import { Module } from '@nestjs/common';
import { QStashService } from './qstash/qstash.service';
import { QueueProvider } from './queue.interface';

export const QueueContainerInject = Object.freeze({
  QueueProvider: {
    provide: QueueProvider,
    useExisting: QStashService,
  },
});

@Module({
  providers: [
    QueueContainerInject.QueueProvider.useExisting,
    QueueContainerInject.QueueProvider,
  ],
  exports: [QueueContainerInject.QueueProvider],
})
export class QueueModule {}
