import { LoggerInject, LoggerService } from '@mpgxc/logger';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Receiver } from '@upstash/qstash/.';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class NotificationMiddleware implements NestMiddleware {
  private receiver: Receiver;

  constructor(
    private readonly config: ConfigService,

    @LoggerInject(NotificationMiddleware.name)
    private readonly logger: LoggerService,
  ) {
    this.receiver = new Receiver({
      currentSigningKey: this.config.getOrThrow('QSTASH_CURRENT_SIGNING_KEY')!,
      nextSigningKey: this.config.getOrThrow('QSTASH_NEXT_SIGNING_KEY')!,
    });
  }

  async use(req: Request, _res: Response, next: NextFunction) {
    const isValid = await this.receiver
      .verify({
        signature: req.headers['upstash-signature'] as string,
        body: JSON.stringify(req.body),
      })
      .catch((err: Error) => {
        this.logger.error(err.message);

        return false;
      });

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return next();
  }
}
