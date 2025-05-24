
import { IsEnum } from 'class-validator';
import { DemandeAchatStatus } from '../enum/demande-achat-status.enum';

export class UpdateDemandeAchatStatusDto {
  @IsEnum(DemandeAchatStatus)
  status: DemandeAchatStatus;
}
