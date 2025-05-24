import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonCommandeService } from './bon-commande.service';
import { BonCommandeController } from './bon-commande.controller';
import { BonCommande } from './bon-commande.entity';
import { Fournisseur } from '../fournisseur/fournisseur.entity';
import { DemandeAchat } from '../demande-achat/demande-achat.entity';
import { DemandeProjet } from '../demande-projet/demande-projet.entity'; // ✅ Needed for repository injection
import { DemandeProjetModule } from '../demande-projet/demande-projet.module'; // ✅ Import module

@Module({
  imports: [
    TypeOrmModule.forFeature([BonCommande, Fournisseur, DemandeAchat, DemandeProjet]),
    DemandeProjetModule, 
  ],
  providers: [BonCommandeService],
  controllers: [BonCommandeController],
})
export class BonCommandeModule {}
