import { Test, TestingModule } from '@nestjs/testing';
import { BonCommandeController } from './bon-commande.controller';

describe('BonCommandeController', () => {
  let controller: BonCommandeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BonCommandeController],
    }).compile();

    controller = module.get<BonCommandeController>(BonCommandeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
