import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { EmailService } from './email.service'; // Import the EmailService

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { enumRole } from './role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly emailService: EmailService, // Inject the EmailService
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

  async findByEmail(email: string): Promise<User> {
    if (!email) {
      throw new HttpException('You must insert an email', HttpStatus.BAD_REQUEST);
    }

    const user = await this.repo.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('Email does not exist', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async generateResetToken(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    const token = randomBytes(32).toString('hex'); // Generate a unique token

    user.resetToken = token;
    await this.repo.save(user);

    return token;
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.repo.findOne({ where: { resetToken: token } });
  }
  async requestPasswordReset(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    const resetToken = await this.generateResetToken(email);

    // Send reset token to user's email
    await this.emailService.sendEmail(
      email,
      'Password Reset Request 🔐',
      `🚩 Here is your password reset token: ${resetToken}`,
    );

    return 'Password reset link has been sent to your email.';
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.findByResetToken(token);
    if (!user) throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    await this.repo.save(user);
  }
  
}
