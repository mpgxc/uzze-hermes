import { LoggerInject } from '@mpgxc/logger';
import { Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import { MailerData, MailerProvider } from './mailer.interface';

@Injectable()
export class NodemailerService implements OnModuleInit, MailerProvider {
  private transporter: Transporter;

  constructor(
    @LoggerInject(NodemailerService.name)
    private readonly logger: LoggerService,

    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    this.transporter = createTransport({
      host: this.config.getOrThrow('MAILER_HOST'),
      port: this.config.getOrThrow('MAILER_PORT'),
      auth: {
        user: this.config.getOrThrow('MAILER_AUTH_USER'),
        pass: this.config.getOrThrow('MAILER_AUTH_PASS'),
      },
    });
  }

  async sendMail({ from, html, subject, text, to }: MailerData) {
    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });

      this.logger.log(`Message sent: ${info.messageId}`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
