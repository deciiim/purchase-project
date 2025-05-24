// src/users/dto/reset-password.dto.ts
import { IsString, MinLength, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(64, { message: 'Reset token should be a 32-character string.' })
  @MaxLength(64, { message: 'Reset token should be a 32-character string.' })
  token: string;

  @IsString()
  @MinLength(6, { message: 'Password should be at least 6 characters long.' })
  @MaxLength(20, { message: 'Password should not exceed 20 characters.' })
  newPassword: string;
}
