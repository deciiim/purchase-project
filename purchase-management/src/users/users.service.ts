// FILE: src/users/users.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

// The import for the old EmailService has been removed.

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { enumRole } from './role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    // The dependency on the old EmailService has been removed from the constructor.
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.repo.findOneBy({ email: dto.email });
    if (exists) throw new HttpException('Email exists', HttpStatus.BAD_REQUEST);

    const hash = await bcrypt.hash(dto.password, 10);
    const role = dto.role ?? enumRole.Demandeur;

    const user = this.repo.create({
      ...dto,
      password: hash,
      role,
    });

    return this.repo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  findOneById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByName(name: string): Promise<User | null> {
    return this.repo.findOne({ where: { name } });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    return this.repo.save(user);
  }

  async delete(id: number): Promise<void> {
    const res: DeleteResult = await this.repo.delete(id);
    if (res.affected === 0) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email) {
      return null;
    }
    return this.repo.findOne({ where: { email } });
  }

  async generateResetToken(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    // It's better to check for the user here, though AuthService already does.
    if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const token = randomBytes(32).toString('hex');

    user.resetToken = token;
    await this.repo.save(user);

    return token;
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.repo.findOne({ where: { resetToken: token } });
  }

  // The requestPasswordReset method has been removed, as this logic
  // is now correctly handled only in AuthService.

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.findByResetToken(token);
    if (!user) throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    await this.repo.save(user);
  }
}