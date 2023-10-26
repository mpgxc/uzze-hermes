import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client as QStashClient } from '@upstash/qstash';
import { QueueProvider } from 'queue/queue.interface';

@Injectable()
export class QStashService extends QStashClient implements QueueProvider {
  constructor(private readonly config: ConfigService) {
    super({
      token: config.getOrThrow<string>('QSTASH_TOKEN'),
      retry: {
        retries: 1,
      },
    });
  }

  async publishMessage<Message extends object>(body: Message): Promise<void> {
    try {
      await this.publishJSON({
        url: `${this.config.getOrThrow<string>('HOST')}/notification/handler`,
        body,
        headers: {
          content: 'application/json',
        },
      });
    } catch (error) {
      throw new Error(`Error publishing message: ${error.message}`);
    }
  }
}
