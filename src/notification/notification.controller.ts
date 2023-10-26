import { LoggerInject, LoggerService } from '@mpgxc/logger';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { QueueProvider } from 'queue/queue.interface';

@Controller('notification')
export class NotificationController {
  constructor(
    @Inject(QueueProvider)
    private readonly queue: QueueProvider,

    @LoggerInject(NotificationController.name)
    private readonly logger: LoggerService,
  ) {}

  @Post('publish')
  async sendMessage() {
    await this.queue.publishMessage({
      message: 'Hello World',
    });

    this.logger.log('Message published');
  }

  @Post('handler')
  async sendMessageHandler(@Body() body: any) {
    this.logger.log('Message received: ', body);
  }
}
