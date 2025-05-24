import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FournisseurService } from '../fournisseur.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-fournisseur-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './fournisseurlist.component.html',
  styleUrls: ['./fournisseurlist.component.scss'],
  providers: [FournisseurService]
})
export class FournisseurListComponent implements OnInit {
  currentDate = new Date();
  fournisseurs: any[] = [];
  filteredFournisseurs: any[] = [];
  searchTerm = '';
  message = '';
  messageType = '';

  constructor(private router: Router, private fournisseurService: FournisseurService) {}

  ngOnInit() {
    this.loadFournisseurs();
  }

  loadFournisseurs() {
    this.fournisseurService.findAll().subscribe({
      next: (data) => {
        this.fournisseurs = data;
        this.filteredFournisseurs = [...this.fournisseurs];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des fournisseurs:', error);
        this.showMessage('Erreur lors du chargement des fournisseurs', 'error');
      }
    });
  }

  filterFournisseurs() {
    if (!this.searchTerm) {
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

  editFournisseur(fournisseur: any) {
    localStorage.setItem('editingFournisseur', JSON.stringify(fournisseur));
    this.router.navigate(['/add-fournisseur']);
  }

  deleteFournisseur(fournisseur: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
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

  showMessage(msg: string, type: string) {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }

  goToHome() {
    this.router.navigate(['/responsable']);
  }

  goToAddFournisseur() {
    this.router.navigate(['/add-fournisseur']);
  }
}
