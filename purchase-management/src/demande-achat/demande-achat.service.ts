import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDemandeAchatDto } from './dto/create-demande-achat.dto';
import { DemandeAchat } from './demande-achat.entity';
import { User } from '../users/user.entity';
import { DemandeAchatStatus } from './enum/demande-achat-status.enum';

@Injectable()
export class DemandeAchatService {
  constructor(
    @InjectRepository(DemandeAchat)
    private repo: Repository<DemandeAchat>,
  ) {}

  create(dto: CreateDemandeAchatDto, user: User): Promise<DemandeAchat> {
    const da = this.repo.create({
      description: dto.description,
      quantite: dto.quantite ?? 1,
      user,
      userId: user.id,
    });

    return this.repo.save(da);
  }

  async findAll(
    status?: DemandeAchatStatus,
    user?: User,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: DemandeAchat[]; meta: any }> {
    const query = this.repo
      .createQueryBuilder('da')
      .leftJoinAndSelect('da.user', 'user')
      .leftJoinAndSelect('da.demandeProjets', 'demandeProjets')
      .leftJoinAndSelect('da.bonCommandes', 'bonCommandes');

    if (user && user.role === 'Demandeur') {
      query.andWhere('da.userId = :userId', { userId: user.id });
    }

    if (status) {
      query.andWhere('da.status = :status', { status });
    }

    query
      .orderBy('da.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, totalItems] = await query.getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  async updateStatus(id: number, status: DemandeAchatStatus): Promise<DemandeAchat> {
    const da = await this.repo.findOne({ where: { id } });
    if (!da) {
      throw new NotFoundException(`DemandeAchat with ID ${id} not found`);
    }

    da.status = status;
    return this.repo.save(da);
  }

  async deleteOwn(id: number, user: User): Promise<{ message: string }> {
    const da = await this.repo.findOne({ where: { id } });

    if (!da) {
      throw new NotFoundException(`DemandeAchat with ID ${id} not found`);
    }

    if (da.userId !== user.id) {
      throw new ForbiddenException('You are not allowed to delete this request');
    }

    await this.repo.delete(id);

    return { message: 'DemandeAchat deleted successfully' };
  }

  async deleteAny(id: number): Promise<{ message: string }> {
    const da = await this.repo.findOne({ where: { id } });

    if (!da) {
      throw new NotFoundException(`DemandeAchat with ID ${id} not found`);
    }

    await this.repo.delete(id);

    return { message: 'DemandeAchat deleted successfully' };
  }

  // New method to get statistics
  async getStatistics(user: User) {
    const demandes = await this.repo.find({
      where: { user: { id: user.id } },
    });

    const stats = {
      total: demandes.length,
      byStatus: {
        PENDING: demandes.filter((d) => d.status === DemandeAchatStatus.PENDING).length,
        APPROVED: demandes.filter((d) => d.status === DemandeAchatStatus.APPROVED).length,
        REJECTED: demandes.filter((d) => d.status === DemandeAchatStatus.REJECTED).length,
      },
      totalQuantity: demandes.reduce((sum, d) => sum + d.quantite, 0),
    };

    return stats;
  }
}
