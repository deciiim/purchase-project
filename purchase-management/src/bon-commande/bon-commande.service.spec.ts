import { Test, TestingModule } from '@nestjs/testing';
import { BonCommandeService } from './bon-commande.service';

describe('BonCommandeService', () => {
  let service: BonCommandeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BonCommandeService],
    }).compile();

    service = module.get<BonCommandeService>(BonCommandeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
