import { Controller, Get, Post, Body } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './role.entity';
import { Roles } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { enumRole } from '../users/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles(enumRole.ResponsableAchat,enumRole.DirectionGenerale)
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }


  @Post()
  @Roles(enumRole.ResponsableAchat,enumRole.DirectionGenerale)
  async create(@Body() createRoleDto: { name: string }): Promise<Role> {
    return this.rolesService.create(createRoleDto.name);
  }
}
