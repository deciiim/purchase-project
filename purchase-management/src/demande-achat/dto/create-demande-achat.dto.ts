import { IsString, IsNotEmpty, IsInt, IsOptional, Min } from 'class-validator';

export class CreateDemandeAchatDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional() 
  @IsInt()
  @Min(1) 
  quantite?: number;
}
