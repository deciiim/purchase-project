import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ResponsableUserService } from './responsable-user.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-responsable',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './responsable.component.html',
  styleUrls: ['./responsable.component.scss'],
  providers: [ResponsableUserService]
})
export class ResponsableComponent implements OnInit {
  today = new Date();
  username: string = '';

  constructor(
    private userService: ResponsableUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.setLastRoute('/responsable');

    // Subscribe to user observable to get updates
    this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.username = user.name || 'Responsable';
      } else {
        this.username = 'Responsable';
      }
    });

    // Trigger fetch from backend
    this.userService.fetchUserProfile().subscribe({
      next: user => {
        if (user) {
          this.userService.updateUser(user);
        }
      },
      error: err => {
        console.error('Erreur lors de la récupération du profil:', err);
      }
    });
  }

  goToCreateBC() {
    this.router.navigate(['/create-bc']); 
  }

  goToCreatePro() {
    this.router.navigate(['/createpro']);
  }

  goToCreateDemandeProjet() {
    this.router.navigate(['/create-demande-projet']);
  }

  goToAddFournisseur() {
    this.router.navigate(['/add-fournisseur']);
  }

  goToLatestRequests() {
    this.router.navigate(['/latest-requests']);
  }

  goToHome() {
    this.router.navigate(['/responsable']);
  }

  goToPurchases() {
    this.router.navigate(['/purchases']);
  }

  goToFournisseurs() {
    this.router.navigate(['/fournisseurlist']);
  }

  goToProfile() {
    this.router.navigate(['/responsable-profile'])
      .then(() => console.log('Navigation terminée'))
      .catch(err => console.error('Erreur de navigation:', err));
  }

  goToBCList() {
    this.router.navigate(['/bclist']);
  }

  goToProjectList() {
    this.router.navigate(['/projectlist']);
  }

  goToDemandeProjetList() {
    this.router.navigate(['/demande-projet-list']);
  }
}
