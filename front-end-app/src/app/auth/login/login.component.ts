import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { enumRole } from '../../enums/role.enum';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  resetEmail: string = '';
  errorMessage: string = '';
  showForgotPassword: boolean = false;
  resetSent: boolean = false;
  showPassword: boolean = false;
  showResetModal: boolean = false;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  onSubmit() {
    this.errorMessage = '';
    this.loading = true;
  
    this.authService.login(this.email, this.password).subscribe({
      next: (res: { access_token: string }) => {
        this.loading = false;
  
        const token = res.access_token;
        localStorage.setItem('auth_token', token);
  
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
  
          const decoded = JSON.parse(jsonPayload);
          const role = decoded.role?.toLowerCase();
  
          switch (role) {
            case enumRole.Demandeur.toLowerCase():
              this.router.navigate(['/demandeur']);
              break;
            case enumRole.ResponsableAchat.toLowerCase():
              this.router.navigate(['/responsable']);
              break;
            case enumRole.DirectionGenerale.toLowerCase():
              this.router.navigate(['/directeur']);
              break;
            default:
              this.errorMessage = 'Rôle utilisateur inconnu.';
          }
        } catch (error) {
          console.error('Token decode failed:', error);
          this.errorMessage = 'Jeton invalide';
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la connexion';
      }
    });
  }
  
  
  
  toggleForgotPassword() {
    this.showForgotPassword = !this.showForgotPassword;
    this.resetSent = false;
    this.errorMessage = '';
    this.resetEmail = '';
  }

  sendResetEmail() {
    if (!this.resetEmail) {
      this.errorMessage = 'Veuillez entrer votre email';
      return;
    }

    if (!this.isValidEmail(this.resetEmail)) {
      this.errorMessage = 'Veuillez entrer un email valide';
      return;
    }

    setTimeout(() => {
      this.resetSent = true;
      this.errorMessage = '';
    }, 1500);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  forgotPassword() {
    this.showResetModal = true;
  }

  closeResetModal() {
    this.showResetModal = false;
    this.resetEmail = '';
  }

  sendResetLink() {
    if (this.resetEmail) {
      // Example: After reset link sent, redirect to director page
      this.router.navigate(['/directeur']);
    }
  }
}
