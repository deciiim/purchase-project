import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetService } from '../services/password-reset.service';

@Component({
  selector: 'app-reset-password',
  template: `
    <div class="reset-container">
      <div class="reset-box">
        <h2>Réinitialisation du mot de passe</h2>
        
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
          <button (click)="resetPassword()" class="btn btn-primary">
            Réinitialiser le mot de passe
          </button>
        </div>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [/* Utilisez les mêmes styles que le composant login */]
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private passwordResetService: PasswordResetService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      this.router.navigate(['/login']);
    }
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.passwordResetService.resetPassword(this.token, this.newPassword)
      .subscribe({
        next: () => {
          // Redirection vers login avec message de succès
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la réinitialisation du mot de passe';
        }
      });
  }
} 