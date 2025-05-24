import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PurchaseService } from '../purchase/purchase.service'; // Adjust path if needed

@Component({
  selector: 'app-drafts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.scss']
})
export class DraftsComponent implements OnInit {
  drafts: any[] = [];

  constructor(
    private router: Router,
    private purchaseService: PurchaseService
  ) {}

  ngOnInit() {
    this.loadDrafts();
  }

  loadDrafts() {
    const savedDrafts = localStorage.getItem('draftRequests');
    this.drafts = savedDrafts ? JSON.parse(savedDrafts) : [];
  }

  editDraft(draft: any) {
    localStorage.setItem('currentDraft', JSON.stringify(draft));
    this.router.navigate(['/demandeur']);
  }

  deleteDraft(requestNumber: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce brouillon ?')) {
      this.drafts = this.drafts.filter(draft => draft.requestNumber !== requestNumber);
      localStorage.setItem('draftRequests', JSON.stringify(this.drafts));
    }
  }

  submitDraft(draft: any) {
    if (!confirm('Soumettre ce brouillon ?')) return;
  
    const requestPayload = {
      quantite: Number(draft.qte),         // 👈 Ensure it's a number
      description: draft.details           // 👈 Match backend DTO
      // Add other fields only if required by backend
    };
  
    console.log('Payload sent to backend:', requestPayload);
  
    this.purchaseService.createPurchase(requestPayload).subscribe({
      next: () => {
        this.deleteDraft(draft.requestNumber);
        alert('Requête soumise avec succès !');
      },
      error: err => {
        console.error('Erreur de soumission:', err);
        alert("Erreur lors de l'envoi de la requête.");
      }
    });
  }
  
  
  
}
