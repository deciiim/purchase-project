import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DemandeProjetService } from './demande-projet.service';
import { CreateDemandeProjetDto } from './dto/create-demande-projet.dto';
import { UpdateDemandeProjetDto } from './dto/update-demande-projet.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { enumRole } from '../users/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('demande-projets')
export class DemandeProjetController {
  constructor(private readonly demandeProjetService: DemandeProjetService) {}

  @Post()
  @Roles(enumRole.ResponsableAchat)  
  create(@Body() dto: CreateDemandeProjetDto) {
    return this.demandeProjetService.create(dto);
  }

  @Get()
  @Roles(enumRole.ResponsableAchat, enumRole.DirectionGenerale)  
  findAll() {
    return this.demandeProjetService.findAll();
  }

  @Get(':id')
  @Roles(enumRole.ResponsableAchat, enumRole.DirectionGenerale) 
  findOne(@Param('id') id: number) {
    return this.demandeProjetService.findOne(id);
  }

  @Patch(':id')
  @Roles(enumRole.ResponsableAchat)  
  update(@Param('id') id: number, @Body() dto: UpdateDemandeProjetDto) {
    return this.demandeProjetService.update(id, dto);
  }

  @Delete(':id')
  @Roles(enumRole.ResponsableAchat) 
  remove(@Param('id') id: number) {
    return this.demandeProjetService.remove(id);
  }
}
