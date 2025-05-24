import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { DemandeAchatModule } from './demande-achat/demande-achat.module';
import { AuthModule } from './auth/auth.module';
import { FournisseurModule } from './fournisseur/fournisseur.module';
import { ProjetModule } from './projet/projet.module';
import { DemandeProjetModule } from './demande-projet/demande-projet.module';
import { BonCommandeModule } from './bon-commande/bon-commande.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Global configuration for environment variables
    TypeOrmModule.forRoot({
      type: 'postgres', // Using PostgreSQL
      host: 'localhost',
      port: 5432,
      username: 'postgres', // Your DB username
      password: 'decim1234', // Your DB password
      database: 'purchasedb', // Your DB name
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Automatically load all entities
      synchronize: true, // Set to false in production!
      logging: true, // Log SQL queries (can be helpful for debugging)
    }),
    UsersModule,
    RolesModule,
    DemandeAchatModule,
    AuthModule,
    FournisseurModule,
    ProjetModule,
    DemandeProjetModule,
    BonCommandeModule,
  ],
})
export class AppModule {}
