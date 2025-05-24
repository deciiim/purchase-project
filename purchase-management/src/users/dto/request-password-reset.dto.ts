// src/users/dto/request-password-reset.dto.ts
import { IsEmail } from 'class-validator';

export class RequestPasswordResetDto {
  @IsEmail()
  email: string;
}
