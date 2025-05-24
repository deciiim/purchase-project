import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DemandeProjetService } from '../demande-projet.service'; // adjust path

@Component({
  selector: 'app-demande-projet-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demande-projet-list.component.html',
  styleUrls: ['./demande-projet-list.component.scss']
})
export class DemandeProjetListComponent implements OnInit {
  demandesProjets: any[] = [];
  totalDemandes: number = 0;
  currentUser: any;

  constructor(
    private router: Router,
    private demandeService: DemandeProjetService
  ) {}

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadDemandesProjets();
  }

  loadDemandesProjets() {
    this.demandeService.getDemandes().subscribe({
      next: (demandes: any[]) => {
        // Optional: filter demandes by current user if needed
        this.demandesProjets = demandes.filter(d =>
          d.responsableId === this.currentUser.id || 
          d.responsableEmail === this.currentUser.email
        );
        this.totalDemandes = this.demandesProjets.length;
      },
      error: (err) => {
        console.error('Error loading demandes:', err);
        this.demandesProjets = [];
        this.totalDemandes = 0;
      }
    });
  }

  deleteDemande(demande: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      this.demandeService.remove(demande.id).subscribe({
        next: () => {
          this.loadDemandesProjets(); // Refresh list after deletion
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression de la demande.');
        }
      });
    }
  }

  createNewRequest() {
    this.router.navigate(['/create-demande-projet']);
  }

  goToHome() {
    this.router.navigate(['/responsable']);
  }
}
