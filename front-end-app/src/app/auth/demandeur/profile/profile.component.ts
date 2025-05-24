import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DemandeurUserService } from '../demandeur-user.service';
import { PurchaseService } from '../purchase/purchase.service'
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: { name: string; email: string } | null = null;
  stats = { totalRequests: 0, pendingRequests: 0, approvedRequests: 0, rejectedRequests: 0 };
  message = '';
  messageType = '';
  private userSub: Subscription | null = null;
  private statsSub: Subscription | null = null;

  constructor(
    private userService: DemandeurUserService,
    private purchaseService: PurchaseService,  // inject PurchaseService
    private router: Router
  ) {}

  ngOnInit() {
    console.log('[ProfileComponent] ngOnInit started');
    
    this.userSub = this.userService.currentUser$.subscribe(user => {
      console.log('[ProfileComponent] currentUser$ emitted:', user);
      if (user) {
        this.user = {
          name: user.name || user.name || '',
          email: user.email || ''
        };

        if (!this.user.name || !this.user.email) {
          console.warn('[ProfileComponent] User data incomplete or missing');
        }
      } else {
        this.user = null;
        console.warn('[ProfileComponent] No user data received');
      }
    });

    this.loadStatsFromBackend();
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
    this.statsSub?.unsubscribe();
  }

  loadStatsFromBackend() {
    this.statsSub = this.purchaseService.getPurchaseStats().subscribe({
      next: (stats) => {
        console.log('[ProfileComponent] Received stats from backend:', stats);
        this.stats = {
          totalRequests: stats.total || 0,
          pendingRequests: stats.byStatus?.PENDING || 0,
          approvedRequests: stats.byStatus?.APPROVED || 0,
          rejectedRequests: stats.byStatus?.REJECTED || 0,
        };
      },
      error: (err) => {
        console.error('[ProfileComponent] Error loading stats from backend:', err);
        this.stats = { totalRequests: 0, pendingRequests: 0, approvedRequests: 0, rejectedRequests: 0 };
      }
    });
  }
  

  saveUser() {
    if (!this.user) return;
    if (!this.user.name.trim() || !this.user.email.trim()) {
      this.showMessage('Nom et email sont obligatoires.', 'error');
      return;
    }

    console.log('[ProfileComponent] Saving user:', this.user);
    this.userService.updateUser(this.user);
    this.showMessage('Profil mis à jour avec succès.', 'success');
  }

  logout() {
    console.log('[ProfileComponent] Logging out user');
  
    // Clear local storage keys related to authentication
    localStorage.removeItem('auth_token');
    localStorage.removeItem('demandeur_user');
    localStorage.removeItem('isAuthenticated');
  
    // Clear the current user in the service
    this.userService.updateUser({ name: '', email: '', role: '' });
  
    // Navigate to login page
    this.router.navigate(['/login']);
  }
  

  getUserInitials(): string {
    if (!this.user || !this.user.name) return 'U';
    const names = this.user.name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
  }

  showMessage(msg: string, type: string) {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 3000);
  }

  goBack() {
    const lastRoute = this.userService.getLastRoute() || '/demandeur';
    console.log('[ProfileComponent] Navigating back to:', lastRoute);
    this.router.navigate([lastRoute]);
  }
}
