import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PurchaseService, Purchase } from '../../demandeur/purchase/purchase.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-director-purchase-requests',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './director-purchase-requests.component.html',
  styleUrls: ['./director-purchase-requests.component.scss']
})
export class DirectorPurchaseRequestsComponent implements OnInit {
  requests: Purchase[] = [];
  searchTerm = '';
  statusFilter: string = 'all'; // ✅ Added this line
  loading = false;
  errorMsg = '';

  // Pagination
  currentPage = 1;
  limit = 10;
  totalPages = 1;
  totalRequests = 0;

  // Stats
  pendingRequests = 0;
  approvedRequests = 0;
  rejectedRequests = 0;

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests(page: number = 1) {
    this.loading = true;
    this.errorMsg = '';

    this.purchaseService.getAllPurchases(page, this.limit)
      .pipe(
        catchError(err => {
          this.errorMsg = 'Erreur lors du chargement des demandes.';
          this.loading = false;
          return of({ data: [], meta: { page: 1, limit: this.limit, totalItems: 0, totalPages: 1 } });
        })
      )
      .subscribe(response => {
        this.requests = response.data.map(p => ({
          requestNumber: p.id?.toString() ?? '',
          qte: p.quantite,
          details: p.description,
          date: new Date(p.date || p.createdAt),
          status: p.status.toUpperCase(),
          username: p.user?.name ?? 'N/A'
        }));

        this.currentPage = response.meta.page;
        this.limit = response.meta.limit;
        this.totalRequests = response.meta.totalItems;
        this.totalPages = response.meta.totalPages;

        this.updateStats();
        this.loading = false;
      });
  }

  updateStats() {
    this.pendingRequests = this.requests.filter(r => r.status === 'PENDING').length;
    this.approvedRequests = this.requests.filter(r => r.status === 'APPROVED').length;
    this.rejectedRequests = this.requests.filter(r => r.status === 'REJECTED').length;
  }

  getFilteredRequests(): Purchase[] {
    const term = this.searchTerm.toLowerCase();

    return this.requests
      .filter(request => {
        const matchesSearch =
          (request.requestNumber?.toLowerCase() || '').includes(term) ||
          (request.details?.toLowerCase() || '').includes(term) ||
          (request.username?.toLowerCase() || '').includes(term);

        const matchesStatus =
          this.statusFilter === 'all' ||
          request.status.toLowerCase() === this.statusFilter;

        return matchesSearch && matchesStatus;
      })
      .slice(this.getStartIndex(), this.getEndIndex());
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'APPROVED': return 'Approuvée';
      case 'REJECTED': return 'Rejetée';
      default: return status;
    }
  }

  approveRequest(request: Purchase) {
    this.purchaseService.updatePurchaseStatus(request.requestNumber, 'APPROVED').subscribe(() => {
      this.loadRequests(this.currentPage);
    });
  }

  rejectRequest(request: Purchase) {
    this.purchaseService.updatePurchaseStatus(request.requestNumber, 'REJECTED').subscribe(() => {
      this.loadRequests(this.currentPage);
    });
  }

  deleteRequest(request: Purchase) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      this.purchaseService.deletePurchase(request.requestNumber).subscribe(() => {
        this.loadRequests(this.currentPage);
      });
    }
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadRequests(page);
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.limit;
  }

  getEndIndex(): number {
    return this.getStartIndex() + this.limit;
  }
}
