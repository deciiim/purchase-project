import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DirecteurUserService } from '../directeur-user.service';

@Component({
  selector: 'app-director-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './director-profile.component.html',
  styleUrls: ['./director-profile.component.scss'],
  providers: [DirecteurUserService]
})
export class DirectorProfileComponent implements OnInit {
  name: string = '';
  email: string = '';

  constructor(
    private router: Router,
    private userService: DirecteurUserService
  ) {}

  ngOnInit() {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.name = currentUser.name || '';
      this.email = currentUser.email || '';
    }
  }

  updateProfile() {
    this.userService.updateUser({
      name: this.name,
      email: this.email
    });

    // Optional: You can call the backend API to persist the profile update
    alert('Profil mis à jour localement.');
  }

  goBack() {
    this.router.navigate(['/directeur']);
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('directeur_user');
    localStorage.removeItem('isAuthenticated');

    this.userService.updateUser({ name: '', email: '', role: '' });

    this.router.navigate(['/login']);
  }
}
