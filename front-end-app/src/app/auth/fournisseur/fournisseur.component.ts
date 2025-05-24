import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FournisseurService } from './fournisseur.service';
import { HttpClientModule } from '@angular/common/http';

interface Fournisseur {
  id?: number;      // optional for new fournisseurs
  name: string;
  phone: string;
  email: string;
  address: string;
}

@Component({
  selector: 'app-fournisseur',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.scss'],
  providers: [FournisseurService]
})
export class FournisseurComponent implements OnInit {
  currentDate = new Date();
  message = '';
  messageType = '';

  fournisseur: Fournisseur = {
    name: '',
    phone: '',
    email: '',
    address: '',
  };

  constructor(private router: Router, private fournisseurService: FournisseurService) {}

  ngOnInit() {
    const editing = localStorage.getItem('editingFournisseur');
    if (editing) {
      this.fournisseur = JSON.parse(editing);
      localStorage.removeItem('editingFournisseur');
    }
  }

  saveFournisseur() {
    if (!this.validateForm()) {
      this.showMessage(
        "Veuillez remplir tous les champs correctement. Vérifiez le format du numéro de téléphone (10 chiffres) et de l'email.",
        'error'
      );
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.showMessage('Token is missing from localStorage. Veuillez vous connecter.', 'error');
      return;
    }

    if (this.fournisseur.id) {
      // Create a copy excluding id before sending update request
      const { id, ...fournisseurData } = this.fournisseur;

      this.fournisseurService.update(id, fournisseurData).subscribe({
        next: () => {
          this.showMessage('Le fournisseur a été mis à jour avec succès', 'success');
          this.resetForm();
          this.router.navigate(['/fournisseurlist']);
        },
        error: (error) => this.handleError(error)
      });
    } else {
      this.fournisseurService.addFournisseur(this.fournisseur).subscribe({
        next: () => {
          this.showMessage('Le fournisseur a été ajouté avec succès', 'success');
          this.resetForm();
          this.router.navigate(['/fournisseurlist']);
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  validateForm(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    return Boolean(this.fournisseur.name) &&
           phoneRegex.test(this.fournisseur.phone) &&
           Boolean(this.fournisseur.address) &&
           emailRegex.test(this.fournisseur.email);
  }

  showMessage(msg: string, type: string) {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }

  resetForm() {
    this.fournisseur = { name: '', phone: '', email: '', address: '' };
  }

  handleError(error: any) {
    console.error('Erreur:', error);
    if (error.status === 401) {
      this.showMessage('Erreur 401: Non autorisé. Veuillez vous reconnecter.', 'error');
    } else {
      this.showMessage("Erreur lors de l'opération", 'error');
    }
  }

  goToHome() {
    this.router.navigate(['/responsable']);
  }

  goToList() {
    this.router.navigate(['/fournisseurlist']);
  }
}
