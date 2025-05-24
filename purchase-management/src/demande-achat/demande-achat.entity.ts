import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { DemandeProjet } from '../demande-projet/demande-projet.entity';
import { BonCommande } from '../bon-commande/bon-commande.entity';
import { DemandeAchatStatus } from './enum/demande-achat-status.enum';

@Entity('demande_achat')
export class DemandeAchat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({
    type: 'int',
    default: 1, 
  })
  quantite: number;

  @Column({
    type: 'enum',
    enum: DemandeAchatStatus,
    default: DemandeAchatStatus.PENDING,
  })
  status: DemandeAchatStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (u) => u.demandes, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => DemandeProjet, (demandeProjet) => demandeProjet.demandeAchat)
  demandeProjets: DemandeProjet[];

  @OneToMany(() => BonCommande, (bonCommande) => bonCommande.demandeAchat)
  bonCommandes: BonCommande[];
}
