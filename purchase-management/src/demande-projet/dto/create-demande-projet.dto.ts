import { IsNotEmpty, IsString, IsOptional, IsInt, IsDateString } from 'class-validator';

export class CreateDemandeProjetDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  demandeAchatId: number; 

  @IsNotEmpty()
  @IsInt()
  projetId: number;  

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  createdAt?: string;  // ISO 8601 date string (e.g. '2023-05-23T10:00:00Z')
}
