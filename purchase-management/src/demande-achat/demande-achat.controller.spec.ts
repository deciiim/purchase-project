import { Test, TestingModule } from '@nestjs/testing';
import { DemandeAchatController } from './demande-achat.controller';

describe('DemandeAchatController', () => {
  let controller: DemandeAchatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemandeAchatController],
    }).compile();

    controller = module.get<DemandeAchatController>(DemandeAchatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
