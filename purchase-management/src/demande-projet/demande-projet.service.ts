import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemandeProjet } from './demande-projet.entity';
import { CreateDemandeProjetDto } from './dto/create-demande-projet.dto';
import { UpdateDemandeProjetDto } from './dto/update-demande-projet.dto';
import { DemandeAchat } from '../demande-achat/demande-achat.entity';
import { Projet } from '../projet/projet.entity';  

@Injectable()
export class DemandeProjetService {
  constructor(
    @InjectRepository(DemandeProjet)
    private readonly demandeProjetRepository: Repository<DemandeProjet>,
    @InjectRepository(DemandeAchat)
    private readonly demandeAchatRepository: Repository<DemandeAchat>,
    @InjectRepository(Projet)
    private readonly projetRepository: Repository<Projet>, 
  ) {}

  async create(createDemandeProjetDto: CreateDemandeProjetDto): Promise<DemandeProjet> {
    const demandeAchat = await this.demandeAchatRepository.findOne({ where: { id: createDemandeProjetDto.demandeAchatId } });
    if (!demandeAchat) {
      throw new NotFoundException(`DemandeAchat with ID ${createDemandeProjetDto.demandeAchatId} not found`);
    }

    const projet = await this.projetRepository.findOne({ where: { id: createDemandeProjetDto.projetId } });  
    if (!projet) {
      throw new NotFoundException(`Projet with ID ${createDemandeProjetDto.projetId} not found`);
    }

    const demandeProjet = this.demandeProjetRepository.create({
      ...createDemandeProjetDto,
      demandeAchat,
      projet, 
    });

    return this.demandeProjetRepository.save(demandeProjet);
  }

  async findAll(): Promise<DemandeProjet[]> {
    return this.demandeProjetRepository.find({ relations: ['demandeAchat', 'projet'] }); 
  }

  async findOne(id: number): Promise<DemandeProjet> {
    const demandeProjet = await this.demandeProjetRepository.findOne({ where: { id }, relations: ['demandeAchat', 'projet'] });
    if (!demandeProjet) {
      throw new NotFoundException(`DemandeProjet with ID ${id} not found`);
    }
    return demandeProjet;
  }

  async update(id: number, updateDemandeProjetDto: UpdateDemandeProjetDto): Promise<DemandeProjet> {
    await this.demandeProjetRepository.update(id, updateDemandeProjetDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.demandeProjetRepository.delete(id);
  }
}
