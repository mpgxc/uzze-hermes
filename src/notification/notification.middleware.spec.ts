import { LoggerService } from '@mpgxc/logger';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationMiddleware } from './notification.middleware';

const mockLogger: Partial<LoggerService> = {
  error: jest.fn(),
};

const mockConfig = {
  getOrThrow: jest.fn((key: string) => {
    const values: Record<string, string> = {
      QSTASH_CURRENT_SIGNING_KEY: 'sig_current',
      QSTASH_NEXT_SIGNING_KEY: 'sig_next',
    };
    if (!(key in values)) {
      throw new Error(`Missing config value for key: ${key}`);
    }
    return values[key];
  }),
};

const mockReceiver = {
  verify: jest.fn(),
};

jest.mock('@upstash/qstash/.', () => ({
  Receiver: jest.fn(() => mockReceiver),
}));

describe('NotificationMiddleware', () => {
  let middleware: NotificationMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationMiddleware,
        { provide: LoggerService, useValue: mockLogger },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    middleware = module.get<NotificationMiddleware>(NotificationMiddleware);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should call next() when signature is valid', async () => {
    mockReceiver.verify.mockResolvedValueOnce(true);
    const req = {
      headers: { 'upstash-signature': 'valid-sig' },
      body: { message: 'hello' },
    } as any;
    const next = jest.fn();

    await middleware.use(req, {} as any, next);

    expect(next).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when signature is invalid', async () => {
    mockReceiver.verify.mockRejectedValueOnce(new Error('Invalid signature'));
    const req = {
      headers: { 'upstash-signature': 'bad-sig' },
      body: {},
    } as any;
    const next = jest.fn();

    await expect(middleware.use(req, {} as any, next)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(next).not.toHaveBeenCalled();
  });
});
