import { IsEmail, IsNotEmpty, IsString, IsIn, IsOptional, MinLength } from 'class-validator';
import { enumRole } from '../role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(enumRole))
  role: enumRole;
}
