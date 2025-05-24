import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DemandeProjetService } from '../../demande-projet/demande-projet.service'; // adjust path

@Component({
  selector: 'app-director-project-requests',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './director-project-requests.component.html',
  styleUrls: ['./director-project-requests.component.scss']
})
export class DirectorProjectRequestsComponent implements OnInit {
  requests: any[] = [];
  filteredRequests: any[] = [];
  searchTerm: string = '';

  totalRequests: number = 0;

  constructor(private demandeService: DemandeProjetService) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.demandeService.getDemandes().subscribe({
      next: (data: any[]) => {
        this.requests = data;
        this.filteredRequests = [...this.requests];
        this.updateStats();
      },
      error: () => {
        alert('Erreur lors du chargement des demandes');
      }
    });
  }

  filterRequests() {
    const search = this.searchTerm.toLowerCase().trim();
    this.filteredRequests = this.requests.filter(request =>
      request.name?.toLowerCase().includes(search) ||
      request.description?.toLowerCase().includes(search) ||
      request.demandeAchat?.id?.toString().includes(search) ||
      request.projet?.id?.toString().includes(search)
    );
  }

  deleteRequest(request: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      this.demandeService.remove(request.id).subscribe({
        next: () => {
          this.requests = this.requests.filter(r => r.id !== request.id);
          this.filteredRequests = this.filteredRequests.filter(r => r.id !== request.id);
          this.updateStats();
        },
        error: () => alert('Erreur lors de la suppression de la demande')
      });
    }
  }

  updateStats() {
    this.totalRequests = this.requests.length;
  }
}
