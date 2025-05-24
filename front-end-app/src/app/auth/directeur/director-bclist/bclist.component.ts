// director-bclist.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BcService } from '../../BC/bc.service';
import { BCStatus } from '../../BC/bc.models';

@Component({
  selector: 'app-director-bclist',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './bclist.component.html',  // ✅ Uses shared HTML
  styleUrls: ['./bclist.component.scss']
})
export class DirectorBcListComponent implements OnInit {
  bons_commande: any[] = [];
  filteredBCs: any[] = [];
  loading = false;
  errorMessage = '';

  searchTerm: string = '';
  statusFilter: string = 'all';

  BCStatus = BCStatus;

  constructor(private bcService: BcService) {}

  ngOnInit() {
    this.fetchBCs();
  }

  fetchBCs() {
    this.loading = true;
    this.bcService.getAllBCs().subscribe({
      next: (data) => {
        this.bons_commande = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des BCs:', err);
        this.errorMessage = 'Impossible de charger les bons de commande';
        this.loading = false;
      }
    });
  }

  updateStatus(bc: any, status: BCStatus) {
    this.bcService.updateBC(bc.id, { status }).subscribe({
      next: () => {
        bc.status = status;
        this.applyFilters(); // Refresh filtered list
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut:', err);
        this.errorMessage = 'Erreur lors de la mise à jour du statut';
      }
    });
  }

  applyFilters() {
    this.filteredBCs = this.bons_commande.filter(bc => {
      const matchesSearch = bc.reference.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus =
        this.statusFilter === 'all' || bc.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }
}
