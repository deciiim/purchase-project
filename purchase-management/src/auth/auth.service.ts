import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const u = await this.users.findByEmail(email);
    if (!u) throw new UnauthorizedException('Bad credentials');

    const ok = await bcrypt.compare(pass, u.password);
    if (!ok) throw new UnauthorizedException('Bad credentials');

    console.log(`⚡⚡ Successful login by:`);
    console.log(`👤 Name: ${u.name}`);
    console.log(`🤖 Role: ${u.role}`);
    
    return u;
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id, role: user.role, name: user.name };
    return { access_token: this.jwt.sign(payload) };
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.users.findByEmail(email);
    
    if (user) {
      const token = await this.users.generateResetToken(email);
      
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
      const resetLink = `${frontendUrl}/reset-password?token=${token}`;

      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
          <h3>Bonjour ${user.name},</h3>
          <p>Vous avez demandé une réinitialisation de mot de passe.</p>
          <p>Veuillez cliquer sur le lien ci-dessous pour choisir un nouveau mot de passe :</p>
          <p style="text-align: center;">
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Réinitialiser le mot de passe</a>
          </p>
          <p>Ce lien expirera dans 1 heure.</p>
          <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email.</p>
        `,
      });

      console.log(`📧 Password reset link sent to: ${user.email}`);
    }

    return 'Si un compte correspondant à cet email existe, un lien de réinitialisation a été envoyé.';
  }

  // --- THIS METHOD HAS BEEN UPDATED ---
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    await this.users.resetPassword(token, newPassword);
    
    // Return a JSON object for the Angular frontend to parse correctly
    return { message: 'Le mot de passe a été mis à jour avec succès.' };
  }
}