import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BCStatus, CreateBCDto } from './bc.models';
import { BcService } from './bc.service';

@Component({
  selector: 'app-bc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bc.component.html',
  styleUrls: ['./bc.component.scss']
})
export class BcComponent implements OnInit {
  currentDate = new Date();
  reference: string = '';
  fournisseurId: string = '';
  demandeAchatId: string = '';
  projetId: string = '';
  montantTotal: number = 0;
  status: BCStatus = BCStatus.ISSUED;
  statuses = Object.values(BCStatus);
  message: string = '';
  messageType: string = '';
  activeTab: string = 'home';

  constructor(private router: Router, private bcService: BcService) {}

  ngOnInit() {
    const savedDraft = localStorage.getItem('currentBcDraft');
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      this.reference = draft.reference || '';
      this.fournisseurId = draft.fournisseurId || '';
      this.demandeAchatId = draft.demandeAchatId || '';
      this.projetId = draft.projetId || '';
      this.montantTotal = draft.montantTotal || 0;
      this.status = draft.status || BCStatus.ISSUED;
      this.currentDate = new Date(draft.date || new Date());
      localStorage.removeItem('currentBcDraft'); // optional: cleanup after loading
    }
  }

  saveOrder() {
    if (!this.validateForm()) {
      this.message = 'Veuillez remplir tous les champs';
      this.messageType = 'error';
      return;
    }

    const dto: CreateBCDto = {
      reference: this.reference,
      date: this.currentDate.toISOString(),
      fournisseurId: Number(this.fournisseurId),
      demandeAchatId: Number(this.demandeAchatId),
      montantTotal: this.montantTotal,
      status: this.status,
      demandeProjetId: this.projetId ? Number(this.projetId) : undefined,
    };

    this.bcService.createBC(dto).subscribe({
      next: () => {
        this.message = 'Bon de commande enregistré avec succès';
        this.messageType = 'success';
        this.resetForm();
      },
      error: (err) => {
        this.message = 'Erreur lors de l\'enregistrement';
        this.messageType = 'error';
        console.error('Erreur de création BC:', err);
      }
    });
  }

  validateMontant(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = parseFloat(input.value);
    if (value < 0) {
      value = 0;
      input.value = '0';
    }
    this.montantTotal = value;
  }

  validateForm(): boolean {
    return Boolean(this.reference) &&
           Boolean(this.fournisseurId) &&
           Boolean(this.demandeAchatId) &&
           this.montantTotal > 0;
  }

  resetForm() {
    this.reference = '';
    this.fournisseurId = '';
    this.demandeAchatId = '';
    this.projetId = '';
    this.montantTotal = 0;
    this.status = BCStatus.ISSUED;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  goToHome() {
    this.setActiveTab('home');
    this.router.navigate(['/responsable']);
  }

  goToList() {
    this.setActiveTab('all');
    this.router.navigate(['/bclist']);
  }

  goToDrafts() {
    this.setActiveTab('drafts');
    this.router.navigate(['/bcdrafts']);
  }

  saveAsDraft() {
    const draft = {
      reference: this.reference,
      date: new Date().toISOString(),
      fournisseurId: this.fournisseurId,
      demandeAchatId: this.demandeAchatId,
      projetId: this.projetId,
      montantTotal: this.montantTotal,
      status: 'DRAFT'
    };

    const existingDrafts = localStorage.getItem('bcDrafts');
    const drafts = existingDrafts ? JSON.parse(existingDrafts) : [];

    const index = drafts.findIndex((d: any) => d.reference === draft.reference);
    if (index >= 0) {
      drafts[index] = draft;
    } else {
      drafts.push(draft);
    }

    localStorage.setItem('bcDrafts', JSON.stringify(drafts));
    this.message = 'Brouillon enregistré';
    this.messageType = 'success';

    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}
