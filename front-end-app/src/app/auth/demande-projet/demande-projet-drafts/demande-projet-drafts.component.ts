import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demande-projet-drafts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demande-projet-drafts.component.html',
  styleUrls: ['./demande-projet-drafts.component.scss']
})
export class DemandeProjetDraftsComponent implements OnInit {
  currentDate = new Date();
  drafts: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadDrafts();
  }

  loadDrafts() {
    const savedDrafts = localStorage.getItem('demandes_projet_drafts');
    this.drafts = savedDrafts ? JSON.parse(savedDrafts) : [];
  }

  editDraft(draft: any) {
    localStorage.setItem('editing_demande_projet', JSON.stringify(draft));
    this.router.navigate(['/create-demande-projet']);
  }

  deleteDraft(draft: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce brouillon ?')) {
      this.drafts = this.drafts.filter(d => d.draftId !== draft.draftId);
      localStorage.setItem('demandes_projet_drafts', JSON.stringify(this.drafts));
    }
  }

  submitDraft(draft: any) {
    const demandes = JSON.parse(localStorage.getItem('demandes_projet') || '[]');

    // Avoid duplicates based on name + projetId + demandeAchatId
    const exists = demandes.some((d: any) =>
      d.name === draft.name &&
      d.projetId === draft.projetId &&
      d.demandeAchatId === draft.demandeAchatId
    );

    if (!exists) {
      demandes.push({
        ...draft,
        date: new Date()
      });
      localStorage.setItem('demandes_projet', JSON.stringify(demandes));
      this.deleteDraft(draft);
      alert('Demande soumise avec succès !');
      this.loadDrafts();
    } else {
      alert('Cette demande a déjà été soumise.');
    }
  }

  goToHome() {
    this.router.navigate(['/responsable']);
  }

  goToCreate() {
    this.router.navigate(['/create-demande-projet']);
  }
}
