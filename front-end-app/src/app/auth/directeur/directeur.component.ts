import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DirecteurUserService } from './directeur-user.service';

@Component({
  selector: 'app-directeur',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './directeur.component.html',
  styleUrls: ['./directeur.component.scss'],
  providers: [DirecteurUserService]
})
export class DirecteurComponent implements OnInit {
  today: Date = new Date();
  username: string = '';

  constructor(
    private router: Router,
    private userService: DirecteurUserService
  ) {}

  ngOnInit(): void {
    this.userService.setLastRoute('/directeur');
  
    this.userService.currentUser$.subscribe(user => {
      this.username = user?.name || 'Directeur';
    });
  
    this.userService.fetchUserProfile().subscribe({
      next: (user) => {
        if (user) {
          this.userService.updateUser(user);
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil:', err);
      }
    });
  }
  

  goToProfile() {
    this.router.navigate(['/directeur/profile']);
  }

  goToProjectRequests() {
    this.router.navigateByUrl('/directeur/project-requests');
  }
}
