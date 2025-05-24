import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DemandeurUserService } from './demandeur-user.service';
import { AuthService } from '../auth.service'; // Adjust path if needed

interface Request {
  qte: number;
  details: string;
  requestNumber: string;
  date: Date;
  status?: string;
  username?: string;
}

@Component({
  selector: 'app-demandeur',
  standalone: true,
  templateUrl: './demandeur.component.html',
  styleUrls: ['./demandeur.component.scss'],
  imports: [FormsModule, CommonModule, RouterModule],
  providers: [
    {
      provide: DemandeurUserService,
      useClass: DemandeurUserService
    }
  ]
})
export class DemandeurComponent implements OnInit {
  currentDate: Date = new Date();
  username: string = '';
  requestNumber: string = '';

  request: Request = {
    qte: 1,
    details: '',
    requestNumber: '',
    date: new Date()
  };

  constructor(
    private userService: DemandeurUserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.username = user?.name || 'Invité';

    this.userService.setLastRoute('/demandeur');

    const currentDraft = localStorage.getItem('currentDraft');
    if (currentDraft) {
      this.request = JSON.parse(currentDraft);
      localStorage.removeItem('currentDraft');
    } else {
      this.generateRequestNumber();
    }
  }

  generateRequestNumber() {
    const random = Math.floor(1000 + Math.random() * 9000);
    this.requestNumber = `DEM-${random}`;
  }

  submitRequest() {
    const payload = {
      description: this.request.details,
      quantite: this.request.qte > 0 ? this.request.qte : 1,
    };
  
    this.userService.submitDemandeAchat(payload).subscribe({
      next: (res) => {
        alert('Votre demande a été soumise avec succès !');
  
        // Reset form
        this.request = {
          qte: 1,
          details: '',
          requestNumber: '',
          date: new Date()
        };
        this.generateRequestNumber();
      },
      error: (err) => {
        console.error('Erreur lors de la soumission:', err);
        alert("Échec de la soumission de la demande d'achat.");
      }
    });
  }
  

  saveAsDraft() {
    const draft = {
      ...this.request,
      requestNumber: this.requestNumber,
      date: new Date(),
      status: 'brouillon',
      username: this.username
    };

    const drafts = JSON.parse(localStorage.getItem('draftRequests') || '[]');
    drafts.push(draft);
    localStorage.setItem('draftRequests', JSON.stringify(drafts));

    this.request = {
      qte: 1,
      details: '',
      requestNumber: '',
      date: new Date()
    };

    alert('Le brouillon a été enregistré avec succès !');
    this.generateRequestNumber();
  }

  goToPurchases() {
    this.router.navigate(['/purchases']);
  }

  validateQuantity(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value);

    if (value < 0) {
      value = 1;
      input.value = '1';
    }

    this.request.qte = value;
  }

  goToProfile() {
    this.router.navigate(['/profile']).catch(err => {
      console.error('Erreur de navigation:', err);
    });
  }
}
