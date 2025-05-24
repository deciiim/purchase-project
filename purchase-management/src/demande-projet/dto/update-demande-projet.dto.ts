import { PartialType } from '@nestjs/mapped-types';
import { CreateDemandeProjetDto } from './create-demande-projet.dto';

export class UpdateDemandeProjetDto extends PartialType(CreateDemandeProjetDto) {}
