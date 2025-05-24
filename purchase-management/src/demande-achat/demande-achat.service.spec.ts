import { Test, TestingModule } from '@nestjs/testing';
import { DemandeAchatService } from './demande-achat.service';

describe('DemandeAchatService', () => {
  let service: DemandeAchatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemandeAchatService],
    }).compile();

    service = module.get<DemandeAchatService>(DemandeAchatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
