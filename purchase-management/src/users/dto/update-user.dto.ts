import { IsOptional, IsString, MinLength, IsIn } from 'class-validator';
import { enumRole }                               from '../role.enum';

export class UpdateUserDto {
  @IsOptional() @IsString()    
  name?: string;
  @IsOptional() @MinLength(6)  password?: string;
  @IsOptional() @IsIn(Object.values(enumRole))
                               role?: enumRole;
}
