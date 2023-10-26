/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoggerInject, LoggerService } from '@mpgxc/logger';
import { Body, Controller, Post } from '@nestjs/common';
import { MailerProvider } from 'mailer/mailer.interface';
import { QueueProvider } from 'queue/queue.interface';

@Controller('notification')
export class NotificationController {
  constructor(
    @LoggerInject(NotificationController.name)
    private readonly logger: LoggerService,
    private readonly queue: QueueProvider,
    private readonly mailer: MailerProvider,
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
    await this.mailer.sendMail({
      to: 'Recipient <recipient@example.com>',
      from: 'Sender Name <sender@example.com>',
      subject: 'Nodemailer is unicode friendly ✔ - from my NestJS app',
      text: 'Hello to myself!',
      html: '<p><b>Hello</b> to myself!</p>',
    });
  }
}
