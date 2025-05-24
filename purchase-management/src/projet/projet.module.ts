import { Module } from '@nestjs/common';
import { ProjetService } from './projet.service';
import { ProjetController } from './projet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projet } from './projet.entity';  

@Module({
  imports: [TypeOrmModule.forFeature([Projet])],
  providers: [ProjetService],
  controllers: [ProjetController],
  exports: [TypeOrmModule], 
})
export class ProjetModule {}
