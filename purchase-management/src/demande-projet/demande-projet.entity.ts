import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,OneToMany,CreateDateColumn } from 'typeorm';
import { DemandeAchat } from '../demande-achat/demande-achat.entity';
import { Projet } from '../projet/projet.entity'; 
import {BonCommande} from '../bon-commande/bon-commande.entity'
@Entity()
export class DemandeProjet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => DemandeAchat, (demandeAchat) => demandeAchat.demandeProjets)
  @JoinColumn({ name: 'demandeAchatId' })
  demandeAchat: DemandeAchat;
  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(() => Projet, (projet) => projet.demandeProjets)  
  @JoinColumn({ name: 'projetId' }) 
  projet: Projet;
  
  @Column({ default: 'Pending' })
  status: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => BonCommande, (bc) => bc.demandeProjet)
bonCommandes: BonCommande[];
}
