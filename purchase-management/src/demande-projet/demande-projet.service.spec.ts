import { Test, TestingModule } from '@nestjs/testing';
import { DemandeProjetService } from './demande-projet.service';

describe('DemandeProjetService', () => {
  let service: DemandeProjetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemandeProjetService],
    }).compile();

    service = module.get<DemandeProjetService>(DemandeProjetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
