// FILE: src/app/auth/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // RouterModule imported here
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { enumRole } from '../../enums/role.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule] // Ensure RouterModule is here
})
export class LoginComponent {
  // Properties for the main login form
  email = '';
  password = '';
  errorMessage = '';
  loading = false;
  showPassword = false;

  // Properties for the password reset modal
  showResetModal = false;
  resetEmail = '';
  resetLoading = false;
  resetSuccessMessage = '';
  resetErrorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // Called when the main login form is submitted
  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email et mot de passe sont requis.';
      return;
    }
    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (res: { access_token: string }) => {
        this.loading = false;
        localStorage.setItem('auth_token', res.access_token);
        this.redirectUserByRole();
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect.';
      }
    });
  }

  // Called by the eye icon to show/hide the password
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // --- Methods for the 'Forgot Password' Modal ---

  // Called by the "Mot de passe oublié ?" link to open the modal
  forgotPassword() {
    this.showResetModal = true;
  }

  // Called by the "Annuler" button to close the modal
  closeResetModal() {
    this.showResetModal = false;
    // Also reset the state of the modal for next time
    this.resetEmail = '';
    this.resetSuccessMessage = '';
    this.resetErrorMessage = '';
    this.resetLoading = false;
  }

  // Called by the "Envoyer" button in the modal
  sendResetLink() {
    if (!this.resetEmail) {
      this.resetErrorMessage = 'Veuillez entrer votre adresse email.';
      return;
    }
    this.resetErrorMessage = '';
    this.resetSuccessMessage = '';
    this.resetLoading = true;

    // This calls the method in your AuthService
    this.authService.sendPasswordResetEmail(this.resetEmail).subscribe({
      next: (response: any) => {
        this.resetLoading = false;
        this.resetSuccessMessage = 'Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.';
        // Optionally, close the modal after a delay
        // setTimeout(() => this.closeResetModal(), 3000);
      },
      error: (err: any) => {
        this.resetLoading = false;
        // For security, do not reveal if an email exists or not. Show a generic message.
        this.resetErrorMessage = 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }

  // --- Helper function for redirecting ---

  private redirectUserByRole() {
    const user = this.authService.getCurrentUser();
    if (user?.role) {
      switch (user.role.toLowerCase()) {
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
    } else {
      this.errorMessage = 'Jeton invalide ou rôle manquant.';
    }
  }
}