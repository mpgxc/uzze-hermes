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

  async onModuleInit() {
    this.transporter = createTransport({
      host: this.config.getOrThrow('MAILER_HOST'),
      port: this.config.getOrThrow<number>('MAILER_PORT'),
      auth: {
        user: this.config.getOrThrow('MAILER_AUTH_USER'),
        pass: this.config.getOrThrow('MAILER_AUTH_PASS'),
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });

    await this.transporter.verify().catch((err: Error) => {
      this.logger.error(
        `SMTP connection failed: ${err.message}`,
        err.stack,
      );
    });
  }

  async sendMail({ from, html, subject, text, to }: MailerData): Promise<void> {
    const info = await this.transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    this.logger.log(`Message sent: ${info.messageId}`);
  }
}

