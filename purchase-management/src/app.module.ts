// FILE: src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';

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
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'decim1234',
      database: 'purchasedb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),

    // This correctly provides the official MailerService to your app
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        secure: true,
        auth: {
          user: process.env.EMAIL_USER, // From .env file
          pass: process.env.EMAIL_APP_PASSWORD, // From .env file
        },
      },
      defaults: {
        from: '"No Reply" <noreply@yourcompany.com>',
      },
    }),

    // Your existing modules
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