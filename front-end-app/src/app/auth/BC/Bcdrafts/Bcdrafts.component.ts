import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BcService } from '../bc.service'; // 🔁 Update with the correct path
import { CreateBCDto, BCStatus } from '../bc.models'; // 🔁 Update with the correct path

@Component({
  selector: 'app-bcdrafts',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './bcdrafts.component.html',
  styleUrls: ['./bcdrafts.component.scss']
})
export class BcDraftsComponent implements OnInit {
  drafts: any[] = [];
  searchTerm: string = '';
  message: string = '';
  messageType: string = '';

  constructor(private router: Router, private bcService: BcService) {}

  ngOnInit() {
    this.loadDrafts();
  }

  loadDrafts() {
    const savedDrafts = localStorage.getItem('bcDrafts');
    this.drafts = savedDrafts ? JSON.parse(savedDrafts) : [];
  }

  get filteredDrafts() {
    return this.drafts.filter(draft => 
      draft.reference?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      draft.fournisseurId?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      draft.demandeAchatId?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      draft.projetId?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  editDraft(draft: any) {
    localStorage.setItem('currentBcDraft', JSON.stringify(draft));
    this.router.navigate(['/create-bc']);
  }

  deleteDraft(reference: string) {
    this.drafts = this.drafts.filter(draft => draft.reference !== reference);
    localStorage.setItem('bcDrafts', JSON.stringify(this.drafts));
    this.showMessage('Brouillon supprimé avec succès', 'success');
  }

  saveOrder(draft: any) {
    const dto: CreateBCDto = {
      reference: draft.reference,
      date: draft.date,
      fournisseurId: Number(draft.fournisseurId),
      demandeAchatId: Number(draft.demandeAchatId),
      montantTotal: draft.montantTotal,
      status: BCStatus.ISSUED,
      demandeProjetId: draft.projetId ? Number(draft.projetId) : undefined,
    };

    this.bcService.createBC(dto).subscribe({
      next: () => {
        // Remove saved draft after successful backend save
        this.drafts = this.drafts.filter(d => d.reference !== draft.reference);
        localStorage.setItem('bcDrafts', JSON.stringify(this.drafts));
        this.showMessage(`Brouillon ${draft.reference} enregistré avec succès`, 'success');
      },
      error: (err) => {
        this.showMessage('Erreur lors de l\'enregistrement du bon de commande', 'error');
        console.error('Erreur API:', err);
      }
    });
  }

  showMessage(msg: string, type: string) {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}
