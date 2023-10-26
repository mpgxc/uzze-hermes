import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { QStashService } from './qstash.service';

describe('QStashService', () => {
  let service: QStashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, QStashService],
    }).compile();

    service = module.get<QStashService>(QStashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
