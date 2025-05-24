import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResponsableUserService } from '../responsable-user.service';

@Component({
  selector: 'app-responsable-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './responsable-profile.component.html',
  styleUrls: ['./responsable-profile.component.scss'],
  providers: [ResponsableUserService]
})
export class ResponsableProfileComponent implements OnInit {
  name: string = '';
  email: string = '';

  constructor(
    private router: Router,
    private userService: ResponsableUserService
  ) {}

  ngOnInit() {
    // Subscribe to current user data from the service
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.name = currentUser.name || '';
      this.email = currentUser.email || '';
    }
  }

  updateProfile() {
    // Update user data locally
    this.userService.updateUser({
      name: this.name,
      email: this.email
    });

    // TODO: Add backend update call here if you have API endpoint for profile update

    alert('Profil mis à jour localement.');
  }

  goBack() {
    this.router.navigate(['/responsable']);
  }

  logout() {
    // Clear tokens and user data
    localStorage.removeItem('auth_token');  // Clear auth token
    localStorage.removeItem('responsable_user'); // Clear stored user data in your service
    localStorage.removeItem('isAuthenticated');

    // Optionally notify service to clear user state
    this.userService.updateUser({ name: '', email: '', role: '' });

    this.router.navigate(['/login']);
  }
}
