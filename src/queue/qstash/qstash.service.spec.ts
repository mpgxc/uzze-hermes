import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { QStashService } from './qstash.service';

const mockConfig = {
  getOrThrow: jest.fn((key: string) => {
    const values: Record<string, string> = {
      QSTASH_TOKEN: 'test-token',
      HOST: 'https://example.com',
    };
    return values[key];
  }),
};

describe('QStashService', () => {
  let service: QStashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ConfigService, useValue: mockConfig },
        QStashService,
      ],
    }).compile();

    service = module.get<QStashService>(QStashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

