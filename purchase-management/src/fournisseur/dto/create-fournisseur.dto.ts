import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateFournisseurDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}
