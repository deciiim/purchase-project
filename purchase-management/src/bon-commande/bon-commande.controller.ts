import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BonCommandeService } from './bon-commande.service';
import { CreateBonCommandeDto } from './dto/create-bon-commande.dto';
import { UpdateBonCommandeDto } from './dto/update-bon-commande.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { enumRole } from '../users/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bon-commande')
export class BonCommandeController {
  constructor(private readonly bcService: BonCommandeService) {}

  @Post()
  @Roles(enumRole.ResponsableAchat)
  create(@Body() dto: CreateBonCommandeDto) {
    return this.bcService.create(dto);
  }

  @Get()
  @Roles(enumRole.ResponsableAchat, enumRole.DirectionGenerale)
  findAll() {
    return this.bcService.findAll();
  }

  @Get(':id')
  @Roles(enumRole.ResponsableAchat, enumRole.DirectionGenerale)
  findOne(@Param('id') id: string) {
    return this.bcService.findOne(+id);
  }

  @Patch(':id')
  @Roles(enumRole.ResponsableAchat, enumRole.DirectionGenerale)
  update(@Param('id') id: string, @Body() dto: UpdateBonCommandeDto) {
    return this.bcService.update(+id, dto);
  }

  @Delete(':id')
  @Roles(enumRole.ResponsableAchat,enumRole.DirectionGenerale)
  remove(@Param('id') id: string) {
    return this.bcService.remove(+id);
  }
}
