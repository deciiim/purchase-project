import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BonCommande } from './bon-commande.entity';
import { CreateBonCommandeDto } from './dto/create-bon-commande.dto';
import { UpdateBonCommandeDto } from './dto/update-bon-commande.dto';
import { Fournisseur } from '../fournisseur/fournisseur.entity';
import { DemandeAchat } from '../demande-achat/demande-achat.entity';
import { DemandeProjet } from '../demande-projet/demande-projet.entity';

@Injectable()
export class BonCommandeService {
  constructor(
    @InjectRepository(BonCommande)
    private readonly bonCommandeRepo: Repository<BonCommande>,

    @InjectRepository(Fournisseur)
    private readonly fournisseurRepo: Repository<Fournisseur>,

    @InjectRepository(DemandeAchat)
    private readonly demandeAchatRepo: Repository<DemandeAchat>,

    @InjectRepository(DemandeProjet)
    private readonly demandeProjetRepo: Repository<DemandeProjet>,
  ) {}

  async create(dto: CreateBonCommandeDto): Promise<BonCommande> {
    const fournisseur = await this.fournisseurRepo.findOne({
      where: { id: dto.fournisseurId },
    });
    const demandeAchat = await this.demandeAchatRepo.findOne({
      where: { id: dto.demandeAchatId },
    });
  
    if (!fournisseur || !demandeAchat) {
      throw new NotFoundException('Fournisseur or DemandeAchat not found');
    }
  
    let demandeProjet: DemandeProjet | null = null;
    if (dto.demandeProjetId) {
      demandeProjet = await this.demandeProjetRepo.findOne({
        where: { id: dto.demandeProjetId },
      });
      if (!demandeProjet) {
        throw new NotFoundException(`DemandeProjet with ID ${dto.demandeProjetId} not found`);
      }
    }
  
    const todayDate = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
    const parsedDate = dto.date ? new Date(dto.date) : new Date(todayDate);
  
    const bc = this.bonCommandeRepo.create({
      reference: dto.reference,
      date: parsedDate,
      montantTotal: dto.montantTotal,
      status: dto.status,
      fournisseur,
      demandeAchat,
      demandeProjet,
    });
  
    return this.bonCommandeRepo.save(bc);
  }
  

  async findAll(): Promise<BonCommande[]> {
    return this.bonCommandeRepo.find({
      relations: ['fournisseur', 'demandeAchat', 'demandeProjet'],
    });
  }

  async findOne(id: number): Promise<BonCommande> {
    const bc = await this.bonCommandeRepo.findOne({
      where: { id },
      relations: ['fournisseur', 'demandeAchat', 'demandeProjet'],
    });

    if (!bc) {
      throw new NotFoundException(`Bon de commande with ID ${id} not found`);
    }

    return bc;
  }

  async update(id: number, dto: UpdateBonCommandeDto): Promise<BonCommande> {
    const bc = await this.findOne(id);

    if (dto.fournisseurId) {
      const fournisseur = await this.fournisseurRepo.findOne({
        where: { id: dto.fournisseurId },
      });
      if (!fournisseur) throw new NotFoundException('Fournisseur not found');
      bc.fournisseur = fournisseur;
    }

    if (dto.demandeAchatId) {
      const demandeAchat = await this.demandeAchatRepo.findOne({
        where: { id: dto.demandeAchatId },
      });
      if (!demandeAchat) throw new NotFoundException('DemandeAchat not found');
      bc.demandeAchat = demandeAchat;
    }

    if (dto.demandeProjetId !== undefined) {
      if (dto.demandeProjetId === null) {
        bc.demandeProjet = null;
      } else {
        const demandeProjet = await this.demandeProjetRepo.findOne({
          where: { id: dto.demandeProjetId },
        });
        if (!demandeProjet) throw new NotFoundException('DemandeProjet not found');
        bc.demandeProjet = demandeProjet;
      }
    }

    Object.assign(bc, {
      reference: dto.reference ?? bc.reference,
      date: dto.date ? new Date(dto.date) : bc.date,
      montantTotal: dto.montantTotal ?? bc.montantTotal,
      status: dto.status ?? bc.status,
    });

    return this.bonCommandeRepo.save(bc);
  }

  async remove(id: number): Promise<void> {
    const result = await this.bonCommandeRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Bon de commande with ID ${id} not found`);
    }
  }
}
