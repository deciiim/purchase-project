import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { Fournisseur } from '../fournisseur/fournisseur.entity';
import { DemandeAchat } from '../demande-achat/demande-achat.entity';
import { BonCommandeStatus } from './enum/bon-commande-status.enum';
import { DemandeProjet } from '../demande-projet/demande-projet.entity';

@Entity()
export class BonCommande {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reference: string;

  @Column()
  date: Date;

  @ManyToOne(() => Fournisseur, (fournisseur) => fournisseur.bonCommandes)
  fournisseur: Fournisseur;

  @ManyToOne(() => DemandeAchat, (demandeAchat) => demandeAchat.bonCommandes)
  demandeAchat: DemandeAchat;

  @Column('decimal', { nullable: true })
  montantTotal: number;

  @Column({
    type: 'enum',
    enum: BonCommandeStatus,
    default: BonCommandeStatus.ISSUED,
  })
  status: BonCommandeStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => DemandeProjet, (dp) => dp.bonCommandes, { nullable: true })
  @JoinColumn({ name: 'demandeProjetId' })
  demandeProjet: DemandeProjet | null; 

  @Column({ nullable: true })
  demandeProjetId?: number;
}
