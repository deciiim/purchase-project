import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateProjetDto {
  @IsNotEmpty()
  @IsString()
  title: string;  

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: 'active' | 'finished'; // <-- Add this line
}
