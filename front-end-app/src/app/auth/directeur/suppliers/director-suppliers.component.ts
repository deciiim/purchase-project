import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FournisseurService } from '../../fournisseur/fournisseur.service';  // Your service path here
import { HttpClientModule } from '@angular/common/http';

interface Fournisseur {
  id?: number;           // assuming backend provides an id
  name: string;
  phone: string;
  email: string;
  address: string;        // optional, depends on your backend
}

@Component({
  selector: 'app-director-suppliers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './director-suppliers.component.html',
  styleUrls: ['./director-suppliers.component.scss'],
  providers: [FournisseurService]
})
export class DirectorSuppliersComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];
  filteredFournisseurs: Fournisseur[] = [];
  searchTerm: string = '';
  totalFournisseurs: number = 0;
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private fournisseurService: FournisseurService, private router: Router) {}

  ngOnInit() {
    this.loadFournisseurs();
  }

  loadFournisseurs() {
    this.fournisseurService.findAll().subscribe({
      next: (data: Fournisseur[]) => {
        this.fournisseurs = data;
        this.filteredFournisseurs = [...this.fournisseurs];
        this.totalFournisseurs = this.fournisseurs.length;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des fournisseurs:', error);
        this.showMessage('Erreur lors du chargement des fournisseurs', 'error');
      }
    });
  }

  filterFournisseurs() {
    if (!this.searchTerm.trim()) {
      this.filteredFournisseurs = [...this.fournisseurs];
      return;
    }

    const search = this.searchTerm.toLowerCase();
    this.filteredFournisseurs = this.fournisseurs.filter(f =>
      f.name.toLowerCase().includes(search) ||
      f.phone.includes(search) ||
      f.email.toLowerCase().includes(search) ||
      f.address.toLowerCase().includes(search)
    );
  }

  editFournisseur(fournisseur: Fournisseur) {
    localStorage.setItem('editingFournisseur', JSON.stringify(fournisseur));
    this.router.navigate(['/add-fournisseur']);
  }

  deleteFournisseur(fournisseur: Fournisseur) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      if (!fournisseur.id) {
        this.showMessage('Fournisseur invalide', 'error');
        return;
      }
      this.fournisseurService.remove(fournisseur.id).subscribe({
        next: () => {
          this.showMessage('Fournisseur supprimé avec succès', 'success');
          this.loadFournisseurs();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.showMessage('Erreur lors de la suppression du fournisseur', 'error');
        }
      });
    }
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 3000);
  }

  goToHome() {
    this.router.navigate(['/directeur']); // Or whatever your director dashboard route is
  }

  goToAddFournisseur() {
    this.router.navigate(['/add-fournisseur']);
  }
}
