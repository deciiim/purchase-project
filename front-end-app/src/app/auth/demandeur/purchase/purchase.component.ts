import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PurchaseService, Purchase } from './purchase.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchasesComponent implements OnInit {
  purchases: Purchase[] = [];
  searchTerm: string = '';
  loading = false;
  errorMsg = '';

  // Pagination
  currentPage = 1;
  limit = 10;
  totalPages = 1;
  totalItems = 0;

  constructor(private router: Router, private purchaseService: PurchaseService) {}

  ngOnInit() {
    this.loadPurchases();
  }

  loadPurchases(page: number = 1) {
    this.loading = true;
    this.errorMsg = '';

    this.purchaseService.getAllPurchases(page, this.limit)
      .pipe(
        catchError(err => {
          this.errorMsg = 'Erreur lors du chargement des achats.';
          this.loading = false;
          return of({ data: [], meta: { page: 1, limit: 10, totalItems: 0, totalPages: 1 } });
        })
      )
      .subscribe(response => {
        // Map backend fields to frontend interface
        this.purchases = response.data.map(p => ({
          requestNumber: p.id?.toString() ?? '',  // Use id from backend as requestNumber string
          qte: p.quantite,
          details: p.description,
          date: new Date(p.createdAt || p.date), // use createdAt or date field
          status: p.status,
          username: p.user?.name ?? 'N/A'
        }));

        // Pagination meta
        this.currentPage = response.meta.page;
        this.limit = response.meta.limit;
        this.totalItems = response.meta.totalItems;
        this.totalPages = response.meta.totalPages;

        this.loading = false;
      });
  }

  get filteredPurchases() {
    const term = this.searchTerm.toLowerCase();
    return this.purchases.filter(purchase =>
      purchase.requestNumber.toLowerCase().includes(term) ||
      purchase.details.toLowerCase().includes(term) ||
      (purchase.username?.toLowerCase().includes(term) ?? false) ||
      this.getStatusLabel(purchase.status).toLowerCase().includes(term)
    );
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvée';
      case 'rejected': return 'Rejetée';
      default: return status;
    }
  }

  deletePurchase(purchase: Purchase) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      this.purchaseService.deletePurchase(purchase.requestNumber)
        .subscribe({
          next: () => {
            this.purchases = this.purchases.filter(p => p.requestNumber !== purchase.requestNumber);
          },
          error: () => {
            alert('Erreur lors de la suppression de la demande.');
          }
        });
    }
  }

  // Pagination controls
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadPurchases(page);
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }
}
