import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fournisseur } from './fournisseur.entity';
import { CreateFournisseurDto } from './dto/create-fournisseur.dto';
import { UpdateFournisseurDto } from './dto/update-fournisseur.dto';

@Injectable()
export class FournisseurService {
  constructor(
    @InjectRepository(Fournisseur)
    private readonly fournisseurRepo: Repository<Fournisseur>,
  ) {}

  async create(dto: CreateFournisseurDto): Promise<Fournisseur> {
    const fournisseur = this.fournisseurRepo.create(dto);
    return this.fournisseurRepo.save(fournisseur);
  }

  async findAll(): Promise<Fournisseur[]> {
    return this.fournisseurRepo.find();
  }

  async findOne(id: number): Promise<Fournisseur> {
    const fournisseur = await this.fournisseurRepo.findOne({ where: { id } });
    if (!fournisseur) {
      throw new NotFoundException(`Fournisseur with ID ${id} not found`);
    }
    return fournisseur;
  }

  async update(id: number, dto: UpdateFournisseurDto): Promise<Fournisseur> {
    const fournisseur = await this.findOne(id);
    await this.fournisseurRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.fournisseurRepo.delete(id);
  }
}
