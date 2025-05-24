import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projet } from './projet.entity';
import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ProjetService {
  constructor(
    @InjectRepository(Projet)
    private readonly projetRepository: Repository<Projet>,
  ) {}

  async create(createProjetDto: CreateProjetDto, user: User): Promise<Projet> {
    const projet = this.projetRepository.create({
      ...createProjetDto,
      responsableAchat: user,
    });

    return this.projetRepository.save(projet);
  }

  async findAll(): Promise<Projet[]> {
    return this.projetRepository.find();
  }

  async findOne(id: number): Promise<Projet> {
    const projet = await this.projetRepository.findOne({ where: { id } });
    if (!projet) {
      throw new NotFoundException(`Projet with ID ${id} not found`);
    }
    return projet;
  }

  async update(id: number, updateProjetDto: UpdateProjetDto): Promise<Projet> {
    const projet = await this.projetRepository.findOne({ where: { id } });
    if (!projet) {
      throw new NotFoundException(`Projet with ID ${id} not found`);
    }

    // Merge updated fields into the existing entity
    Object.assign(projet, updateProjetDto);

    // Save the updated entity back to the database
    return this.projetRepository.save(projet);
  }

  async remove(id: number): Promise<void> {
    const result = await this.projetRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Projet with ID ${id} not found`);
    }
  }
}
