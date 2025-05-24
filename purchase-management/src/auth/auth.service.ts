import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const u = await this.users.findByEmail(email);  
    if (!u) throw new UnauthorizedException('Bad credentials');

    const ok = await bcrypt.compare(pass, u.password);
    if (!ok) throw new UnauthorizedException('Bad credentials');
    console.log(`⚡⚡ Successful login by:`);
    console.log(`👤 Name: ${u.name}`);
    console.log(`🤖 Role: ${u.role}`);
    console.log(`🔐 Password (hashed): ${u.password}`);
    console.log(`🔑 Provided password: ${pass}`);
    console.log(`Role (user.role): ${u.role}`);
    return u;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role, name: user.name };
  
    return { access_token: this.jwt.sign(payload) };
  }
  async forgotPassword(email: string): Promise<string> {
    const token = await this.users.generateResetToken(email);
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  
    console.log('📧 Reset password link:', resetLink);
  
    return 'Password reset link has been sent (check console for now)';
  }
  
  async resetPassword(token: string, newPassword: string): Promise<string> {
    await this.users.resetPassword(token, newPassword);
    return 'Password successfully updated';
  }
}
