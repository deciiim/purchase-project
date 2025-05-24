import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandeAchatService } from './demande-achat.service';
import { DemandeAchatController } from './demande-achat.controller';
import { DemandeAchat } from './demande-achat.entity';
import { User } from '../users/user.entity';  
import { Role } from '../roles/role.entity';  
import { UsersModule } from '../users/users.module';  
import { RolesModule } from '../roles/roles.module';  

@Module({
  imports: [
    TypeOrmModule.forFeature([DemandeAchat, User, Role]), 
    UsersModule, 
    RolesModule, 
  ],
  providers: [DemandeAchatService],
  controllers: [DemandeAchatController],
})
export class DemandeAchatModule {}
