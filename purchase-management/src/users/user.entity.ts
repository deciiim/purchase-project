import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { enumRole } from './role.enum';
import { DemandeAchat } from '../demande-achat/demande-achat.entity';
import { Projet } from '../projet/projet.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: enumRole,
    default: enumRole.Demandeur,
  })
  role: enumRole;

  @OneToMany(() => DemandeAchat, da => da.user)
  demandes: DemandeAchat[];

  @OneToMany(() => Projet, projet => projet.responsableAchat)
  projets: Projet[];

  @Column({ type: 'text', nullable: true })
  resetToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry: Date | null;
}
