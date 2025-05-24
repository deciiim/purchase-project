import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DemandeProjetService } from './demande-projet.service';

@Component({
  selector: 'app-demande-projet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './demande-projet.component.html',
  styleUrls: ['./demande-projet.component.scss']
})
export class DemandeProjetComponent implements OnInit {
  currentDate = new Date();
  message: string = '';
  messageType: string = '';

  demande: any = {
    name: '',
    demandeAchatId: '',
    projetId: '',
    description: '',
    draftId: null
  };

  constructor(
    private router: Router,
    private demandeProjetService: DemandeProjetService
  ) {}

  ngOnInit(): void {
    const editingDraft = localStorage.getItem('editing_demande_projet');
    if (editingDraft) {
      this.demande = JSON.parse(editingDraft);
      localStorage.removeItem('editing_demande_projet');
    }
  }

  saveDemande() {
    if (!this.validateForm()) {
      this.showMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    this.demandeProjetService.createDemande({
      ...this.demande,
      demandeAchatId: +this.demande.demandeAchatId,
      projetId: +this.demande.projetId
    }).subscribe({
      next: () => {
        this.showMessage('La demande a été enregistrée avec succès', 'success');
        this.removeDraftIfExists();
        this.resetForm(true);
        this.goToList();
      },
      error: (err) => {
        console.error('Erreur lors de l’enregistrement :', err);
        this.showMessage('Erreur lors de l’enregistrement de la demande', 'error');
      }
    });
  }

  saveAsDraft() {
    if (!this.validateForm()) {
      this.showMessage('Veuillez remplir tous les champs avant d\'enregistrer le brouillon', 'error');
      return;
    }

    const drafts = JSON.parse(localStorage.getItem('demandes_projet_drafts') || '[]');

    let draft = {
      ...this.demande,
      date: new Date()
    };

    if (!draft.draftId) {
      draft.draftId = crypto.randomUUID();
    }

    const index = drafts.findIndex((d: any) => d.draftId === draft.draftId);

    if (index >= 0) {
      drafts[index] = draft;
    } else {
      drafts.push(draft);
    }

    localStorage.setItem('demandes_projet_drafts', JSON.stringify(drafts));
    this.showMessage('Le brouillon a été enregistré avec succès', 'success');

    this.resetForm();
    this.goToDrafts();
  }

  removeDraftIfExists() {
    const drafts = JSON.parse(localStorage.getItem('demandes_projet_drafts') || '[]');
    if (this.demande.draftId) {
      const updatedDrafts = drafts.filter((d: any) => d.draftId !== this.demande.draftId);
      localStorage.setItem('demandes_projet_drafts', JSON.stringify(updatedDrafts));
    }
  }

  validateForm(): boolean {
    return Boolean(this.demande.name) &&
           Boolean(this.demande.demandeAchatId) &&
           Boolean(this.demande.projetId) &&
           Boolean(this.demande.description);
  }

  showMessage(msg: string, type: string) {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  resetForm(preserveDraftId = false) {
    const draftId = preserveDraftId ? this.demande.draftId : null;
    this.demande = {
      name: '',
      demandeAchatId: '',
      projetId: '',
      description: '',
      draftId
    };
  }

  goToHome() {
    this.router.navigate(['/responsable']);
  }

  goToList() {
    this.router.navigate(['/demande-projet-list']);
  }

  goToDrafts() {
    this.router.navigate(['/demande-projet-drafts']);
  }
}
