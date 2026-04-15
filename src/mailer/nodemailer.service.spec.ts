import { LoggerService } from '@mpgxc/logger';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NodemailerService } from './nodemailer.service';

const mockLogger: Partial<LoggerService> = {
  log: jest.fn(),
  error: jest.fn(),
};

const mockConfig = {
  getOrThrow: jest.fn((key: string) => {
    const values: Record<string, string | number> = {
      MAILER_HOST: 'smtp.example.com',
      MAILER_PORT: 587,
      MAILER_AUTH_USER: 'user@example.com',
      MAILER_AUTH_PASS: 'secret',
    };
    return values[key];
  }),
};

const mockTransporter = {
  sendMail: jest.fn(),
  verify: jest.fn().mockResolvedValue(true),
};

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => mockTransporter),
}));

describe('NodemailerService', () => {
  let service: NodemailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NodemailerService,
        { provide: LoggerService, useValue: mockLogger },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<NodemailerService>(NodemailerService);
    jest.clearAllMocks();
    mockTransporter.verify.mockResolvedValue(true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should create the transporter and call verify', async () => {
      await service.onModuleInit();
      expect(mockTransporter.verify).toHaveBeenCalled();
    });

    it('should log error when verify fails', async () => {
      mockTransporter.verify.mockRejectedValueOnce(new Error('SMTP unreachable'));
      await service.onModuleInit();
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('sendMail', () => {
    const mailData = {
      to: 'recipient@example.com',
      from: 'sender@example.com',
      subject: 'Test',
      text: 'Hello',
      html: '<p>Hello</p>',
    };

    beforeEach(async () => {
      await service.onModuleInit();
    });

    it('should call transporter.sendMail with correct args', async () => {
      mockTransporter.sendMail.mockResolvedValueOnce({ messageId: '123' });
      await service.sendMail(mailData);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(mailData);
      expect(mockLogger.log).toHaveBeenCalledWith('Message sent: 123');
    });

    it('should propagate error when sendMail fails', async () => {
      mockTransporter.sendMail.mockRejectedValueOnce(new Error('SMTP error'));
      await expect(service.sendMail(mailData)).rejects.toThrow('SMTP error');
    });
  });
});
