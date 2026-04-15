import { LoggerService } from '@mpgxc/logger';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerProvider } from 'mailer/mailer.interface';
import { QueueProvider } from 'queue/queue.interface';
import { NotificationPayload, PublishNotificationDto } from './notification.dto';
import { NotificationController } from './notification.controller';

const mockLogger: Partial<LoggerService> = {
  log: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

const mockQueue: Partial<QueueProvider> = {
  publishMessage: jest.fn().mockResolvedValue(undefined),
};

const mockMailer: Partial<MailerProvider> = {
  sendMail: jest.fn().mockResolvedValue(undefined),
};

describe('NotificationController', () => {
  let controller: NotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        { provide: LoggerService, useValue: mockLogger },
        { provide: QueueProvider, useValue: mockQueue },
        { provide: MailerProvider, useValue: mockMailer },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendMessage (POST /publish)', () => {
    it('should publish a message to the queue', async () => {
      const body: PublishNotificationDto = { message: 'Hello World' };
      await controller.sendMessage(body);

      expect(mockQueue.publishMessage).toHaveBeenCalledWith(body);
      expect(mockLogger.log).toHaveBeenCalledWith('Message published');
    });

    it('should propagate queue errors', async () => {
      (mockQueue.publishMessage as jest.Mock).mockRejectedValueOnce(
        new Error('Queue error'),
      );

      await expect(
        controller.sendMessage({ message: 'fail' }),
      ).rejects.toThrow('Queue error');
    });
  });

  describe('sendMessageHandler (POST /handler)', () => {
    const payload: NotificationPayload = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test',
      text: 'Hello',
      html: '<p>Hello</p>',
    };

    it('should send an email via mailer', async () => {
      await controller.sendMessageHandler(payload);

      expect(mockMailer.sendMail).toHaveBeenCalledWith({
        to: payload.to,
        from: payload.from,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      });
    });

    it('should throw InternalServerErrorException when mail fails', async () => {
      (mockMailer.sendMail as jest.Mock).mockRejectedValueOnce(
        new Error('SMTP error'),
      );

      await expect(controller.sendMessageHandler(payload)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should use text as html fallback when html is not provided', async () => {
      const payloadNoHtml: NotificationPayload = { ...payload, html: undefined };
      await controller.sendMessageHandler(payloadNoHtml);

      expect(mockMailer.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({ html: payload.text }),
      );
    });
  });
});

