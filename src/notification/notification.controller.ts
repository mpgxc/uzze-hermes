import { LoggerInject, LoggerService } from '@mpgxc/logger';
import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { MailerProvider } from 'mailer/mailer.interface';
import { QueueProvider } from 'queue/queue.interface';
import { NotificationPayload, PublishNotificationDto } from './notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(
    @LoggerInject(NotificationController.name)
    private readonly logger: LoggerService,
    private readonly queue: QueueProvider,
    private readonly mailer: MailerProvider,
  ) {}

  @Post('publish')
  @UseGuards(ThrottlerGuard)
  async sendMessage(@Body() body: PublishNotificationDto) {
    await this.queue.publishMessage(body);

    this.logger.log('Message published');
  }

  @Post('handler')
  async sendMessageHandler(@Body() body: NotificationPayload) {
    try {
      await this.mailer.sendMail({
        to: body.to,
        from: body.from,
        subject: body.subject,
        text: body.text,
        html: body.html ?? body.text,
      });
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to send mail: ${err.message}`, err.stack);
      throw new InternalServerErrorException('Failed to deliver notification');
    }
  }
}

