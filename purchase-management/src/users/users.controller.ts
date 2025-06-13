import {
  Controller, Post, Body, Get, Param, Put, Delete,
  UseGuards, NotFoundException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { enumRole } from './role.enum';
import { Public } from '../auth/public.decorator';
import { CurrentUser } from './current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private svc: UsersService) {}

  @Post()
  @Public()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.svc.create(dto);
  }

  @Get()
  @Roles(enumRole.ResponsableAchat)
  findAll(): Promise<User[]> {
    return this.svc.findAll();
  }

  @Get('me')
  async getProfile(@CurrentUser() user: User): Promise<User> {
    const found = await this.svc.findOneById(user.id);
    if (!found) {
      throw new NotFoundException('User not found');
    }
    return found;
  }

  @Get(':id')
  @Roles(enumRole.ResponsableAchat)
  findOne(@Param('id') id: number) {
    return this.svc.findOneById(id);
  }

  @Put(':id')
  @Roles(enumRole.ResponsableAchat)
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @Roles(enumRole.ResponsableAchat)
  remove(@Param('id') id: number) {
    return this.svc.delete(id);
  }
}