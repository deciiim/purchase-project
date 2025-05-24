import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandeProjet } from './demande-projet.entity';
import { DemandeAchat } from '../demande-achat/demande-achat.entity';
import { Projet } from '../projet/projet.entity';
import { DemandeProjetService } from './demande-projet.service';
import { DemandeProjetController } from './demande-projet.controller';
import { ProjetModule } from '../projet/projet.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([DemandeProjet, DemandeAchat, Projet]),
    ProjetModule, 
  ],
  providers: [DemandeProjetService],
  controllers: [DemandeProjetController],
})
export class DemandeProjetModule {}
