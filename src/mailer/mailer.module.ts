import { Module } from '@nestjs/common';
import { MailerProvider } from './mailer.interface';
import { NodemailerService } from './nodemailer.service';

export const MailerContainerInject = Object.freeze({
  MailerProvider: {
    provide: MailerProvider,
    useExisting: NodemailerService,
  },
});

@Module({
  providers: [
    MailerContainerInject.MailerProvider.useExisting!,
    MailerContainerInject.MailerProvider,
  ],
  exports: [MailerContainerInject.MailerProvider],
})
export class MailerModule {}
