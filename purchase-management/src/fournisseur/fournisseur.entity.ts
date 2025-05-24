import { Entity, PrimaryGeneratedColumn, Column,OneToMany } from 'typeorm';
import { BonCommande } from '../bon-commande/bon-commande.entity';
@Entity()
export class Fournisseur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  email: string;

  @Column()
  phone: string;
  @OneToMany(() => BonCommande, (bonCommande) => bonCommande.fournisseur)
  bonCommandes: BonCommande[];  
}
