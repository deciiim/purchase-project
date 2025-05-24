import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProjetService } from './projet.service';
import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { enumRole } from '../users/role.enum';

@Controller('projet')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjetController {
  constructor(private readonly projetService: ProjetService) {}

  @Post()
  @Roles(enumRole.ResponsableAchat) 
  create(@Body() dto: CreateProjetDto, @Request() req) {
    const user = req.user;
    return this.projetService.create(dto, user);
  }

  @Get()
  @Roles(enumRole.ResponsableAchat, enumRole.DirectionGenerale) 
  findAll() {
    return this.projetService.findAll();
  }

  @Get(':id')
  @Roles(enumRole.ResponsableAchat, enumRole.DirectionGenerale) 
  findOne(@Param('id') id: string) {
    return this.projetService.findOne(+id);
  }

  @Patch(':id')
  @Roles(enumRole.ResponsableAchat,enumRole.DirectionGenerale) 
  update(@Param('id') id: string, @Body() dto: UpdateProjetDto) {
    return this.projetService.update(+id, dto);
  }

  @Delete(':id')
  @Roles(enumRole.ResponsableAchat) 
  remove(@Param('id') id: string) {
    return this.projetService.remove(+id);
  }
}
