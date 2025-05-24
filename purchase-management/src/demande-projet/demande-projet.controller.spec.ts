import { Test, TestingModule } from '@nestjs/testing';
import { DemandeProjetController } from './demande-projet.controller';

describe('DemandeProjetController', () => {
  let controller: DemandeProjetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemandeProjetController],
    }).compile();

    controller = module.get<DemandeProjetController>(DemandeProjetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
