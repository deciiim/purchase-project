// FILE: src/app/reset-password/reset-password.component.ts

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  template: `
    <div class="reset-container">
      <div class="reset-box">
        <h2>Réinitialisation du mot de passe</h2>
        <p class="subtitle">Créez un nouveau mot de passe sécurisé.</p>

        <div class="form-group">
          <input
            type="password"
            [(ngModel)]="newPassword"
            placeholder="Nouveau mot de passe"
            class="form-control"
          >
          <input
            type="password"
            [(ngModel)]="confirmPassword"
            placeholder="Confirmer le mot de passe"
            class="form-control"
          >
          <button (click)="resetPassword()" class="btn btn-primary" [disabled]="loading">
            {{ loading ? 'En cours...' : 'Réinitialiser le mot de passe' }}
          </button>
        </div>

        <div *ngIf="errorMessage" class="message error-message">
          {{ errorMessage }}
        </div>
        <div *ngIf="successMessage" class="message success-message">
          {{ successMessage }}
        </div>
      </div>
    </div>
  `,
  // --- STYLES HAVE BEEN ADDED HERE ---
  styles: [`
    :host {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }

    .reset-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f0f2f5;
    }

    .reset-box {
      background: #ffffff;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }

    h2 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-size: 1.75rem;
      font-weight: 600;
      color: #333;
    }

    .subtitle {
      margin-bottom: 2rem;
      color: #666;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-control {
      width: 100%;
      padding: 0.9rem 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s, box-shadow 0.3s;
      box-sizing: border-box; /* Important for padding and width */
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
    }

    .btn-primary {
      width: 100%;
      padding: 0.9rem 1rem;
      border: none;
      border-radius: 8px;
      background-color: #007bff;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
      margin-top: 0.5rem;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-primary:disabled {
      background-color: #a0c7ff;
      cursor: not-allowed;
    }

    .message {
      margin-top: 1.5rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
    }

    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .success-message {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      this.router.navigate(['/login']);
    }
  }

  resetPassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir les deux champs.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.loading = true;

    this.authService.resetPassword(this.token, this.newPassword)
      .subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Votre mot de passe a été réinitialisé avec succès ! Vous allez être redirigé.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2500); // Increased delay to let user read the message
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Erreur : ce lien est peut-être invalide ou a expiré.';
          console.error('Password reset error:', error);
        }
      });
  }
}