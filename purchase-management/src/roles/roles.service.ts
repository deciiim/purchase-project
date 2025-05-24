import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
  }

  private async seedRoles() {
    const defaultRoles = ['Demandeur', 'Responsable achat', 'Direction générale'];

    for (const name of defaultRoles) {
      const existing = await this.roleRepository.findOne({ where: { name } });
      if (!existing) {
        const role = this.roleRepository.create({ name });
        await this.roleRepository.save(role);
        console.log(`✅ Role '${name}' added`);
      }
    }
  }

  async create(name: string): Promise<Role> {
    const existing = await this.roleRepository.findOne({ where: { name } });
    if (existing) {
      throw new Error(`Role '${name}' already exists`);
    }
    const role = this.roleRepository.create({ name });
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findRoleByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { name } });
    if (!role) {
      throw new Error(`Role '${name}' not found`);
    }
    return role;
  }
}
